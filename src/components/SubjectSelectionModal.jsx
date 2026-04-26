export default function SubjectSelectionModal({
  isOpen,
  onClose,
  selectedSlot,
  onSubjectClick,
}) {
  if (!isOpen) return null;

  // Apply global rule for backward compatibility
  const subjects = selectedSlot?.subjects || [
    {
      subject: selectedSlot?.subject,
      rooms: selectedSlot?.rooms,
      completeSeating: selectedSlot?.completeSeating,
    },
  ];

  const slotTime =
    selectedSlot?.time ??
    `${selectedSlot?.start ?? ""} - ${selectedSlot?.end ?? ""}`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 px-4 py-6"
      onClick={onClose}
    >
      <div
        className="relative mx-auto w-full max-w-[720px] overflow-hidden rounded-[28px] bg-white shadow-2xl ring-1 ring-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-950 px-6 py-5">
          <div>
            <h2 className="text-2xl font-semibold text-white">
              Select Subject
            </h2>
            <p className="mt-1 text-sm text-slate-300">
              Choose a subject for slot {selectedSlot?.slotID} ({slotTime}).
            </p>
          </div>
          <button
            onClick={onClose}
            className="inline-flex items-center justify-center rounded-full bg-slate-200 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-slate-300"
          >
            Close
          </button>
        </div>

        <div className="flex min-h-[320px] items-center justify-center px-6 py-8">
          <div className="w-full max-w-md space-y-3">
            {subjects.length ? (
              subjects.map((subjectData, index) => {
                const subjectName = subjectData.subject ?? "No Subject";

                return (
                  <button
                    key={`${subjectName}-${index}`}
                    type="button"
                    onClick={() => onSubjectClick(subjectData)}
                    className="w-full rounded-[12px] border border-slate-300 bg-white px-5 py-4 text-left text-base font-semibold text-slate-900 transition hover:border-slate-400 hover:bg-slate-50"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="font-semibold text-slate-900">
                          {subjectName}
                        </div>
                        <div className="mt-1 text-sm text-slate-500">
                          {slotTime}
                        </div>
                      </div>
                      <span className="rounded-full border border-slate-300 bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-slate-600">
                        {selectedSlot?.slotID}
                      </span>
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="rounded-[20px] border border-slate-200 bg-slate-50 px-8 py-12 text-center text-slate-600">
                <p className="text-lg font-semibold text-slate-950">
                  No subjects available
                </p>
                <p className="mt-2 text-sm">This slot has no subject data.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
