import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  createTimetable,
  getWorkspaces,
  updateWorkspace,
} from "../utils/storage";
import {
  parseAllCSVs,
  parseDaysFile,
  parseRoomsFile,
  parseStudentsFile,
} from "../utils/csvParser";

// const URL = "https://foai-group-project-n8n-host.onrender.com/webhook/get-data-2"
const URL = "http://localhost:5678/webhook/get-data-2"

function GenerateTimetable() {
  const [studentsFile, setStudentsFile] = useState(null);
  const [roomsFile, setRoomsFile] = useState(null);
  const [daysFile, setDaysFile] = useState(null);
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState(null);
  const [selectedWorkspace, setSelectedWorkspace] = useState(null);
  const [workspaceChoiceOpen, setWorkspaceChoiceOpen] = useState(true);
  const [workspaceMode, setWorkspaceMode] = useState(null);
  const [workspaces, setWorkspaces] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [errorList, setErrorList] = useState([]);
  const [fileInputKey, setFileInputKey] = useState(Date.now());
  const navigate = useNavigate();

  useEffect(() => {
    setWorkspaces(getWorkspaces());
  }, []);

  useEffect(() => {
    const workspace =
      workspaces.find((item) => item.id === selectedWorkspaceId) ?? null;
    setSelectedWorkspace(workspace);
  }, [selectedWorkspaceId, workspaces]);

  const workspaceFileNames = useMemo(
    () => ({
      students: selectedWorkspace?.studentsCSV?.fileName ?? "No workspace file",
      rooms: selectedWorkspace?.roomsCSV?.fileName ?? "No workspace file",
      days: selectedWorkspace?.daysCSV?.fileName ?? "No workspace file",
    }),
    [selectedWorkspace],
  );

  const handleFileChange = (setter) => (event) => {
    const file = event.target.files?.[0] ?? null;
    setter(file);
  };

  const handleWorkspaceChoice = (mode) => {
    setWorkspaceMode(mode);
    setWorkspaceChoiceOpen(mode === "existing");
    if (mode === "new") {
      setSelectedWorkspaceId(null);
      setSelectedWorkspace(null);
      setWorkspaceChoiceOpen(false);
    }
  };

  const selectWorkspace = (workspaceId) => {
    setSelectedWorkspaceId(workspaceId);
    setWorkspaceChoiceOpen(false);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    try {
      const studentsData = studentsFile
        ? await parseStudentsFile(studentsFile)
        : selectedWorkspace?.studentsCSV?.data;
      const roomsData = roomsFile
        ? await parseRoomsFile(roomsFile)
        : selectedWorkspace?.roomsCSV?.data;
      const daysData = daysFile
        ? await parseDaysFile(daysFile)
        : selectedWorkspace?.daysCSV?.data;

      if (!studentsData || !roomsData || !daysData) {
        throw new Error("All three CSV data sources are required.");
      }

      if (selectedWorkspace) {
        const workspaceUpdate = {
          ...selectedWorkspace,
          studentsCSV: studentsFile
            ? { fileName: studentsFile.name, data: studentsData }
            : selectedWorkspace.studentsCSV,
          roomsCSV: roomsFile
            ? { fileName: roomsFile.name, data: roomsData }
            : selectedWorkspace.roomsCSV,
          daysCSV: daysFile
            ? { fileName: daysFile.name, data: daysData }
            : selectedWorkspace.daysCSV,
        };
        updateWorkspace(workspaceUpdate);
        setSelectedWorkspace(workspaceUpdate);
      }

      const payload = {
        students: studentsData,
        rooms: roomsData,
        days: daysData,
      };

      const response = await fetch(`${URL}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const contentType = response.headers.get("content-type");
      let responseData = null;

      if (contentType && contentType.includes("application/json")) {
        const text = await response.text();
        if (text) {
          responseData = JSON.parse(text);
        }
      }

      if (!responseData) {
        throw new Error("No data received from server");
      }

      if (responseData.status === false) {
        setErrorList(responseData.errors || []);
        setErrorModalOpen(true);
        setLoading(false);
        return;
      }

      const timetableData = responseData.data || responseData;

      const timetable = createTimetable(
        timetableData,
        selectedWorkspace?.id ?? null,
      );
      navigate(`/schedule?t=${timetable.id}`, {
        state: {
          timetableId: timetable.id,
          data: timetableData,
          workspaceId: timetable.workspaceId,
        },
      });
    } catch (err) {
      console.error("Error:", err);
      setError(
        err instanceof Error ? err.message : "Failed to process request",
      );
    } finally {
      setLoading(false);
    }
  };

  const allFilesSelected =
    Boolean(studentsFile || selectedWorkspace?.studentsCSV) &&
    Boolean(roomsFile || selectedWorkspace?.roomsCSV) &&
    Boolean(daysFile || selectedWorkspace?.daysCSV);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10 sm:px-6">
      <div className="w-full max-w-2xl rounded-[32px] border border-slate-200 bg-white px-6 py-10 shadow-xl sm:px-10">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
        >
          ← Back to Dashboard
        </button>

        <div className="text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
            Generate Timetable
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-500">
            Upload required CSV files or reuse a workspace.
          </p>
        </div>

        {selectedWorkspace ? (
          <div className="mt-8 rounded-[32px] border border-slate-200 bg-slate-50 p-5 text-sm text-slate-700">
            <p className="font-semibold text-slate-950">Using workspace:</p>
            <p className="mt-2 text-base font-semibold text-slate-900">
              {selectedWorkspace.name}
            </p>
            <div className="mt-3 space-y-2 text-slate-600">
              <p>Students CSV: {workspaceFileNames.students}</p>
              <p>Rooms CSV: {workspaceFileNames.rooms}</p>
              <p>Days CSV: {workspaceFileNames.days}</p>
            </div>
            <p className="mt-4 text-sm text-slate-500">
              Upload new CSVs to override the workspace values.
            </p>
          </div>
        ) : null}

        <div className="mt-10 space-y-6" key={fileInputKey}>
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
                : selectedWorkspace?.studentsCSV?.fileName
                  ? `Workspace file: ${selectedWorkspace.studentsCSV.fileName}`
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
                : selectedWorkspace?.roomsCSV?.fileName
                  ? `Workspace file: ${selectedWorkspace.roomsCSV.fileName}`
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
              {daysFile
                ? daysFile.name
                : selectedWorkspace?.daysCSV?.fileName
                  ? `Workspace file: ${selectedWorkspace.daysCSV.fileName}`
                  : "Upload the timetable days CSV file"}
            </p>
          </label>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={!allFilesSelected || loading}
          className={`mt-8 w-full rounded-full px-6 py-3 text-sm font-semibold transition ${allFilesSelected && !loading
              ? "bg-slate-900 text-white shadow-lg shadow-slate-900/10 hover:bg-slate-800"
              : "cursor-not-allowed bg-slate-200 text-slate-400"
            }`}
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <svg className="h-5 w-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating...
            </div>
          ) : (
            "Generate Timetable"
          )}
        </button>

        {error ? (
          <p className="mt-4 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </p>
        ) : null}
      </div>

      {workspaceChoiceOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6">
          <div className="w-full max-w-lg rounded-[28px] bg-white p-8 shadow-2xl ring-1 ring-slate-200">
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-semibold text-slate-950">
                Start with a workspace
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Choose an existing workspace or create a new one before
                uploading.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => handleWorkspaceChoice("existing")}
                className="rounded-[24px] border border-slate-200 bg-slate-50 px-6 py-5 text-left text-base font-semibold text-slate-900 transition hover:border-slate-300 hover:bg-slate-100"
              >
                Use Existing Workspace
              </button>
              <button
                type="button"
                onClick={() => handleWorkspaceChoice("new")}
                className="rounded-[24px] border border-slate-200 bg-white px-6 py-5 text-left text-base font-semibold text-slate-900 transition hover:border-slate-300 hover:bg-slate-50"
              >
                Create New
              </button>
            </div>

            {workspaceMode === "existing" ? (
              <div className="mt-8 space-y-4">
                {workspaces.length ? (
                  workspaces.map((workspace) => (
                    <button
                      key={workspace.id}
                      type="button"
                      onClick={() => selectWorkspace(workspace.id)}
                      className="w-full rounded-[20px] border border-slate-200 bg-slate-50 px-5 py-4 text-left text-base font-semibold text-slate-900 transition hover:border-slate-300 hover:bg-slate-100"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <div>{workspace.name}</div>
                          <p className="mt-1 text-sm text-slate-500">
                            Created{" "}
                            {new Date(workspace.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <span className="rounded-full border border-slate-300 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-slate-600">
                          Choose
                        </span>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="rounded-[20px] border border-slate-200 bg-slate-50 px-8 py-12 text-center text-slate-600">
                    <p className="text-lg font-semibold text-slate-950">
                      No workspaces available
                    </p>
                    <p className="mt-2 text-sm">
                      Add a workspace first, or choose Create New.
                    </p>
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </div>
      ) : null}

      {errorModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative flex w-full max-w-[500px] max-h-[70vh] flex-col rounded-[24px] bg-white p-6 shadow-2xl ring-1 ring-slate-200 sm:p-8">
            <button
              onClick={() => setErrorModalOpen(false)}
              className="absolute right-5 top-5 rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
            <div className="mb-5">
              <h2 className="mb-1 text-xl font-semibold text-rose-600">Validation Errors</h2>
              <p className="text-sm text-slate-500">Please fix the following issues before continuing</p>
            </div>

            <div className="mb-6 flex-1 space-y-2 overflow-y-auto pr-2 max-h-[300px]">
              {errorList.map((err, idx) => (
                <div key={idx} className="flex items-start gap-2 rounded-xl bg-rose-50 px-4 py-2.5 text-sm text-rose-700 animate-in fade-in slide-in-from-bottom-2 duration-300" style={{ animationDelay: `${idx * 50}ms`, animationFillMode: "both" }}>
                  <span className="mt-0.5 text-base leading-none">⚠️</span>
                  <span>{err}</span>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => {
                setErrorModalOpen(false);
                setErrorList([]);
                setStudentsFile(null);
                setRoomsFile(null);
                setDaysFile(null);
                setFileInputKey(Date.now());
              }}
              className="w-full rounded-full bg-slate-900 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/10 transition hover:bg-slate-800"
            >
              Upload CSV Again
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default GenerateTimetable;
