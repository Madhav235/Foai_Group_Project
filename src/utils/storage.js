const WORKSPACES_KEY = "workspaces";
const TIMETABLES_KEY = "timetables";

const parseStored = (key) => {
  const raw = localStorage.getItem(key);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const saveStored = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const generateId = () =>
  window.crypto?.randomUUID?.() ||
  `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

export const getWorkspaces = () => parseStored(WORKSPACES_KEY);
export const saveWorkspaces = (workspaces) =>
  saveStored(WORKSPACES_KEY, workspaces);
export const getWorkspaceById = (workspaceId) =>
  getWorkspaces().find((workspace) => workspace.id === workspaceId) ?? null;

export const createWorkspace = (workspace) => {
  const workspaces = getWorkspaces();
  const savedWorkspace = {
    id: workspace.id || generateId(),
    name: workspace.name,
    studentsCSV: workspace.studentsCSV || null,
    roomsCSV: workspace.roomsCSV || null,
    daysCSV: workspace.daysCSV || null,
    timetables: workspace.timetables || [],
    createdAt: workspace.createdAt || Date.now(),
  };

  workspaces.push(savedWorkspace);
  saveWorkspaces(workspaces);
  return savedWorkspace;
};

export const updateWorkspace = (updatedWorkspace) => {
  const workspaces = getWorkspaces().map((workspace) =>
    workspace.id === updatedWorkspace.id
      ? {
          ...workspace,
          name: updatedWorkspace.name,
          studentsCSV: updatedWorkspace.studentsCSV,
          roomsCSV: updatedWorkspace.roomsCSV,
          daysCSV: updatedWorkspace.daysCSV,
          timetables: updatedWorkspace.timetables || workspace.timetables,
        }
      : workspace,
  );

  saveWorkspaces(workspaces);
  return getWorkspaceById(updatedWorkspace.id);
};

export const deleteWorkspace = (workspaceId) => {
  const workspaces = getWorkspaces().filter(
    (workspace) => workspace.id !== workspaceId,
  );
  saveWorkspaces(workspaces);

  const timetables = getTimetables().map((timetable) =>
    timetable.workspaceId === workspaceId
      ? { ...timetable, workspaceId: null }
      : timetable,
  );
  saveTimetables(timetables);
};

export const getTimetables = () => parseStored(TIMETABLES_KEY);
export const saveTimetables = (timetables) =>
  saveStored(TIMETABLES_KEY, timetables);
export const getTimetableById = (timetableId) =>
  getTimetables().find((timetable) => timetable.id === timetableId) ?? null;

export const getRecentTimetables = () =>
  getTimetables()
    .slice()
    .sort((a, b) => b.createdAt - a.createdAt);

export const getTimetablesByWorkspaceId = (workspaceId) =>
  getTimetables()
    .filter((timetable) => timetable.workspaceId === workspaceId)
    .sort((a, b) => b.createdAt - a.createdAt);

const removeTimetableIdFromWorkspace = (workspace, timetableId) => {
  return {
    ...workspace,
    timetables: Array.isArray(workspace.timetables)
      ? workspace.timetables.filter((id) => id !== timetableId)
      : [],
  };
};

const addTimetableIdToWorkspace = (workspace, timetableId) => {
  return {
    ...workspace,
    timetables: Array.from(
      new Set([...(workspace.timetables || []), timetableId]),
    ),
  };
};

export const createTimetable = (data, workspaceId = null) => {
  const timetables = getTimetables();
  const newTimetable = {
    id: generateId(),
    workspaceId: workspaceId || null,
    data,
    createdAt: Date.now(),
  };

  timetables.push(newTimetable);
  saveTimetables(timetables);

  if (workspaceId) {
    const workspaces = getWorkspaces().map((workspace) =>
      workspace.id === workspaceId
        ? addTimetableIdToWorkspace(workspace, newTimetable.id)
        : workspace,
    );
    saveWorkspaces(workspaces);
  }

  return newTimetable;
};

export const updateTimetableWorkspaceId = (timetableId, workspaceId) => {
  const timetables = getTimetables();
  const timetable = timetables.find((item) => item.id === timetableId);
  if (!timetable) return null;

  const oldWorkspaceId = timetable.workspaceId;
  const updatedTimetables = timetables.map((item) =>
    item.id === timetableId
      ? { ...item, workspaceId: workspaceId || null }
      : item,
  );
  saveTimetables(updatedTimetables);

  const workspaces = getWorkspaces().map((workspace) => {
    if (workspace.id === oldWorkspaceId) {
      return removeTimetableIdFromWorkspace(workspace, timetableId);
    }

    if (workspace.id === workspaceId) {
      return addTimetableIdToWorkspace(workspace, timetableId);
    }

    return workspace;
  });
  saveWorkspaces(workspaces);

  return updatedTimetables.find((item) => item.id === timetableId) || null;
};
