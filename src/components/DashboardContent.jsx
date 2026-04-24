import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

function DashboardContent() {
  const navigate = useNavigate();

  const goToGenerate = () => navigate("/generate-timetable");

  return (
    <div className="mt-8">
      <div className="rounded-[36px] border border-slate-200 bg-white px-6 py-12 shadow-xl shadow-slate-200/80 sm:px-10">
        <div className="mx-auto max-w-2xl text-center">
          <button
            type="button"
            onClick={goToGenerate}
            aria-label="Create a new timetable"
            className="flex h-28 w-28 cursor-pointer items-center justify-center rounded-full border-2 border-dashed border-slate-300 text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 mx-auto"
          >
            <Plus className="h-10 w-10" />
          </button>
          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-slate-900">
            Create a new timetable
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-500">
            Build structured exam schedules with room assignments, session
            windows, and constraint-aware planning.
          </p>
          <div className="mt-10 flex items-center justify-center gap-3 text-xs uppercase tracking-[0.3em] text-slate-400">
            <span className="h-px w-16 bg-slate-200"></span>
            or
            <span className="h-px w-16 bg-slate-200"></span>
          </div>
          <button
            type="button"
            onClick={goToGenerate}
            className="mt-8 inline-flex cursor-pointer items-center justify-center rounded-full bg-slate-900 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/10 transition hover:bg-slate-800"
          >
            Generate timetable
          </button>
        </div>
      </div>
    </div>
  );
}

export default DashboardContent;
