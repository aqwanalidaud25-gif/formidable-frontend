// src/App.jsx
import React, { useState, useEffect } from "react";
// 1. IMPORT PENTING UNTUK NOTIFIKASI
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import ScheduleAndTasks from "./pages/ScheduleAndTasks";
import ProjectShowcase from "./pages/ProjectShowcase";
import DigitalLibrary from "./pages/DigitalLibrary";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import DashboardAnnouncements from "./pages/DashboardAnnouncements";

function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [theme, setTheme] = useState("light");
  const [role, setRole] = useState("student");
  const [sessionUser, setSessionUser] = useState(null);

  useEffect(() => {
    const simpananRole = localStorage.getItem("user_role");
    const simpananUser = localStorage.getItem("user_session");
    if (simpananRole && simpananUser) {
      setRole(simpananRole);
      setSessionUser(JSON.parse(simpananUser));
    }
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-bs-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const handleLogout = () => {
    setRole("student");
    setSessionUser(null);
    localStorage.removeItem("user_role");
    localStorage.removeItem("user_session");
    setCurrentPage("home");
  };

  return (
    <div className="d-flex flex-column" style={{ minHeight: "100vh" }}>
      {/* 2. PASANG CONTAINER INI AGAR NOTIFIKASI BISA MUNCUL */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnHover
        theme={theme}
      />

      {sessionUser && (
        <Navbar
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          theme={theme}
          toggleTheme={toggleTheme}
          role={role}
          setRole={handleLogout}
        />
      )}

      <main className="flex-shrink-0">
        {!sessionUser ? (
          <Login
            setRole={setRole}
            setSessionUser={setSessionUser}
            setCurrentPage={setCurrentPage}
          />
        ) : (
          <>
            {currentPage === "home" && <Home setCurrentPage={setCurrentPage} />}
            {currentPage === "about" && <About />}
            {currentPage === "projects" && <ProjectShowcase />}
            {currentPage === "dashboard" && (
              <Dashboard role={role} sessionUser={sessionUser} />
            )}
            {currentPage === "manage-announcements" &&
              (role === "admin" ? (
                <DashboardAnnouncements />
              ) : (
                <div className="text-center my-5">Akses Ditolak!</div>
              ))}
            {currentPage === "schedule" && <ScheduleAndTasks role={role} />}
            {currentPage === "library" && <DigitalLibrary role={role} />}
          </>
        )}
      </main>

      {sessionUser && <Footer />}
    </div>
  );
}

export default App;
