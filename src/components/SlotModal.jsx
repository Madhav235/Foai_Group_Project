export default function RoomSelectionModal({
  isOpen,
  onClose,
  rooms,
  onRoomClick,
  onTotalClick,
}) {
  if (!isOpen) return null;

  const availableRooms = Array.isArray(rooms) ? rooms : [];
  console.log("RoomSelectionModal - Available Rooms:", availableRooms);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 px-4 py-6"
      onClick={onClose}
    >
      <div
        className="relative mx-auto w-full max-w-[760px] overflow-hidden rounded-[28px] bg-white shadow-2xl ring-1 ring-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-950 px-6 py-5">
          <div>
            <h2 className="text-2xl font-semibold text-white">
              Room-wise Seating Plan
            </h2>
            <p className="mt-1 text-sm text-slate-300">
              Choose a room to view its seating details or inspect the total
              plan.
            </p>
          </div>
          <button
            onClick={onClose}
            className="inline-flex items-center justify-center rounded-full bg-slate-200 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-slate-300"
          >
            Close
          </button>
        </div>

        <div className="space-y-6 px-6 py-8">
          {availableRooms.length ? (
            <div className="grid gap-3 sm:grid-cols-2">
              {availableRooms.map((room, index) => {
                const roomName =
                  room.roomName ?? room.name ?? `Room ${index + 1}`;

                return (
                  <button
                    key={`${roomName}-${index}`}
                    type="button"
                    onClick={() => onRoomClick(roomName)}
                    className="rounded-[18px] border border-slate-300 bg-white px-5 py-5 text-left text-base font-semibold text-slate-900 transition hover:border-slate-400 hover:bg-slate-50"
                  >
                    {roomName}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="rounded-[20px] border border-slate-200 bg-slate-50 px-8 py-14 text-center text-slate-600">
              <p className="text-lg font-semibold text-slate-950">
                No rooms available
              </p>
              <p className="mt-2 text-sm">
                Room data is missing, so there are no seating plans to show.
              </p>
            </div>
          )}

          <div className="rounded-[24px] border border-slate-200 bg-slate-950 px-7 py-8 text-center text-white shadow-xl">
            <p className="text-sm uppercase tracking-[0.2em] text-slate-400">
              Total Seating Plan
            </p>
            <p className="mt-4 text-2xl font-semibold">Flatten all rooms</p>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-300">
              Download or preview the full seating list across every room.
            </p>
            <button
              type="button"
              onClick={onTotalClick}
              disabled={!availableRooms.length}
              className="mt-7 inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
            >
              View total seating plan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
