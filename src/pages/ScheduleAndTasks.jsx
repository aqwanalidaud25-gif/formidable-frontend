// src/pages/ScheduleAndTasks.jsx
import React, { useState, useEffect } from "react";
// 1. IMPORT LIBRARY PDF BARU
import { jsPDF } from "jspdf";
import "jspdf-autotable";

// 🔥 SEKARANG MENERIMA PROPS ROLE DARI APP.JSX UNTUK VALIDASI
export default function ScheduleAndTasks({ role }) {
  // DATA STATIS JADWAL KULIAH SEMESTER 4
  const jadwalKuliah = [
    {
      hari: "Senin",
      matkul: "Pemrograman Web Backend",
      jam: "08:00 - 09:40",
      ruangan: "Lab Komputer 2",
    },
    {
      hari: "Selasa",
      matkul: "Arsitektur Perangkat Lunak",
      jam: "10:00 - 11:40",
      ruangan: "Ruang 3.1",
    },
    {
      hari: "Rabu",
      matkul: "Internet of Things (IoT)",
      jam: "08:00 - 10:30",
      ruangan: "Lab Elektronika",
    },
    {
      hari: "Kamis",
      matkul: "Interaksi Manusia & Komputer",
      jam: "13:00 - 14:40",
      ruangan: "Ruang 3.2",
    },
    {
      hari: "Jumat",
      matkul: "Metodologi Penelitian",
      jam: "09:00 - 10:40",
      ruangan: "Ruang 2.4",
    },
  ];

  const [daftarTugas, setDaftarTugas] = useState([]);
  const [inputMatkul, setInputMatkul] = useState("");
  const [inputDeskripsi, setInputDeskripsi] = useState("");
  const [inputDeadline, setInputDeadline] = useState("");

  const API_URL = "http://localhost:5000/api/tasks";

  const muatDaftarTugas = async () => {
    try {
      const respon = await fetch(API_URL);
      const data = await respon.json();
      setDaftarTugas(data);
    } catch (error) {
      console.error("Gagal memuat data tugas:", error);
    }
  };

  useEffect(() => {
    muatDaftarTugas();
  }, []);

  const handleTambahTugas = async (e) => {
    e.preventDefault();
    if (!inputMatkul || !inputDeskripsi || !inputDeadline)
      return alert("Mohon isi semua kolom!");

    const tugasBaru = {
      matkul: inputMatkul,
      deskripsi: inputDeskripsi,
      deadline: inputDeadline,
    };

    try {
      const respon = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tugasBaru),
      });

      if (respon.ok) {
        muatDaftarTugas();
        setInputMatkul("");
        setInputDeskripsi("");
        setInputDeadline("");
      }
    } catch (error) {
      alert("Gagal mengirim data ke server backend!");
    }
  };

  const handleToggleStatus = async (id, statusSaatIni) => {
    const statusBaru =
      statusSaatIni === "Selesai" ? "Belum Selesai" : "Selesai";
    try {
      const respon = await fetch(`${API_URL}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: statusBaru }),
      });
      if (respon.ok) muatDaftarTugas();
    } catch (error) {
      console.error("Gagal memperbarui status tugas:", error);
    }
  };

  const handleHapusTugas = async (id) => {
    if (window.confirm("Apakah kamu yakin ingin menghapus tugas ini?")) {
      try {
        const respon = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
        if (respon.ok) muatDaftarTugas();
      } catch (error) {
        console.error("Gagal menghapus data tugas:", error);
      }
    }
  };

  const dapatkanStatusDeadline = (tanggalDeadline, statusTugas) => {
    if (statusTugas === "Selesai")
      return { teks: "Selesai", kelasBadge: "bg-success text-white" };

    const hariIni = new Date();
    hariIni.setHours(0, 0, 0, 0);
    const targetDeadline = new Date(tanggalDeadline);
    targetDeadline.setHours(0, 0, 0, 0);

    const selisihWaktu = targetDeadline.getTime() - hariIni.getTime();
    const selisihHari = Math.ceil(selisihWaktu / (1000 * 60 * 60 * 24));

    if (selisihHari < 0) {
      return {
        teks: `Terlambat (${Math.abs(selisihHari)} Hari)`,
        kelasBadge: "bg-danger text-white fw-bold",
      };
    } else if (selisihHari === 0) {
      return {
        teks: "Hari Ini!",
        kelasBadge: "bg-warning text-dark fw-bold border border-dark",
      };
    } else if (selisihHari === 1) {
      return {
        teks: "Besok!",
        kelasBadge: "bg-warning-subtle text-warning-emphasis fw-semibold",
      };
    } else {
      return {
        teks: `${selisihHari} Hari Lagi`,
        kelasBadge: "bg-info-subtle text-info-emphasis fw-medium",
      };
    }
  };

  // =========================================================
  // 🔥 FUNGSI GENERATE PDF DARI DATABASE MYSQL
  // =========================================================
  const eksporKePDF = () => {
    if (daftarTugas.length === 0)
      return alert("Tidak ada data tugas yang bisa diekspor!");

    const doc = new jsPDF();

    // 1. Atur Judul Laporan PDF
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(18);
    doc.text("LAPORAN MANAJEMEN TUGAS KULIAH", 14, 20);

    // Sub-title info akademik
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Program Studi: Informatika - Semester 4`, 14, 28);
    doc.text(
      `Tanggal Cetak: ${new Date().toLocaleDateString("id-ID")}`,
      14,
      34,
    );

    // Garis pembatas horizontal
    doc.setLineWidth(0.5);
    doc.setDrawColor(200);
    doc.line(14, 38, 196, 38);

    // 2. Format Data Database Menjadi Baris Tabel PDF
    const barisTabel = daftarTugas.map((tugas, index) => {
      const infoDeadline = dapatkanStatusDeadline(tugas.deadline, tugas.status);
      return [
        index + 1,
        tugas.matkul,
        tugas.deskripsi,
        tugas.deadline.split("T")[0],
        infoDeadline.teks,
      ];
    });

    // 3. Render Tabel Menggunakan AutoTable
    doc.autoTable({
      startY: 43,
      head: [
        [
          "No",
          "Mata Kuliah",
          "Deskripsi Tugas",
          "Batas Pengumpulan",
          "Status Validasi",
        ],
      ],
      body: barisTabel,
      theme: "striped",
      headStyles: { fillColor: [23, 162, 184], fontStyle: "bold" },
      styles: { fontSize: 10, cellPadding: 3 },
      columnStyles: {
        0: { cellWidth: 10 },
        1: { cellWidth: 45 },
        2: { cellWidth: 65 },
        3: { cellWidth: 35 },
        4: { cellWidth: 30 },
      },
    });

    // 4. Unduh File PDF Otomatis ke Komputer
    doc.save(`Laporan_Tugas_Informatika_S4_${Date.now()}.pdf`);
  };

  return (
    <div className="container my-5 py-2">
      {/* HEADER UTAMA */}
      <div className="text-center mb-5">
        <span className="badge bg-info text-dark px-3 py-2 rounded-pill fw-bold text-uppercase mb-2">
          Academic Hub
        </span>
        <h2 className="fw-bold text-formidable-navy display-5">
          Jadwal & Manajemen Tugas
        </h2>
        <div
          className="bg-info mx-auto my-3"
          style={{ width: "50px", height: "4px", borderRadius: "2px" }}
        ></div>
      </div>

      <div className="row g-5">
        {/* KOLOM KIRI: LIST JADWAL KULIAH */}
        <div className="col-lg-5">
          <h4 className="fw-bold text-formidable-navy mb-4">
            <i className="bi bi-calendar3 text-info me-2"></i>Jadwal Kuliah
            Semester 4
          </h4>
          <div className="d-flex flex-column gap-3">
            {jadwalKuliah.map((j, index) => (
              <div
                key={index}
                className="card border-0 bg-white p-3 rounded-3 shadow-sm border-start border-4 border-info"
              >
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <span className="badge bg-formidable-navy text-white rounded-pill px-2.5 py-1 fw-bold">
                    {j.hari}
                  </span>
                  <small className="text-muted fw-semibold">
                    <i className="bi bi-clock me-1"></i>
                    {j.jam}
                  </small>
                </div>
                <h6 className="fw-bold text-formidable-navy my-1">
                  {j.matkul}
                </h6>
                <small className="text-muted">
                  <i className="bi bi-geo-alt me-1"></i>
                  {j.ruangan}
                </small>
              </div>
            ))}
          </div>
        </div>

        {/* KOLOM KANAN: MANAJEMEN TUGAS DARI DATABASE */}
        <div className="col-lg-7">
          {/* TOMBOL UTAMA EKSPORT PDF */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4 className="fw-bold text-formidable-navy m-0">
              <i className="bi bi-database-check text-info me-2"></i>Task
              Manager
            </h4>
            <button
              onClick={eksporKePDF}
              className="btn btn-danger fw-bold shadow-sm px-3 py-2 d-flex align-items-center gap-2"
            >
              <i className="bi bi-file-earmark-pdf-fill fs-5"></i> Cetak Laporan
              PDF
            </button>
          </div>

          {/* 🔥 BARU: FORM INPUT TUGAS SEKARANG HANYA MERENDER JIKA ROLE === "ADMIN" */}
          {role === "admin" && (
            <div className="card border-0 bg-white p-4 rounded-4 shadow-sm mb-4">
              <h6 className="fw-bold text-formidable-navy mb-3">
                <i className="bi bi-plus-circle me-1"></i>Tambah Tugas Baru
                (Admin Only)
              </h6>
              <form onSubmit={handleTambahTugas}>
                <div className="mb-3">
                  <label className="form-label small fw-semibold text-muted">
                    Mata Kuliah
                  </label>
                  <select
                    className="form-select bg-light border-0 py-2.5 text-formidable-navy"
                    value={inputMatkul}
                    onChange={(e) => setInputMatkul(e.target.value)}
                  >
                    <option value="">-- Pilih Mata Kuliah --</option>
                    {jadwalKuliah.map((j, i) => (
                      <option key={i} value={j.matkul}>
                        {j.matkul}
                      </option>
                    ))}
                    <option value="Lainnya">Tugas Organisasi / Lainnya</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label small fw-semibold text-muted">
                    Deskripsi Tugas
                  </label>
                  <input
                    type="text"
                    className="form-control bg-light border-0 py-2.5 text-formidable-navy"
                    placeholder="Contoh: Buat RESTful API menggunakan Express.js"
                    value={inputDeskripsi}
                    onChange={(e) => setInputDeskripsi(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label small fw-semibold text-muted">
                    Batas Pengumpulan (Deadline)
                  </label>
                  <input
                    type="date"
                    className="form-control bg-light border-0 py-2.5 text-formidable-navy"
                    value={inputDeadline}
                    onChange={(e) => setInputDeadline(e.target.value)}
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-info w-100 py-2 fw-bold text-dark mt-2"
                >
                  <i className="bi bi-cloud-upload-fill me-1"></i>Simpan ke
                  Database Kelas
                </button>
              </form>
            </div>
          )}

          {/* LIST DAFTAR TUGAS AKTIF */}
          <div className="d-flex flex-column gap-3">
            {daftarTugas.length === 0 ? (
              <div className="text-center p-5 bg-white rounded-3 shadow-sm text-muted">
                <i className="bi bi-emoji-smile fs-1 text-info d-block mb-2"></i>
                Yess! Tidak ada tugas di database saat ini.
              </div>
            ) : (
              daftarTugas.map((tugas) => {
                // Perbaikan kecil: membersihkan typo 'Explicit = ' dari kode lama
                const statusDeadline = dapatkanStatusDeadline(
                  tugas.deadline,
                  tugas.status,
                );
                return (
                  <div
                    key={tugas.id}
                    className={`card border-0 p-3 rounded-3 shadow-sm text-formidable-navy ${tugas.status === "Selesai" ? "bg-light-subtle opacity-75" : "bg-white"}`}
                    style={{
                      borderLeft:
                        tugas.status === "Selesai"
                          ? "4px solid #198754"
                          : statusDeadline.teks.includes("Terlambat")
                            ? "4px solid #dc3545"
                            : "4px solid #ffc107",
                    }}
                  >
                    <div className="d-flex justify-content-between align-items-start gap-2">
                      <div>
                        <span
                          className={`badge mb-1.5 px-2.5 py-1 rounded ${statusDeadline.kelasBadge}`}
                        >
                          {statusDeadline.teks}
                        </span>
                        <h6
                          className={`fw-bold mb-1 mt-1 ${tugas.status === "Selesai" ? "text-decoration-line-through text-muted" : ""}`}
                        >
                          {tugas.matkul}
                        </h6>
                        <p
                          className={`mb-2 small ${tugas.status === "Selesai" ? "text-muted" : ""}`}
                        >
                          {tugas.deskripsi}
                        </p>
                        <small className="text-muted d-block">
                          <i className="bi bi-calendar-event me-1 text-secondary"></i>
                          Batas Pengumpulan: {tugas.deadline.split("T")[0]}
                        </small>
                      </div>

                      {/* 🔥 BARU: AREA TOMBOL MODIFIKASI HANYA DI-RENDER JIKA ROLE === "ADMIN" */}
                      {role === "admin" && (
                        <div className="d-flex gap-1.5 flex-shrink-0">
                          <button
                            onClick={() =>
                              handleToggleStatus(
                                tugas.id,
                                (ExtractedStatus = tugas.status),
                              )
                            }
                            className={`btn btn-sm rounded-circle border ${tugas.status === "Selesai" ? "btn-success text-white" : "btn-light text-muted"}`}
                          >
                            <i
                              className={`bi ${tugas.status === "Selesai" ? "bi-check-circle-fill" : "bi-circle"}`}
                            ></i>
                          </button>
                          <button
                            onClick={() => handleHapusTugas(tugas.id)}
                            className="btn btn-sm btn-light border text-danger rounded-circle"
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
