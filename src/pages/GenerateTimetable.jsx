import { useState } from "react";

function GenerateTimetable() {
  const [studentsFile, setStudentsFile] = useState(null);
  const [roomsFile, setRoomsFile] = useState(null);
  const [daysFile, setDaysFile] = useState(null);

  const handleFileChange = (setter) => (event) => {
    const file = event.target.files?.[0] ?? null;
    setter(file);
  };

  const handleSubmit = () => {
    if (studentsFile && roomsFile && daysFile) {
      console.log("Students CSV:", studentsFile);
      console.log("Rooms CSV:", roomsFile);
      console.log("Days CSV:", daysFile);
    }
  };

  const allFilesSelected = studentsFile && roomsFile && daysFile;

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10 sm:px-6">
      <div className="w-full max-w-2xl rounded-[32px] border border-slate-200 bg-white px-6 py-10 shadow-xl sm:px-10">
        <div className="text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
            Generate Timetable
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-500">
            Upload required CSV files to proceed
          </p>
        </div>

        <div className="mt-10 space-y-6">
          <label className="block rounded-3xl border border-slate-200 bg-slate-50 p-4">
            <span className="mb-2 block text-sm font-medium text-slate-700">
              Students CSV
            </span>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange(setStudentsFile)}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition file:mr-4 file:rounded-full file:border-0 file:bg-slate-900 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-slate-800"
            />
            <p className="mt-2 text-xs text-slate-500">
              {studentsFile
                ? studentsFile.name
                : "Upload the student roster CSV file"}
            </p>
          </label>

          <label className="block rounded-3xl border border-slate-200 bg-slate-50 p-4">
            <span className="mb-2 block text-sm font-medium text-slate-700">
              Rooms CSV
            </span>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange(setRoomsFile)}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition file:mr-4 file:rounded-full file:border-0 file:bg-slate-900 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-slate-800"
            />
            <p className="mt-2 text-xs text-slate-500">
              {roomsFile
                ? roomsFile.name
                : "Upload the available rooms CSV file"}
            </p>
          </label>

          <label className="block rounded-3xl border border-slate-200 bg-slate-50 p-4">
            <span className="mb-2 block text-sm font-medium text-slate-700">
              Days CSV
            </span>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange(setDaysFile)}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition file:mr-4 file:rounded-full file:border-0 file:bg-slate-900 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-slate-800"
            />
            <p className="mt-2 text-xs text-slate-500">
              {daysFile ? daysFile.name : "Upload the timetable days CSV file"}
            </p>
          </label>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={!allFilesSelected}
          className={`mt-8 w-full rounded-full px-6 py-3 text-sm font-semibold transition ${
            allFilesSelected
              ? "bg-slate-900 text-white shadow-lg shadow-slate-900/10 hover:bg-slate-800"
              : "cursor-not-allowed bg-slate-200 text-slate-400"
          }`}
        >
          Generate Timetable
        </button>
      </div>
    </div>
  );
}

export default GenerateTimetable;
