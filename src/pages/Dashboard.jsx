// src/pages/Dashboard.jsx
import React, { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import { Pie, Bar } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

// 🔥 REVISI 1: Menerima props 'role' dan 'sessionUser' langsung dari App.jsx agar tersinkronisasi instan
export default function Dashboard({ role, sessionUser }) {
  const [daftarTugas, setDaftarTugas] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // 🔥 REVISI 2: Menggunakan endpoint API tasks yang sudah terhubung dengan formidable_tasks
  const API_URL = "http://localhost:5000/api/tasks";

  // State cadangan lokal untuk melacak identitas user
  const [userLogin, setUserLogin] = useState(null);

  // State untuk melacak data mana yang sedang di-edit teksnya
  const [idTugasDiedit, setIdTugasDiedit] = useState(null);
  const [formEdit, setFormEdit] = useState({
    matkul: "",
    deskripsi: "",
    deadline: "",
  });

  const ambilDataTugas = async () => {
    try {
      const respon = await fetch(API_URL);
      const data = await respon.json();
      setDaftarTugas(data);
      setLoading(false);
    } catch (error) {
      console.error("Gagal mengambil data untuk dashboard:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    ambilDataTugas();

    // 🔥 REVISI 3: Kunci disesuaikan dengan 'user_session' agar sinkron dengan file Login.jsx & App.jsx
    const dataUserSesi = localStorage.getItem("user_session");
    const roleSesi = localStorage.getItem("user_role");
    
    if (dataUserSesi) {
      const parsedUser = JSON.parse(dataUserSesi);
      // Satukan role-nya agar tidak bocor
      parsedUser.role = roleSesi || parsedUser.role;
      setUserLogin(parsedUser);
    }
  }, [role, sessionUser]); // Dengarkan perubahan state global jika user baru saja login

  // 1. FUNGSI UNTUK MENYIMPAN PERUBAHAN TEKS KETERANGAN TUGAS (PATCH)
  const simpanPerubahanTeks = async (id) => {
    try {
      const respon = await fetch(`${API_URL}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formEdit),
      });
      const hasil = await respon.json();
      if (hasil.success) {
        setIdTugasDiedit(null);
        ambilDataTugas();
      }
    } catch (error) {
      console.error("Gagal memperbarui teks tugas:", error);
    }
  };

  // 2. FUNGSI UNTUK MENGUBAH STATUS CENTANG (SELESAI / BELUM SELESAI)
  const ubahStatusCentang = async (id, statusSaatIni) => {
    const statusBaru = statusSaatIni === "Selesai" ? "Belum Selesai" : "Selesai";
    try {
      const respon = await fetch(`${API_URL}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: statusBaru }),
      });
      const hasil = await respon.json();
      if (hasil.success) {
        ambilDataTugas();
      }
    } catch (error) {
      console.error("Gagal mengubah status tugas:", error);
    }
  };

  // 3. FUNGSI UNTUK MENGHAPUS TUGAS PERMANEN
  const hapusTugas = async (id) => {
    if (window.confirm("Apakah kamu yakin ingin menghapus tugas ini secara permanen?")) {
      try {
        const respon = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
        const hasil = await respon.json();
        if (hasil.success) {
          ambilDataTugas();
        }
      } catch (error) {
        console.error("Gagal menghapus tugas:", error);
      }
    }
  };

  const aktifkanModeEdit = (tugas) => {
    setIdTugasDiedit(tugas.id);
    setFormEdit({
      matkul: ReadSafeString(tugas.matkul),
      deskripsi: ReadSafeString(tugas.deskripsi),
      deadline: tugas.deadline ? tugas.deadline.split("T")[0] : "",
    });
  };

  const ReadSafeString = (val) => {
    return val !== undefined && val !== null ? val : "";
  };

  // KECERDASAN ANALITIK GRAFIK
  const hitungMetrik = () => {
    let selesai = 0;
    let aktif = 0;
    let terlambat = 0;
    const hariIni = new Date();
    hariIni.setHours(0, 0, 0, 0);

    if (Array.isArray(daftarTugas)) {
      daftarTugas.forEach((tugas) => {
        if (tugas.status === "Selesai") {
          selesai++;
        } else {
          const targetDeadline = new Date(tugas.deadline);
          targetDeadline.setHours(0, 0, 0, 0);
          if (targetDeadline.getTime() - hariIni.getTime() < 0) {
            terlambat++;
          } else {
            aktif++;
          }
        }
      });
    }
    return { total: daftarTugas.length || 0, selesai, aktif, terlambat };
  };

  const metrik = hitungMetrik();

  const dataPie = {
    labels: ["Selesai", "Aktif (Aman)", "Terlambat"],
    datasets: [
      {
        data: [metrik.selesai, metrik.aktif, metrik.terlambat],
        backgroundColor: ["#198754", "#0dcaf0", "#dc3545"],
        borderWidth: 2,
      },
    ],
  };

  const dataBar = {
    labels: ["Total Tugas", "Selesai", "Aktif", "Terlambat"],
    datasets: [
      {
        label: "Jumlah Tugas",
        data: [metrik.total, metrik.selesai, metrik.aktif, metrik.terlambat],
        backgroundColor: ["#0f172a", "#198754", "#0dcaf0", "#dc3545"],
        borderRadius: 6,
      },
    ],
  };

  if (loading) {
    return (
      <div className="container text-center my-5 p-5">
        <div className="spinner-border text-info" role="status"></div>
        <p className="mt-3 text-muted fw-semibold">Memuat Analitik Database...</p>
      </div>
    );
  }

  // 🔥 REVISI 4: PROTEKSI LOGIKA VALIDASI DI-UPGRADE (Membaca props global ATAU simpanan lokal browser)
  const isUserAdmin = role === "admin" || (userLogin && userLogin.role === "admin");

  return (
    <div className="container my-5 py-2">
      {/* HEADER DASHBOARD */}
      <div className="text-center mb-5">
        <span className="badge bg-info text-dark px-3 py-2 rounded-pill fw-bold text-uppercase mb-2">
          RDev Analytics Engine
        </span>
        <h2 className="fw-bold text-formidable-navy display-5">
          Dashboard Analytics & Kontrol
        </h2>
        <div
          className="bg-info mx-auto my-3"
          style={{ width: "50px", height: "4px", borderRadius: "2px" }}
        ></div>
      </div>

      {/* KARTU METRIK STATISTIK */}
      <div className="row g-4 mb-5">
        <div className="col-md-3">
          <div className="card border-0 bg-white p-4 rounded-4 shadow-sm border-start border-4 border-dark">
            <small className="text-muted fw-bold text-uppercase d-block mb-1">Total Tugas</small>
            <h2 className="fw-bold m-0 text-formidable-navy">{metrik.total}</h2>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 bg-white p-4 rounded-4 shadow-sm border-start border-4 border-success">
            <small className="text-muted fw-bold text-uppercase d-block mb-1">Tugas Selesai</small>
            <h2 className="fw-bold m-0 text-success">{metrik.selesai}</h2>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 bg-white p-4 rounded-4 shadow-sm border-start border-4 border-info">
            <small className="text-muted fw-bold text-uppercase d-block mb-1">Tugas Diluar Batas</small>
            <h2 className="fw-bold m-0 text-info">{metrik.aktif}</h2>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 bg-white p-4 rounded-4 shadow-sm border-start border-4 border-danger">
            <small className="text-muted fw-bold text-uppercase d-block mb-1">Tugas Terlambat</small>
            <h2 className="fw-bold m-0 text-danger">{metrik.terlambat}</h2>
          </div>
        </div>
      </div>

      {/* VISUALISASI GRAFIK */}
      <div className="row g-5 mb-5">
        <div className="col-lg-5">
          <div className="card border-0 bg-white p-4 rounded-4 shadow-sm h-100">
            <h5 className="fw-bold text-formidable-navy mb-4">
              <i className="bi bi-pie-chart-fill text-info me-2"></i>Persentase Progres
            </h5>
            {metrik.total === 0 ? (
              <p className="text-muted text-center my-auto py-5">Belum ada data untuk grafik.</p>
            ) : (
              <div className="mx-auto" style={{ width: "85%", maxWidth: "280px" }}>
                <Pie data={dataPie} />
              </div>
            )}
          </div>
        </div>
        <div className="col-lg-7">
          <div className="card border-0 bg-white p-4 rounded-4 shadow-sm h-100">
            <h5 className="fw-bold text-formidable-navy mb-4">
              <i className="bi bi-bar-chart-line-fill text-info me-2"></i>Perbandingan Jumlah Tugas
            </h5>
            {metrik.total === 0 ? (
              <p className="text-muted text-center my-auto py-5">Belum ada data untuk grafik.</p>
            ) : (
              <div style={{ height: "280px" }}>
                <Bar data={dataBar} options={{ responsive: true, maintainAspectRatio: false }} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 🔥 PROTEKSI SINKRON: PANEL MANAGEMENT KONTROL BISA TERBUKA KARENA LOGIKA SINKRON */}
      {isUserAdmin ? (
        <div className="card border-0 bg-white p-4 rounded-4 shadow-sm animate-fade-in">
          <h5 className="fw-bold text-formidable-navy mb-4">
            <i className="bi bi-sliders text-info me-2"></i>Panel Kontrol Tugas (Admin Mode)
          </h5>

          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th style={{ width: "5%" }}>Status</th>
                  <th style={{ width: "30%" }}>Nama Tugas / Keterangan</th>
                  <th style={{ width: "35%" }}>Deskripsi Detail</th>
                  <th style={{ width: "15%" }}>Deadline</th>
                  <th style={{ width: "15%" }} className="text-center">Aksi Kontrol</th>
                </tr>
              </thead>
              <tbody>
                {daftarTugas.map((tugas) => (
                  <tr key={tugas.id}>
                    <td>
                      <input
                        type="checkbox"
                        className="form-check-input border-secondary"
                        style={{ transform: "scale(1.2)", cursor: "pointer" }}
                        checked={tugas.status === "Selesai"}
                        onChange={() => ubahStatusCentang(tugas.id, ExtractorStatus(tugas.status))}
                      />
                    </td>
                    <td>
                      {idTugasDiedit === tugas.id ? (
                        <input
                          type="text"
                          className="form-control form-control-sm border-info"
                          value={formEdit.matkul}
                          onChange={(e) => setFormEdit({ ...formEdit, matkul: e.target.value })}
                        />
                      ) : (
                        <span className={`fw-semibold ${tugas.status === "Selesai" ? "text-decoration-line-through text-muted" : "text-dark"}`}>
                          {tugas.matkul}
                        </span>
                      )}
                    </td>
                    <td>
                      {idTugasDiedit === tugas.id ? (
                        <textarea
                          className="form-control form-control-sm border-info"
                          rows="1"
                          value={formEdit.deskripsi}
                          onChange={(e) => setFormEdit({ ...formEdit, deskripsi: e.target.value })}
                        />
                      ) : (
                        <span className="text-muted small">{tugas.deskripsi || "-"}</span>
                      )}
                    </td>
                    <td>
                      {idTugasDiedit === tugas.id ? (
                        <input
                          type="date"
                          className="form-control form-control-sm border-info"
                          value={formEdit.deadline}
                          onChange={(e) => setFormEdit({ ...formEdit, deadline: e.target.value })}
                        />
                      ) : (
                        <span className="badge bg-light text-dark border small">
                          {tugas.deadline ? new Date(tugas.deadline).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) : "-"}
                        </span>
                      )}
                    </td>
                    <td className="text-center">
                      {idTugasDiedit === tugas.id ? (
                        <div className="btn-group gap-1">
                          <button onClick={() => simpanPerubahanTeks(tugas.id)} className="btn btn-sm btn-success rounded px-2 py-1">
                            <i className="bi bi-check-lg"></i> Simpan
                          </button>
                          <button onClick={() => setIdTugasDiedit(null)} className="btn btn-sm btn-secondary rounded px-2 py-1">
                            Batal
                          </button>
                        </div>
                      ) : (
                        <div className="btn-group gap-1">
                          <button onClick={() => aktifkanModeEdit(tugas)} className="btn btn-sm btn-outline-primary border-0 rounded px-2">
                            <i className="bi bi-pencil-square"></i> Edit
                          </button>
                          <button onClick={() => hapusTugas(tugas.id)} className="btn btn-sm btn-outline-danger border-0 rounded px-2">
                            <i className="bi bi-trash3-fill"></i> Hapus
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        // Tampilan Alternatif kalau yang masuk adalah Student biasa
        <div className="alert alert-light border border-info-subtle text-center py-4 rounded-4 shadow-sm">
          <i className="bi bi-info-circle-fill text-info fs-4 d-block mb-2"></i>
          <span className="text-muted small fw-medium">
            Mode Mahasiswa Aktif. Hak akses penuh panel manajemen data dikunci khusus untuk Akun Tim Admin Utama Formidable.
          </span>
        </div>
      )}
    </div>
  );
}

function ExtractorStatus(status) {
  return status !== undefined && status !== null ? status : "Belum Selesai";
}