// src/pages/About.jsx
import React, { useState, useEffect } from "react";

export default function About() {
  const [anggotaKelas, setAnggotaKelas] = useState([]);

  const muatAnggota = async () => {
    try {
      const respon = await fetch("http://localhost:5000/api/auth/about");
      const data = await respon.json();
      setAnggotaKelas(data);
    } catch (error) {
      console.error("Gagal memuat data kelas:", error);
    }
  };

  useEffect(() => {
    muatAnggota();
    const interval = setInterval(muatAnggota, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container my-5 py-2">
      {/* HEADER */}
      <div className="text-center mb-5">
        <span className="badge bg-info text-dark px-3 py-2 rounded-pill fw-bold text-uppercase mb-2">
          FORMSQUAD DIRECTORY
        </span>
        <h2 className="fw-bold text-formidable-navy display-5">
          Profil & Anggota Kelas
        </h2>
        <p className="text-muted">
          Direktori resmi mahasiswa Informatika Semester 4 beserta keahlian
          spesifiknya
        </p>
        <div
          className="bg-info mx-auto my-3"
          style={{ width: "50px", height: "4px", borderRadius: "2px" }}
        ></div>
      </div>

      {/* CARDS GRID */}
      <div className="row g-4">
        {anggotaKelas.length === 0 ? (
          <div className="text-center p-5 text-muted bg-white rounded-3 shadow-sm">
            <i className="bi bi-people fs-1 text-secondary d-block mb-2"></i>
            Belum ada mahasiswa kelas yang melengkapi biodata profil.
          </div>
        ) : (
          anggotaKelas.map((mhs) => (
            <div key={mhs.id} className="col-lg-4 col-md-6">
              <div className="card border-0 bg-white p-4 rounded-4 shadow-sm position-relative overflow-hidden h-100 d-flex flex-column justify-content-between">
                <div>
                  {/* Header Card: Avatar Foto + Nama + Status */}
                  <div className="d-flex align-items-start justify-content-between mb-3">
                    <div className="d-flex align-items-center gap-3">
                      {/* 🔥 FITUR FOTO OTOMATIS BERDASARKAN GITHUB */}
                      {mhs.github ? (
                        <img
                          src={`https://github.com/${mhs.github}.png`}
                          alt={mhs.nama}
                          className="rounded-circle object-fit-cover shadow-sm border border-2 border-info"
                          style={{ width: "55px", height: "55px" }}
                          onError={(e) => {
                            // Jika username github salah/tidak ditemukan, balikkan ke avatar inisial default
                            e.target.onerror = null;
                            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(mhs.nama)}&background=0dcaf0&color=fff`;
                          }}
                        />
                      ) : (
                        // Jika mahasiswa tidak punya github, pakai placeholder avatar keren berdasarkan namanya
                        <img
                          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(mhs.nama)}&background=0dcaf0&color=fff&bold=true`}
                          alt={mhs.nama}
                          className="rounded-circle shadow-sm"
                          style={{ width: "55px", height: "55px" }}
                        />
                      )}

                      <div>
                        <h6 className="fw-bold text-formidable-navy m-0">
                          {mhs.nama}
                        </h6>
                        <small
                          className="text-info fw-semibold border border-info-subtle bg-info-subtle px-2 py-0.5 rounded"
                          style={{ fontSize: "11px" }}
                        >
                          {mhs.bidang}
                        </small>
                      </div>
                    </div>

                    {/* LIVE PRESENCE BADGE */}
                    {mhs.is_online === 1 ? (
                      <span
                        className="badge bg-success text-white px-2 py-1 rounded-pill small fw-bold animate-pulse"
                        style={{ fontSize: "10px" }}
                      >
                        ● Live
                      </span>
                    ) : (
                      <span
                        className="badge bg-light text-muted border px-2 py-1 rounded-pill small fw-medium"
                        style={{ fontSize: "10px" }}
                      >
                        ○ Offline
                      </span>
                    )}
                  </div>

                  {/* Body Card: Email Info */}
                  <p className="text-muted small mb-3">
                    <i className="bi bi-envelope me-1.5"></i>
                    {mhs.email}
                  </p>
                </div>

                {/* Footer Card: Tombol Social GitHub Link */}
                <div className="border-top pt-3 mt-auto d-flex align-items-center justify-content-between">
                  {mhs.github ? (
                    <a
                      href={`https://github.com/${mhs.github}`}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-sm btn-dark px-3 py-1.5 rounded-3 d-flex align-items-center gap-2 fw-medium"
                    >
                      <i className="bi bi-github"></i> Kunjungi GitHub
                    </a>
                  ) : (
                    <span className="text-muted small fst-italic">
                      <i className="bi bi-github me-1"></i> Belum ada GitHub
                    </span>
                  )}

                  {/* Penanda Admin */}
                  {mhs.role === "admin" && (
                    <span
                      className="badge bg-danger text-white px-2 py-1 rounded-2"
                      style={{ fontSize: "10px", letterSpacing: "0.5px" }}
                    >
                      INTEL/ADMIN
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
