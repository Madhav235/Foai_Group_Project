import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import GenerateTimetable from "./pages/GenerateTimetable";
import ManageWorkspaces from "./pages/ManageWorkspaces";
import Recents from "./pages/Recents";
import SchedulePanel from "./pages/SchedulePanel";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/generate" element={<GenerateTimetable />} />
      <Route path="/generate-timetable" element={<GenerateTimetable />} />
      <Route path="/workspaces" element={<ManageWorkspaces />} />
      <Route path="/recents" element={<Recents />} />
      <Route path="/schedule" element={<SchedulePanel />} />
    </Routes>
  );
}

export default App;
