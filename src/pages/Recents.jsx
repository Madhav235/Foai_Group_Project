import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { getRecentTimetables, getWorkspaces } from "../utils/storage";

function Recents() {
  const navigate = useNavigate();
  const [timetables, setTimetables] = useState([]);
  const [workspaces, setWorkspaces] = useState([]);

  useEffect(() => {
    setTimetables(getRecentTimetables());
    setWorkspaces(getWorkspaces());
  }, []);

  const getWorkspaceName = (workspaceId) => {
    const workspace = workspaces.find((item) => item.id === workspaceId);
    return workspace?.name ?? "None";
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto flex min-h-screen max-w-[1600px]">
        <Sidebar />
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="mb-8 rounded-[36px] border border-slate-200 bg-white px-6 py-8 shadow-xl sm:px-10">
              <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
                Recent Timetables
              </h1>
              <p className="mt-2 text-sm text-slate-500">
                Quickly open a recently generated timetable and continue
                working.
              </p>
            </div>

            <div className="space-y-4">
              {timetables.length ? (
                timetables.map((timetable) => (
                  <div
                    key={timetable.id}
                    className="flex flex-col gap-4 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="text-lg font-semibold text-slate-950">
                        Timetable {timetable.id.slice(-6)}
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        Created {new Date(timetable.createdAt).toLocaleString()}
                      </p>
                      <p className="mt-1 text-sm text-slate-600">
                        Workspace: {getWorkspaceName(timetable.workspaceId)}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        navigate(`/schedule?t=${timetable.id}`, {
                          state: { timetableId: timetable.id },
                        })
                      }
                      className="inline-flex items-center justify-center rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                    >
                      Open Schedule
                    </button>
                  </div>
                ))
              ) : (
                <div className="rounded-[28px] border border-slate-200 bg-white p-10 text-center text-slate-600 shadow-sm">
                  <p className="text-lg font-semibold text-slate-950">
                    No recent timetables found
                  </p>
                  <p className="mt-2 text-sm text-slate-500">
                    Generate a timetable to see it appear here.
                  </p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Recents;
