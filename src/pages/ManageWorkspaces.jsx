import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import WorkspaceModal from "../components/WorkspaceModal";
import {
  createWorkspace,
  deleteWorkspace,
  getTimetables,
  getTimetablesByWorkspaceId,
  getWorkspaces,
  updateWorkspace,
} from "../utils/storage";

function ManageWorkspaces() {
  const navigate = useNavigate();
  const [workspaces, setWorkspaces] = useState([]);
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWorkspace, setEditingWorkspace] = useState(null);

  const selectedWorkspace = useMemo(
    () =>
      workspaces.find((workspace) => workspace.id === selectedWorkspaceId) ||
      null,
    [selectedWorkspaceId, workspaces],
  );

  const workspaceTimetables = useMemo(
    () =>
      selectedWorkspaceId
        ? getTimetablesByWorkspaceId(selectedWorkspaceId)
        : [],
    [selectedWorkspaceId],
  );

  const loadWorkspaces = () => {
    const loaded = getWorkspaces();
    setWorkspaces(loaded);
    if (
      selectedWorkspaceId &&
      !loaded.some((workspace) => workspace.id === selectedWorkspaceId)
    ) {
      setSelectedWorkspaceId(null);
    }
  };

  useEffect(() => {
    loadWorkspaces();
  }, []);

  const handleAddWorkspace = () => {
    setEditingWorkspace(null);
    setIsModalOpen(true);
  };

  const handleEditWorkspace = (workspace) => {
    setEditingWorkspace(workspace);
    setIsModalOpen(true);
  };

  const handleSelectWorkspace = (workspace) => {
    setSelectedWorkspaceId(workspace.id);
  };

  const handleSaveWorkspace = (workspace) => {
    if (workspace.id) {
      updateWorkspace(workspace);
    } else {
      createWorkspace(workspace);
    }
    loadWorkspaces();
    setEditingWorkspace(null);
    setIsModalOpen(false);
  };

  const handleDeleteWorkspace = (workspaceId) => {
    deleteWorkspace(workspaceId);
    if (selectedWorkspaceId === workspaceId) {
      setSelectedWorkspaceId(null);
    }
    loadWorkspaces();
  };

  const handleOpenTimetable = (timetableId) => {
    navigate(`/schedule?t=${timetableId}`, {
      state: { timetableId },
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto flex min-h-screen max-w-[1600px]">
        <Sidebar />
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="mb-8 flex flex-col gap-6 rounded-[36px] border border-slate-200 bg-white px-6 py-8 shadow-xl sm:flex-row sm:items-center sm:justify-between sm:px-10">
              <div>
                <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
                  Manage Workspaces
                </h1>
                <p className="mt-2 text-sm text-slate-500">
                  Create, edit, and delete reusable workspace CSV collections.
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddWorkspace}
                className="inline-flex items-center justify-center rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/10 transition hover:bg-slate-800"
              >
                Add Workspace
              </button>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1.25fr_0.9fr]">
              <section className="space-y-4">
                {workspaces.length ? (
                  workspaces.map((workspace) => (
                    <div
                      key={workspace.id}
                      className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm"
                    >
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <button
                            type="button"
                            onClick={() => handleSelectWorkspace(workspace)}
                            className="text-left"
                          >
                            <h2 className="text-xl font-semibold text-slate-950">
                              {workspace.name}
                            </h2>
                            <p className="mt-2 text-sm text-slate-500">
                              Created{" "}
                              {new Date(workspace.createdAt).toLocaleString()}
                            </p>
                          </button>
                        </div>

                        <div className="flex flex-wrap gap-3">
                          <button
                            type="button"
                            onClick={() => handleEditWorkspace(workspace)}
                            className="rounded-full border border-slate-300 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteWorkspace(workspace.id)}
                            className="rounded-full border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-100"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-[28px] border border-slate-200 bg-white p-8 text-center text-slate-600 shadow-sm">
                    <p className="text-lg font-semibold text-slate-950">
                      No workspaces created yet
                    </p>
                    <p className="mt-2 text-sm text-slate-500">
                      Add a workspace to store CSV uploads and reuse them later.
                    </p>
                  </div>
                )}
              </section>

              <aside className="space-y-5">
                <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                  <h2 className="text-lg font-semibold text-slate-950">
                    Workspace details
                  </h2>
                  {selectedWorkspace ? (
                    <div className="mt-4 space-y-4">
                      <p className="text-sm text-slate-600">
                        <span className="font-semibold text-slate-900">
                          {selectedWorkspace.name}
                        </span>{" "}
                        - Contains {workspaceTimetables.length} linked
                        timetable(s).
                      </p>
                      <div className="space-y-2 rounded-3xl bg-slate-50 p-4 text-sm text-slate-700">
                        <div>
                          <p className="font-semibold text-slate-900">
                            Students CSV
                          </p>
                          <p>
                            {selectedWorkspace.studentsCSV?.fileName ||
                              "No file data"}
                          </p>
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">
                            Rooms CSV
                          </p>
                          <p>
                            {selectedWorkspace.roomsCSV?.fileName ||
                              "No file data"}
                          </p>
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">
                            Days CSV
                          </p>
                          <p>
                            {selectedWorkspace.daysCSV?.fileName ||
                              "No file data"}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="mt-4 text-sm text-slate-500">
                      Click a workspace to see its linked timetables.
                    </p>
                  )}
                </div>

                {selectedWorkspace ? (
                  <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                    <h3 className="text-lg font-semibold text-slate-950">
                      Linked Timetables
                    </h3>
                    {workspaceTimetables.length ? (
                      <div className="mt-4 space-y-3">
                        {workspaceTimetables.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center justify-between rounded-3xl border border-slate-200 bg-slate-50 p-4"
                          >
                            <div>
                              <p className="font-semibold text-slate-900">
                                Timetable {item.id.slice(-6)}
                              </p>
                              <p className="text-sm text-slate-600">
                                {new Date(item.createdAt).toLocaleString()}
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleOpenTimetable(item.id)}
                              className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
                            >
                              Open
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="mt-4 text-sm text-slate-500">
                        This workspace does not have any generated timetables
                        yet.
                      </p>
                    )}
                  </div>
                ) : null}
              </aside>
            </div>
          </div>
        </main>
      </div>

      <WorkspaceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveWorkspace}
        workspace={editingWorkspace}
      />
    </div>
  );
}

export default ManageWorkspaces;
