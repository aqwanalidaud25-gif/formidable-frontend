// src/App.jsx
import React, { useState, useEffect } from "react";
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

  // AUTO-LOGIN (Membaca sesi lama yang tersimpan di browser)
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

  // FUNGSI LOGOUT YANG BERSIH
  const handleLogout = () => {
    setRole("student");
    setSessionUser(null);
    localStorage.removeItem("user_role");
    localStorage.removeItem("user_session");
    setCurrentPage("home");
  };

  return (
    <div className="d-flex flex-column" style={{ minHeight: "100vh" }}>
      {/* 🔥 GERBANG NAVBAR: Hanya dirender kalau mahasiswa SUDAH LOGIN */}
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
        {/* 🔥 GERBANG PROTEKSI UTAMA (AUTHENTICATION GATEWAY) */}
        {!sessionUser ? (
          // JIKA BELUM LOGIN (sessionUser === null): Paksa hanya tampilkan halaman Login gateway
          <Login
            setRole={setRole}
            setSessionUser={setSessionUser}
            setCurrentPage={setCurrentPage}
          />
        ) : (
          // JIKA SUDAH LOGIN: Gerbang terbuka, semua rute halaman internal aktif
          <>
            {currentPage === "home" && <Home setCurrentPage={setCurrentPage} />}
            {currentPage === "about" && <About />}
            {currentPage === "projects" && <ProjectShowcase />}

            {/* KIRIM DATA USER KE DASHBOARD ANALYTICS TUGAS */}
            {currentPage === "dashboard" && (
              <Dashboard role={role} sessionUser={sessionUser} />
            )}

            {/* KUNCI HALAMAN EDIT INFORMASI HOME DENGAN PROTEKSI ROLE ADMIN */}
            {currentPage === "manage-announcements" &&
              (role === "admin" ? (
                <DashboardAnnouncements />
              ) : (
                <div className="container my-5 py-5 text-center">
                  <div className="alert alert-danger rounded-4 shadow-sm p-4">
                    <i className="bi bi-shield-lock-fill fs-1 d-block mb-2"></i>
                    <h4 className="fw-bold">Akses Ditolak!</h4>
                    <p className="text-muted">
                      Halaman ini dilindungi ketat dan hanya dapat diakses oleh
                      Tim Admin Utama Formidable.
                    </p>
                  </div>
                </div>
              ))}

            {/* KIRIMKAN ROLE KE HALAMAN YANG MAU KITA PROTEKSI */}
            {currentPage === "schedule" && <ScheduleAndTasks role={role} />}
            {currentPage === "library" && <DigitalLibrary role={role} />}

            {/* Keamanan tambahan: Jika user iseng mengarahkan currentPage ke login padahal sudah masuk */}
            {currentPage === "login" && setCurrentPage("home")}
          </>
        )}
      </main>

      {/* 🔥 GERBANG FOOTER: Hanya dirender kalau mahasiswa SUDAH LOGIN */}
      {sessionUser && <Footer />}
    </div>
  );
}

export default App;
