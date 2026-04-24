import { Home, Clock3, Activity, SlidersHorizontal } from "lucide-react";

const navItems = [
  { label: "Dashboard", icon: Home, active: true },
  { label: "History", icon: Clock3 },
  { label: "Compare", icon: Activity },
];

const settingsItems = [{ label: "Constraints", icon: SlidersHorizontal }];

function Sidebar() {
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
            {navItems.map((item) => (
              <button
                key={item.label}
                type="button"
                className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium transition ${
                  item.active
                    ? "bg-slate-900 text-white shadow-sm"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                <item.icon
                  className={`h-5 w-5 ${
                    item.active ? "text-white" : "text-slate-400"
                  }`}
                />
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
            Settings
          </p>
          <div className="mt-4 space-y-2">
            {settingsItems.map((item) => (
              <button
                key={item.label}
                type="button"
                className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-100"
              >
                <item.icon className="h-5 w-5 text-slate-400" />
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
