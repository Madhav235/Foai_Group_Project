import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import DataTable from "./DataTable";

export default function RoomModal({ isOpen, onClose, room, selectedSubject }) {
  if (!isOpen) return null;

  const roomName = room?.roomName ?? room?.name ?? "Room";

  // Use selectedSubject to find the correct room data
  const subjectRoom = selectedSubject?.rooms?.find(
    (r) => r.roomName === roomName,
  );
  const students = Array.isArray(subjectRoom?.students)
    ? subjectRoom.students
    : [];

  const columns = ["Sr No.", "Name", "URN"];
  const rows = students.map((student, index) => [
    index + 1,
    student.name,
    student.urn,
  ]);

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text(`${roomName} Seating Plan`, 14, 15);
    autoTable(doc, {
      startY: 20,
      head: [columns],
      body: rows,
    });
    doc.save(`${roomName} Seating Plan.pdf`);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 px-4 py-6"
      onClick={onClose}
    >
      <div
        className="relative mx-auto w-full max-w-[860px] overflow-hidden rounded-[28px] bg-white shadow-2xl ring-1 ring-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col gap-4 border-b border-slate-200 bg-slate-950 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-white">
              {roomName} Seating Plan
            </h2>
            <p className="mt-1 text-sm text-slate-300">
              Student roster for this room.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={downloadPDF}
              className="inline-flex items-center justify-center rounded-full bg-white px-5 py-2 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
            >
              Download PDF
            </button>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center justify-center rounded-full bg-slate-200 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-slate-300"
            >
              Close
            </button>
          </div>
        </div>

        <div className="px-6 py-8">
          {rows.length ? (
            <DataTable columns={columns} rows={rows} />
          ) : (
            <div className="rounded-[20px] border border-slate-200 bg-slate-50 px-8 py-16 text-center text-slate-600">
              <p className="text-lg font-semibold text-slate-950">
                No students found for this room.
              </p>
              <p className="mt-2 text-sm">
                Add student entries under the selected room to display seating.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
