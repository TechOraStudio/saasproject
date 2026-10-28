import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";

import Dashboard from "./Pages/Dashboard";
import Projects from "./Pages/Projects";
import Tasks from "./Pages/Tasks";
import Teams from "./Pages/Teams";
import Settings from "./Pages/Settings";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <Router basename="/saasproject/">
      <div className="flex h-screen bg-slate-950 font-sans antialiased overflow-hidden">
        {/* SIRF EK SIDEBAR YAHAN RENDER HOGA */}
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        {/* Dynamic Right Area */}
        <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
          <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/teams" element={<Teams />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;