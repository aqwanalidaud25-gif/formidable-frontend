// src/components/Navbar.jsx
import React from "react";

export default function Navbar({
  currentPage,
  setCurrentPage,
  theme,
  toggleTheme,
  role, // AMBIL PROPS ROLE
  setRole, // AMBIL PROPS SETROLE (Memanggil handleLogout dari App.jsx)
}) {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-formidable-navy sticky-top py-3 shadow-sm">
      <div className="container">
        <a
          className="navbar-brand d-flex align-items-center"
          href="#"
          onClick={(e) => {
            e.preventDefault();
            setCurrentPage("home");
          }}
        >
          <img
            src="/img/logo-kelas2.jpeg"
            alt="Logo Formidable"
            height="40"
            className="d-inline-block align-top me-2"
            style={{ objectFit: "contain" }}
          />
        </a>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto gap-2 align-items-lg-center">
            <li className="nav-item">
              <button
                className={`nav-link btn border-0 px-3 ${currentPage === "home" ? "active fw-bold text-info" : ""}`}
                onClick={() => setCurrentPage("home")}
              >
                Home
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link btn border-0 px-3 ${currentPage === "about" ? "active fw-bold text-info" : ""}`}
                onClick={() => setCurrentPage("about")}
              >
                About
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link btn border-0 px-3 ${currentPage === "schedule" ? "active fw-bold text-info" : ""}`}
                onClick={() => setCurrentPage("schedule")}
              >
                Schedule
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link btn border-0 px-3 ${currentPage === "projects" ? "active fw-bold text-info" : ""}`}
                onClick={() => setCurrentPage("projects")}
              >
                Projects
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link btn border-0 px-3 ${currentPage === "library" ? "active fw-bold text-info" : ""}`}
                onClick={() => setCurrentPage("library")}
              >
                Library
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link btn border-0 px-3 ${currentPage === "dashboard" ? "active fw-bold text-info" : ""}`}
                onClick={() => setCurrentPage("dashboard")}
              >
                Dashboard
              </button>
            </li>

            {/* 🔥 REVISI: MENU KONDISIONAL KHUSUS ADMIN UNTUK MENGEDIT KARTU HOME */}
            {role === "admin" && (
              <li className="nav-item">
                <button
                  className={`nav-link btn border-0 px-3 ${currentPage === "manage-announcements" ? "active fw-bold text-info animate-pulse" : ""}`}
                  onClick={() => setCurrentPage("manage-announcements")}
                  style={{ color: "#0dcaf0" }}
                >
                  <i className="bi bi-megaphone-fill me-1"></i> Edit Info
                </button>
              </li>
            )}

            {/* 🔥 TOMBOL DINAMIS LOGIN / LOGOUT ADMIN */}
            <li className="nav-item ms-lg-2">
              {role === "admin" ? (
                <button
                  className="btn btn-sm btn-danger fw-bold px-3 py-2 rounded-3"
                  onClick={() => {
                    setRole(); // 🔥 Jalankan fungsi pembersih utama session & local storage
                    alert("Logout Berhasil!");
                  }}
                >
                  <i className="bi bi-box-arrow-right me-1"></i> Logout Admin
                </button>
              ) : (
                <button
                  className={`btn btn-sm btn-outline-light fw-semibold px-3 py-2 rounded-3 ${currentPage === "login" ? "bg-white text-dark" : ""}`}
                  onClick={() => setCurrentPage("login")}
                >
                  <i className="bi bi-person-fill-lock me-1"></i> Login Admin
                </button>
              )}
            </li>

            <li className="nav-item ms-lg-1 mt-2 mt-lg-0">
              <button
                className="btn btn-outline-info rounded-circle d-flex align-items-center justify-content-center"
                style={{ width: "38px", height: "38px" }}
                onClick={toggleTheme}
              >
                {theme === "light" ? (
                  <i className="bi bi-moon-stars-fill"></i>
                ) : (
                  <i className="bi bi-sun-fill text-warning"></i>
                )}
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
