// src/pages/ProjectShowcase.jsx
import React, { useState } from "react";

export default function ProjectShowcase() {
  // 1. DATA PROYEK MAHASISWA (Bisa kamu tambah/ubah sesuai karya asli kelasmu)
  const dataProyek = [
    {
      id: 1,
      judul: "Sistem Parkir Otomatis IoT",
      kreator: "Aqwan Ali Daud & Tim",
      kategori: "IoT",
      deskripsi:
        "Proyek prototype sistem pengaman dan pembuka palang parkir otomatis berbasis Arduino menggunakan Sensor Ultrasonik dan LCD I2C.",
      tech: ["Arduino", "C++", "Ultrasonic Sensor"],
      github: "https://github.com/formidable/automatic-parking",
    },
    {
      id: 2,
      judul: "Formidable Class Website",
      kreator: "RDev Division",
      kategori: "Web",
      deskripsi:
        "Platform internal informasi kelas dengan antarmuka modern, fitur countdown tracker tugas, dan basis data portofolio.",
      tech: ["React.js", "Bootstrap 5", "Vite"],
      github: "https://github.com/formidable/formidable-web",
    },
    {
      id: 3,
      judul: "Mobile Class App Design",
      kreator: "UI/UX Team",
      kategori: "UI/UX",
      deskripsi:
        "Perancangan aset visual logo dan desain high-fidelity antarmuka login page untuk aplikasi mobile manajemen kelas.",
      tech: ["Figma", "Adobe Illustrator"],
      github: "#", // Jika belum ada repositori
    },
    {
      id: 4,
      judul: "Sistem Distribusi Pangan TreeDots Analysis",
      kreator: "Analis Sistem Kelas",
      kategori: "Web",
      deskripsi:
        "Dokumentasi analisis arsitektur perangkat lunak mendalam menggunakan Use Case Diagram UML dan Entity-Relationship Diagram (ERD).",
      tech: ["UML", "ERD", "Database Design"],
      github: "https://github.com/formidable/treedots-analysis",
    },
  ];

  // 2. STATE UNTUK FILTER KATEGORI
  const [kategoriAktif, setKategoriAktif] = useState("Semua");

  // Daftar kategori yang tersedia untuk tombol filter
  const daftarKategori = ["Semua", "Web", "IoT", "UI/UX"];

  // Fungsi untuk menyaring proyek berdasarkan kategori yang dipilih
  const proyekTersaring =
    kategoriAktif === "Semua"
      ? dataProyek
      : dataProyek.filter((proyek) => proyek.kategori === kategoriAktif);

  return (
    <div className="container my-5 py-3">
      {/* HEADER HALAMAN */}
      <div className="text-center mb-5">
        <h2 className="fw-bold text-formidable-navy">RDev Project Showcase</h2>
        <div
          className="bg-info mx-auto my-3"
          style={{ width: "60px", height: "4px", borderRadius: "2px" }}
        ></div>
        <p className="text-muted mx-auto" style={{ maxWidth: "600px" }}>
          Etalase digital tempat kreativitas mahasiswa Informatika bermuara.
          Galeri proyek pemrograman web, kecerdasan buatan, hingga rekayasa
          perangkat keras IoT.
        </p>
      </div>

      {/* TOMBOL FILTER KATEGORI (MODERN & RESPONSIF) */}
      <div className="d-flex justify-content-center gap-2 mb-5 flex-wrap">
        {daftarKategori.map((kat, index) => (
          <button
            key={index}
            className={`btn px-4 py-2 rounded-pill fw-bold transition-all ${
              kategoriAktif === kat
                ? "bg-formidable-navy text-white shadow"
                : "btn-outline-secondary border-opacity-25"
            }`}
            onClick={() => setKategoriAktif(kat)}
            style={{ transition: "all 0.3s ease" }}
          >
            {kat}
          </button>
        ))}
      </div>

      {/* GRID DAFTAR PROYEK */}
      <div className="row g-4">
        {proyekTersaring.map((proyek) => (
          <div className="col-lg-6" key={proyek.id}>
            <div className="card card-modern bg-white p-4 h-100 d-flex flex-column justify-content-between border-start border-info border-4">
              <div>
                {/* Baris Atas Card */}
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <span
                    className="badge bg-light text-formidable-navy border px-2 py-1.5 fw-bold"
                    style={{ fontSize: "0.75rem" }}
                  >
                    <i className="bi bi-tag-fill me-1 text-info"></i>
                    {proyek.kategori}
                  </span>
                  <small className="text-muted">
                    <i className="bi bi-person-circle me-1"></i>{" "}
                    {proyek.kreator}
                  </small>
                </div>

                {/* Judul & Deskripsi */}
                <h4 className="fw-bold text-formidable-navy mb-2">
                  {proyek.judul}
                </h4>
                <p
                  className="text-muted small mb-4"
                  style={{ lineHeight: "1.6", textAlign: "justify" }}
                >
                  {proyek.deskripsi}
                </p>
              </div>

              {/* Bagian Bawah: Teknologi & Tombol GitHub */}
              <div>
                <div className="d-flex flex-wrap gap-1 mb-4">
                  {proyek.tech.map((t, idx) => (
                    <span
                      key={idx}
                      className="bg-light text-secondary rounded px-2 py-1"
                      style={{ fontSize: "0.7rem", fontWeight: "500" }}
                    >
                      #{t}
                    </span>
                  ))}
                </div>

                <hr className="opacity-10 my-3" />

                <div className="d-flex justify-content-between align-items-center">
                  <span className="text-success small fw-bold d-flex align-items-center">
                    <span
                      className="spinner-grow spinner-grow-sm text-success me-2"
                      role="status"
                      style={{ width: "8px", height: "8px" }}
                    ></span>
                    Active Project
                  </span>
                  <a
                    href={proyek.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn bg-formidable-navy text-white btn-sm px-3 rounded-pill fw-bold"
                  >
                    <i className="bi bi-github me-1"></i> View Code
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
