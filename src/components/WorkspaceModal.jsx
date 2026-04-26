import { useEffect, useState } from "react";
import {
  parseDaysFile,
  parseRoomsFile,
  parseStudentsFile,
} from "../utils/csvParser";

export default function WorkspaceModal({ isOpen, onClose, onSave, workspace }) {
  const [name, setName] = useState("");
  const [studentsFile, setStudentsFile] = useState(null);
  const [roomsFile, setRoomsFile] = useState(null);
  const [daysFile, setDaysFile] = useState(null);
  const [studentsCSV, setStudentsCSV] = useState(null);
  const [roomsCSV, setRoomsCSV] = useState(null);
  const [daysCSV, setDaysCSV] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!workspace) {
      setName("");
      setStudentsFile(null);
      setRoomsFile(null);
      setDaysFile(null);
      setStudentsCSV(null);
      setRoomsCSV(null);
      setDaysCSV(null);
      setError("");
      return;
    }

    setName(workspace.name || "");
    setStudentsFile(null);
    setRoomsFile(null);
    setDaysFile(null);
    setStudentsCSV(workspace.studentsCSV || null);
    setRoomsCSV(workspace.roomsCSV || null);
    setDaysCSV(workspace.daysCSV || null);
    setError("");
  }, [workspace, isOpen]);

  const handleFileChange = (setter) => (event) => {
    const file = event.target.files?.[0] ?? null;
    setter(file);
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError("Workspace name is required.");
      return;
    }

    if (
      (!studentsCSV && !studentsFile) ||
      (!roomsCSV && !roomsFile) ||
      (!daysCSV && !daysFile)
    ) {
      setError("All three CSV files are required.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const studentsData = studentsFile
        ? await parseStudentsFile(studentsFile)
        : studentsCSV?.data;
      const roomsData = roomsFile
        ? await parseRoomsFile(roomsFile)
        : roomsCSV?.data;
      const daysData = daysFile ? await parseDaysFile(daysFile) : daysCSV?.data;

      if (!studentsData || !roomsData || !daysData) {
        throw new Error("Unable to load CSV content.");
      }

      onSave({
        id: workspace?.id,
        name: name.trim(),
        studentsCSV: studentsFile
          ? { fileName: studentsFile.name, data: studentsData }
          : studentsCSV,
        roomsCSV: roomsFile
          ? { fileName: roomsFile.name, data: roomsData }
          : roomsCSV,
        daysCSV: daysFile
          ? { fileName: daysFile.name, data: daysData }
          : daysCSV,
        timetables: workspace?.timetables || [],
        createdAt: workspace?.createdAt,
      });
      onClose();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to parse CSV files.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 px-4 py-6"
      onClick={onClose}
    >
      <div
        className="relative mx-auto w-full max-w-2xl overflow-hidden rounded-[28px] bg-white shadow-2xl ring-1 ring-slate-200"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex flex-col gap-4 border-b border-slate-200 bg-slate-950 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-white">
              {workspace ? "Edit Workspace" : "Add Workspace"}
            </h2>
            <p className="mt-1 text-sm text-slate-300">
              Save workspace CSV details for reuse in future timetable builds.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center rounded-full bg-slate-200 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-slate-300"
          >
            Close
          </button>
        </div>

        <div className="space-y-5 px-6 py-8">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">
              Workspace Name
            </span>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
              placeholder="Enter workspace name"
            />
          </label>

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
              {studentsFile?.name ||
                studentsCSV?.fileName ||
                "Upload the student roster CSV"}
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
              {roomsFile?.name || roomsCSV?.fileName || "Upload the rooms CSV"}
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
              {daysFile?.name || daysCSV?.fileName || "Upload the days CSV"}
            </p>
          </label>

          {error ? (
            <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {error}
            </p>
          ) : null}

          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className={`w-full rounded-full px-6 py-3 text-sm font-semibold transition ${
              loading
                ? "cursor-not-allowed bg-slate-200 text-slate-400"
                : "bg-slate-900 text-white hover:bg-slate-800"
            }`}
          >
            {loading ? "Saving..." : "Save Workspace"}
          </button>
        </div>
      </div>
    </div>
  );
}
