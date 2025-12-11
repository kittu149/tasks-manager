// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import MicroTasks from "./pages/MicroTasks";
import TodayTasks from "./pages/TodayTasks";
import AllTasks from "./pages/AllTasks";
import { Box } from "@mui/material";

export default function App() {
  return (
    <Router>
      <Sidebar />
      <Box sx={{ marginLeft: { xs: 0, md: 60 }, transition: "margin-left 180ms" }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/micro" element={<MicroTasks />} />
          <Route path="/today" element={<TodayTasks />} />
          <Route path="/all" element={<AllTasks />} />
        </Routes>
      </Box>
    </Router>
  );
}
