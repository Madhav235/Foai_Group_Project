import { useMemo } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import DataTable from "./DataTable";

export default function TotalSeatingModal({ isOpen, onClose, rooms }) {
  const availableRooms = Array.isArray(rooms) ? rooms : [];

  const allStudents = useMemo(() => {
    const students = availableRooms.flatMap((room) =>
      Array.isArray(room.students)
        ? room.students.map((student) => ({
            ...student,
            room: room.roomName ?? room.name ?? "Unknown Room",
          }))
        : [],
    );
    console.log("Total Seating - Available Rooms:", availableRooms);
    console.log("Total Seating - All Students:", students);
    return students;
  }, [availableRooms]);

  const columns = ["Sr No.", "Name", "URN", "Room"];
  const rows = allStudents.map((student, index) => [
    index + 1,
    student.name,
    student.urn,
    student.room,
  ]);

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Total Seating Plan", 14, 15);
    autoTable(doc, {
      startY: 20,
      head: [columns],
      body: rows,
    });
    doc.save("Total Seating Plan.pdf");
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 px-4 py-6"
      onClick={onClose}
    >
      <div
        className="relative mx-auto w-full max-w-[940px] overflow-hidden rounded-[28px] bg-white shadow-2xl ring-1 ring-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col gap-4 border-b border-slate-200 bg-slate-950 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-white">
              Total Seating Plan
            </h2>
            <p className="mt-1 text-sm text-slate-300">
              All rooms flattened into a single seating report.
            </p>
          </div>
          <button
            type="button"
            onClick={downloadPDF}
            className="inline-flex items-center justify-center rounded-full bg-white px-5 py-2 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
          >
            Download PDF
          </button>
        </div>

        <div className="px-6 py-8">
          {rows.length ? (
            <DataTable columns={columns} rows={rows} />
          ) : (
            <div className="rounded-[20px] border border-slate-200 bg-slate-50 px-8 py-16 text-center text-slate-600">
              <p className="text-lg font-semibold text-slate-950">
                No student seating data available.
              </p>
              <p className="mt-2 text-sm">
                Add room data with student entries to generate the total plan.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
