import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import ScheduleModal from "../components/ScheduleModal";
import SlotSelectionModal from "../components/SlotSelectionModal";
import SubjectSelectionModal from "../components/SubjectSelectionModal";
import RoomSelectionModal from "../components/SlotModal";
import RoomModal from "../components/RoomModal";
import TotalSeatingModal from "../components/TotalSeatingModal";
import {
  getTimetableById,
  getWorkspaces,
  updateTimetableWorkspaceId,
} from "../utils/storage";

function SchedulePanel() {
  const [activeModal, setActiveModal] = useState(null); // "schedule" | "day" | "slot" | "subject" | "room" | "roomDetail" | "totalSeating" | null
  const [showFullScheduleModal, setShowFullScheduleModal] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [timetableId, setTimetableId] = useState(null);
  const [workspaceId, setWorkspaceId] = useState(null);
  const [availableWorkspaces, setAvailableWorkspaces] = useState([]);
  const [timetableData, setTimetableData] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  const routeState = location.state ?? {};
  const routeTimetableId = routeState.timetableId ?? null;
  const routeWorkspaceId = routeState.workspaceId ?? null;
  const routeData = routeState.data ?? null;
  const queryTimetableId = new URLSearchParams(location.search).get("t");

  useEffect(() => {
    setAvailableWorkspaces(getWorkspaces());
  }, []);

  useEffect(() => {
    const id = routeTimetableId || queryTimetableId;
    if (routeData) {
      setTimetableData(routeData);
      setTimetableId(routeTimetableId || id);
      setWorkspaceId(routeWorkspaceId ?? null);
      return;
    }

    if (id) {
      const stored = getTimetableById(id);
      if (stored) {
        setTimetableData(stored.data);
        setTimetableId(stored.id);
        setWorkspaceId(stored.workspaceId ?? null);
      }
    }
  }, [routeData, routeTimetableId, routeWorkspaceId, queryTimetableId]);

  const schedule = useMemo(
    () => timetableData?.schedule ?? [],
    [timetableData],
  );
  const days = useMemo(() => timetableData?.days ?? [], [timetableData]);

  const handleDownloadSchedule = () => {
    if (!schedule.length) return;

    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const margin = 40;
    const pageHeight = doc.internal.pageSize.height;
    const lineHeight = 18;
    const columnWidths = [40, 80, 70, 170, 70, 120];
    const tableWidth = columnWidths.reduce((sum, width) => sum + width, 0);

    let y = 60;
    doc.setFontSize(18);
    doc.text("Timetable", margin, y);
    y += 24;
    doc.setFontSize(11);
    doc.text("Downloaded from response.schedule", margin, y);
    y += 24;

    const headers = ["Sr No", "Date", "Day", "Subject", "Slot ID", "Slot Time"];

    const drawHeader = () => {
      let x = margin;
      doc.setFont("helvetica", "bold");
      doc.setFillColor(245, 245, 245);
      doc.rect(x - 4, y - 14, tableWidth + 8, lineHeight + 10, "F");
      headers.forEach((text, index) => {
        doc.setDrawColor(200);
        doc.rect(x - 4, y - 14, columnWidths[index] + 8, lineHeight + 10);
        doc.text(text, x, y);
        x += columnWidths[index] + 8;
      });
      y += lineHeight + 16;
      doc.setFont("helvetica", "normal");
    };

    const drawRow = (row) => {
      let x = margin;
      const rowHeight = lineHeight + 8;

      if (y + rowHeight > pageHeight - margin) {
        doc.addPage();
        y = margin;
        drawHeader();
      }

      row.forEach((cell, index) => {
        const value = String(cell ?? "");
        const split = doc.splitTextToSize(value, columnWidths[index]);
        const cellHeight = Math.max(rowHeight, split.length * 14 + 8);
        doc.setDrawColor(200);
        doc.rect(x - 4, y - 14, columnWidths[index] + 8, cellHeight);
        doc.text(split, x, y);
        x += columnWidths[index] + 8;
      });

      y += rowHeight;
    };

    drawHeader();

    schedule.forEach((item, index) => {
      const row = [
        index + 1,
        item.date,
        item.day,
        item.subject,
        item.slot?.slotId ?? "",
        item.slot?.start && item.slot?.end
          ? `${item.slot.start} - ${item.slot.end}`
          : "",
      ];
      drawRow(row);
    });

    doc.save("timetable.pdf");
  };

  const handleDayClick = (clickedDate) => {
    const selected = days.find((day) => day.date === clickedDate);
    if (!selected) return;

    setSelectedDay(selected);
    setActiveModal("slot");
  };

  const handleSlotClick = (clickedSlotID) => {
    if (!selectedDay) return;

    const selected = (selectedDay.slots || []).find(
      (slot) => slot.slotID === clickedSlotID,
    );
    if (!selected) return;

    setSelectedSlot(selected);

    const subjects = selected.subjects || [
      {
        subject: selected.subject,
        rooms: selected.rooms,
        completeSeating: selected.completeSeating,
      },
    ];

    if (subjects.length === 1) {
      setSelectedSubject(subjects[0]);
      setActiveModal("room");
    } else {
      setActiveModal("subject");
    }
  };

  const handleSubjectClick = (subject) => {
    setSelectedSubject(subject);
    setActiveModal("room");
  };

  const handleRoomClick = (clickedRoomName) => {
    const availableRooms = selectedSubject?.rooms || [];
    const selected = (availableRooms || []).find(
      (room) => room.roomName === clickedRoomName,
    );
    if (!selected) return;

    setSelectedRoom(selected);
    setActiveModal("roomDetail");
  };

  const handleTotalSeatingClick = () => {
    setActiveModal("totalSeating");
  };

  const handleWorkspaceChange = async (event) => {
    const nextWorkspaceId = event.target.value || null;
    setWorkspaceId(nextWorkspaceId);
    if (!timetableId) return;
    updateTimetableWorkspaceId(timetableId, nextWorkspaceId);
  };

  const handleClose = () => {
    if (activeModal === "roomDetail") {
      setActiveModal("room");
    } else if (activeModal === "room") {
      const subjects = selectedSlot?.subjects || [
        {
          subject: selectedSlot?.subject,
          rooms: selectedSlot?.rooms,
          completeSeating: selectedSlot?.completeSeating,
        },
      ];
      if (subjects.length > 1) {
        setActiveModal("subject");
      } else {
        setActiveModal("slot");
      }
    } else if (activeModal === "subject") {
      setActiveModal("slot");
    } else if (activeModal === "slot") {
      setActiveModal("day");
    } else if (activeModal === "day") {
      setActiveModal(null);
    } else if (activeModal === "totalSeating") {
      setActiveModal("room");
    }
  };

  const hasData = schedule.length > 0;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto flex min-h-screen flex-col items-center justify-center px-4 py-10">
        <div className="w-full max-w-2xl rounded-[32px] border border-slate-200 bg-white p-10 shadow-xl">
          <div className="mb-6 flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              ← Back to Dashboard
            </button>
            <div className="flex items-center gap-3 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-700">
              <label
                htmlFor="workspace-select"
                className="font-semibold text-slate-900"
              >
                Attach to
              </label>
              <select
                id="workspace-select"
                value={workspaceId || ""}
                onChange={handleWorkspaceChange}
                className="rounded-full border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-slate-400"
              >
                <option value="">None</option>
                {availableWorkspaces.map((workspace) => (
                  <option key={workspace.id} value={workspace.id}>
                    {workspace.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mb-10 text-center">
            <h1 className="text-4xl font-bold tracking-tight text-slate-950">
              Schedule View
            </h1>
            <p className="mt-3 text-sm text-slate-500">
              Minimal schedule controls and day-wise access.
            </p>
          </div>

          <div className="flex flex-col items-center justify-center gap-4">
            <div className="grid w-full gap-4 sm:grid-cols-2">
              <button
                onClick={() => setShowFullScheduleModal(true)}
                disabled={!hasData}
                className="inline-flex min-h-[56px] items-center justify-center rounded-3xl bg-slate-950 px-6 py-3 text-base font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                View Timetable
              </button>
              <button
                onClick={handleDownloadSchedule}
                disabled={!schedule.length}
                className="inline-flex min-h-[56px] items-center justify-center rounded-3xl border border-slate-300 bg-white px-6 py-3 text-base font-semibold text-slate-950 transition hover:border-slate-400 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Download Timetable
              </button>
            </div>

            <button
              onClick={() => setActiveModal("day")}
              disabled={!days.length}
              className="mt-6 inline-flex w-full max-w-md items-center justify-center rounded-3xl border border-slate-200 bg-slate-50 px-6 py-4 text-base font-semibold text-slate-950 transition hover:border-slate-300 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Access Day-wise Info
            </button>
          </div>
        </div>
      </div>

      <ScheduleModal
        isOpen={showFullScheduleModal}
        onClose={() => setShowFullScheduleModal(false)}
        title="Full Timetable"
        showTabs={false}
        schedule={schedule}
      />

      <ScheduleModal
        isOpen={activeModal === "day"}
        onClose={handleClose}
        title="Day-wise Details"
        showTabs={true}
        days={days}
        onDayClick={handleDayClick}
      />

      <SlotSelectionModal
        isOpen={activeModal === "slot"}
        onClose={handleClose}
        selectedDay={selectedDay}
        onSlotClick={handleSlotClick}
      />

      <SubjectSelectionModal
        isOpen={activeModal === "subject"}
        onClose={handleClose}
        selectedSlot={selectedSlot}
        onSubjectClick={handleSubjectClick}
      />

      <RoomSelectionModal
        isOpen={activeModal === "room"}
        onClose={handleClose}
        rooms={selectedSubject?.rooms || []}
        onRoomClick={handleRoomClick}
        onTotalClick={handleTotalSeatingClick}
      />

      <RoomModal
        isOpen={activeModal === "roomDetail"}
        onClose={handleClose}
        room={selectedRoom}
        selectedSubject={selectedSubject}
      />

      <TotalSeatingModal
        isOpen={activeModal === "totalSeating"}
        onClose={handleClose}
        rooms={selectedSubject?.rooms || []}
      />
    </div>
  );
}

export default SchedulePanel;
