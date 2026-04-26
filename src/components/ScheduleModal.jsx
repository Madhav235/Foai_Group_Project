import { useEffect, useMemo, useState } from "react";

export default function ScheduleModal({
  isOpen,
  onClose,
  title,
  showTabs,
  days,
  schedule,
  onDayClick,
}) {
  const safeDays = useMemo(() => (Array.isArray(days) ? days : []), [days]);
  const safeSchedule = useMemo(
    () => (Array.isArray(schedule) ? schedule : []),
    [schedule],
  );
  const [selectedIndex, setSelectedIndex] = useState(null);

  useEffect(() => {
    if (isOpen && showTabs) {
      setSelectedIndex(null);
    }
  }, [isOpen, showTabs]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 px-4 py-6"
      onClick={onClose}
    >
      <div
        className="relative mx-auto w-full max-w-[1120px] overflow-hidden rounded-[28px] bg-white shadow-2xl ring-1 ring-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-950 px-6 py-5">
          <h2 className="text-2xl font-semibold text-white">{title}</h2>
          <button
            onClick={onClose}
            className="inline-flex items-center justify-center rounded-full bg-slate-200 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-slate-300"
          >
            Close
          </button>
        </div>

        <div className="flex min-h-[420px] items-center justify-center px-6 py-8">
          <div className="w-full max-w-lg space-y-3">
            {showTabs ? (
              safeDays.length ? (
                safeDays.map((day, index) => (
                  <button
                    key={day.date || day.dayID || index}
                    type="button"
                    onClick={() => {
                      setSelectedIndex(index);
                      onDayClick?.(day.date);
                    }}
                    className={`w-full rounded-[12px] border px-5 py-4 text-center text-base font-semibold transition ${
                      selectedIndex === index
                        ? "border-slate-950 bg-slate-950 text-white"
                        : "border-slate-300 bg-white text-slate-900 hover:border-slate-500"
                    }`}
                  >
                    {day.date}
                  </button>
                ))
              ) : (
                <div className="rounded-[20px] border border-slate-200 bg-slate-50 px-8 py-12 text-center text-slate-600">
                  <p className="text-lg font-semibold text-slate-950">
                    No dates available
                  </p>
                  <p className="mt-2 text-sm">
                    Day-wise data will appear here.
                  </p>
                </div>
              )
            ) : (
              <div className="overflow-x-auto rounded-[20px] border border-slate-200 bg-slate-50 p-4 text-slate-600">
                <table className="min-w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-slate-100 text-left text-slate-700">
                      <th className="border-b border-slate-200 px-4 py-3">
                        Sr No
                      </th>
                      <th className="border-b border-slate-200 px-4 py-3">
                        Date
                      </th>
                      <th className="border-b border-slate-200 px-4 py-3">
                        Day
                      </th>
                      <th className="border-b border-slate-200 px-4 py-3">
                        Subject
                      </th>
                      <th className="border-b border-slate-200 px-4 py-3">
                        Slot ID
                      </th>
                      <th className="border-b border-slate-200 px-4 py-3">
                        Slot Time
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {safeSchedule.map((item, index) => (
                      <tr
                        key={`${item.date}-${item.slot?.slotId ?? index}`}
                        className={index % 2 === 0 ? "bg-white" : "bg-slate-50"}
                      >
                        <td className="border-b border-slate-200 px-4 py-3">
                          {index + 1}
                        </td>
                        <td className="border-b border-slate-200 px-4 py-3">
                          {item.date}
                        </td>
                        <td className="border-b border-slate-200 px-4 py-3">
                          {item.day}
                        </td>
                        <td className="border-b border-slate-200 px-4 py-3">
                          {item.subject}
                        </td>
                        <td className="border-b border-slate-200 px-4 py-3">
                          {item.slot?.slotId}
                        </td>
                        <td className="border-b border-slate-200 px-4 py-3">
                          {item.slot?.start && item.slot?.end
                            ? `${item.slot.start} - ${item.slot.end}`
                            : ""}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
