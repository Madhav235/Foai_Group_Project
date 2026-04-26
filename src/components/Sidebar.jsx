import { useLocation, useNavigate } from "react-router-dom";
import { Home, Clock3, Layers } from "lucide-react";

const navItems = [
  { label: "Dashboard", icon: Home, path: "/" },
  { label: "Recents", icon: Clock3, path: "/recents" },
  { label: "Manage Workspace", icon: Layers, path: "/workspaces" },
];

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <aside className="flex min-h-screen w-full max-w-xs flex-none flex-col border-r border-slate-200 bg-white px-6 py-8 shadow-sm lg:max-w-[320px]">
      <div className="flex flex-col gap-2">
        <span className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
          ExamScheduler
        </span>
        <p className="text-2xl font-semibold tracking-tight text-slate-950">
          Admin panel
        </p>
      </div>

      <div className="mt-10 space-y-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
            Main
          </p>
          <nav className="mt-4 space-y-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => navigate(item.path)}
                  className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium transition ${
                    isActive
                      ? "bg-slate-900 text-white shadow-sm"
                      : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <item.icon
                    className={`h-5 w-5 ${
                      isActive ? "text-white" : "text-slate-400"
                    }`}
                  />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
