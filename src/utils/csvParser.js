const readFileText = (file) =>
  new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error("File is missing"));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsText(file);
  });

const parseCsvText = (text) => {
  const rows = [];
  let currentRow = [];
  let currentField = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (inQuotes) {
      if (char === '"') {
        if (nextChar === '"') {
          currentField += '"';
          i += 1;
        } else {
          inQuotes = false;
        }
      } else {
        currentField += char;
      }
      continue;
    }

    if (char === '"') {
      inQuotes = true;
      continue;
    }

    if (char === ",") {
      currentRow.push(currentField);
      currentField = "";
      continue;
    }

    if (char === "\r") {
      if (nextChar === "\n") {
        i += 1;
      }
      currentRow.push(currentField);
      rows.push(currentRow);
      currentRow = [];
      currentField = "";
      continue;
    }

    if (char === "\n") {
      currentRow.push(currentField);
      rows.push(currentRow);
      currentRow = [];
      currentField = "";
      continue;
    }

    currentField += char;
  }

  currentRow.push(currentField);
  if (currentRow.length > 1 || currentRow[0] !== "") {
    rows.push(currentRow);
  }

  return rows;
};

const rowsToObjects = (rows) => {
  if (!rows.length) return [];

  const header = rows[0].map((cell) => String(cell).trim().toLowerCase());
  return rows.slice(1).reduce((list, row, rowIndex) => {
    if (row.length === 1 && row[0] === "") {
      return list;
    }

    const rowObject = {};
    for (let i = 0; i < header.length; i += 1) {
      rowObject[header[i]] = String(row[i] ?? "").trim();
    }

    const hasValue = Object.values(rowObject).some((value) => value !== "");
    if (hasValue) {
      list.push(rowObject);
    }

    return list;
  }, []);
};

const parseStudentsCsv = (csvText) => {
  const rows = parseCsvText(csvText);
  const objects = rowsToObjects(rows);

  if (!objects.length) {
    throw new Error("Students CSV is empty or invalid");
  }

  return objects.map((row, index) => {
    const name = row.name ?? "";
    const urn = row.urn ?? "";
    const subjectsRaw = row.subjects ?? "";
    const subjects = subjectsRaw
      .split("|")
      .map((subject) => subject.trim())
      .filter(Boolean);

    if (!name || !urn) {
      console.warn(`Students CSV row ${index + 2} is missing name or urn`);
    }

    return {
      name,
      urn,
      subjects,
    };
  });
};

const parseRoomsCsv = (csvText) => {
  const rows = parseCsvText(csvText);
  const objects = rowsToObjects(rows);

  if (!objects.length) {
    throw new Error("Rooms CSV is empty or invalid");
  }

  return objects.map((row, index) => {
    const room = row.room ?? "";
    const capacity = Number(row.capacity ?? "");

    if (!room) {
      console.warn(`Rooms CSV row ${index + 2} is missing room name`);
    }

    if (Number.isNaN(capacity)) {
      console.warn(
        `Rooms CSV row ${index + 2} has invalid capacity, defaulting to 0`,
      );
    }

    return {
      room,
      capacity: Number.isNaN(capacity) ? 0 : capacity,
    };
  });
};

const parseDaysCsv = (csvText) => {
  const rows = parseCsvText(csvText);
  const objects = rowsToObjects(rows);

  if (!objects.length) {
    throw new Error("Days CSV is empty or invalid");
  }

  const grouped = objects.reduce((acc, row, index) => {
    const day = row.day ?? "";
    const date = row.date ?? "";
    const start = row.start ?? "";
    const end = row.end ?? "";

    if (!day || !date || !start || !end) {
      console.warn(
        `Days CSV row ${index + 2} is missing one of day, date, start, or end`,
      );
      return acc;
    }

    const key = `${day}||${date}`;
    if (!acc[key]) {
      acc[key] = {
        day,
        date,
        slots: [],
      };
    }

    acc[key].slots.push({ start, end });
    return acc;
  }, {});

  return Object.values(grouped);
};

export const parseAllCSVs = async (studentsFile, roomsFile, daysFile) => {
  if (!studentsFile || !roomsFile || !daysFile) {
    throw new Error("All three CSV files are required");
  }

  const [studentsText, roomsText, daysText] = await Promise.all([
    readFileText(studentsFile),
    readFileText(roomsFile),
    readFileText(daysFile),
  ]);

  const students = parseStudentsCsv(studentsText);
  const rooms = parseRoomsCsv(roomsText);
  const days = parseDaysCsv(daysText);

  const result = {
    students,
    rooms,
    days,
  };

  console.log("Parsed CSV result:", result);
  return result;
};
