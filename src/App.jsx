import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import GenerateTimetable from "./pages/GenerateTimetable";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/generate" element={<GenerateTimetable />} />
    </Routes>
  );
}

export default App;
