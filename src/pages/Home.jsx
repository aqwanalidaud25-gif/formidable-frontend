// src/pages/Home.jsx
import React, { useState, useEffect } from "react";

export default function Home({ setCurrentPage }) {
  const heroBgUrl = "/img/informatika-f.jpeg";
  const [dataPengumumkan, setDataPengumumkan] = useState([]);
  const API_URL = "http://localhost:5000/api/announcements";

  useEffect(() => {
    const ambilDataPengumuman = async () => {
      const backupData = [
        {
          id_kartu: "pengumuman-tugas",
          judul: "Deadline Tugas Backend",
          icon: "bi-calendar-week",
          ringkasan: "Tugas Besar Pemrograman Web Backend berupa REST API.",
          kategori: "Tugas Kuliah",
          tanggal: "25 Mei 2026",
          oleh: "RDev Team / Dosen Pengampu",
          detail:
            "Tugas Besar membuat REST API menggunakan Node.js/Express.js atau Laravel. Harus dikumpulkan dalam bentuk link repositori GitHub beserta dokumentasi Postman. Batas akhir pengumpulan hari Jum'at jam 23:59 WITA via Google Classroom. Keterlambatan akan mengurangi nilai sebesar 10% per hari.",
        },
        {
          id_kartu: "pengumuman-rdev",
          judul: "RDev Space Showcase",
          icon: "bi-lightning-charge",
          ringkasan: "Open submission untuk pameran proyek coding & IoT kelas.",
          kategori: "RDev Division",
          tanggal: "28 Mei 2026",
          oleh: "Divisi Research & Development",
          detail:
            "Bagi seluruh mahasiswa Formidable yang memiliki proyek sampingan (Side Project) baik berupa web portfolio, aplikasi frontend, maupun alat IoT berbasis Arduino/ESP32, diharapkan menyetorkan tautan atau demonstrasinya ke divisi RDev agar bisa dipajang di halaman utama website kelas kita sebagai bentuk apresiasi.",
        },
        {
          id_kartu: "pengumuman-kas",
          judul: "Iuran Kas Bulan Mei",
          icon: "bi-megaphone",
          ringkasan: "Pemberitahuan iuran bulanan kas kelas sebesar Rp20.000.",
          kategori: "Internal Kelas",
          tanggal: "30 Mei 2026",
          oleh: "Bendahara Kelas",
          detail:
            "Mengingat akan diadakannya agenda malam keakraban (Makrab) angkatan di akhir semester, diharapkan seluruh anggota kelas Formidable (24 orang) untuk melunasi iuran kas bulan Mei sebesar Rp20.000 sebelum tanggal 30 Mei. Pembayaran bisa dilakukan langsung tunai ke Bendahara atau transfer via E-Wallet.",
        },
      ];

      try {
        const respon = await fetch(API_URL);
        const data = await respon.json();

        if (Array.isArray(data) && data.length > 0) {
          setDataPengumumkan(data);
        } else {
          setDataPengumumkan(backupData);
        }
      } catch (error) {
        console.error(
          "Gagal sinkronisasi DB pengumuman, aktifkan cadangan:",
          error,
        );
        setDataPengumumkan(backupData);
      }
    };

    ambilDataPengumuman();
  }, []);

  const [activePengumuman, setActivePengumuman] = useState(null);

  return (
    <div>
      {/* HERO SECTION */}
      <section
        className="text-white py-5 text-center position-relative d-flex align-items-center"
        style={{
          backgroundImage: `linear-gradient(rgba(10, 25, 47, 0.85), rgba(10, 25, 47, 0.95)), url(${heroBgUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          minHeight: "55vh",
        }}
      >
        <div className="container py-5 position-relative" style={{ zIndex: 2 }}>
          <span className="badge bg-info text-dark mb-3 px-3 py-2 rounded-pill fw-bold text-uppercase tracking-wider">
            Informatics Class Platform
          </span>
          <h1 className="display-4 fw-extrabold mb-3 text-white">
            We Are <span className="text-info">FORMIDABLE</span>
          </h1>
          <p
            className="lead text-white-50 mx-auto mb-4"
            style={{ maxWidth: "600px", lineHeight: "1.7" }}
          >
            Solidaritas tanpa batas, kreativitas tanpa akhir. Wadah kolaborasi
            digital untuk mahasiswa informatika masa depan.
          </p>
          <div className="d-flex justify-content-center gap-3">
            <button
              className="btn btn-info btn-lg px-4 fw-bold shadow"
              onClick={() => setCurrentPage("about")}
            >
              Jelajahi Kelas <i className="bi bi-arrow-right ms-2"></i>
            </button>
          </div>
        </div>
      </section>

      {/* CARD SECTION */}
      <section className="container my-5 py-4">
        <div className="text-center mb-5">
          <h3 className="fw-bold text-formidable-navy">
            Informasi & Pengumuman Terbaru
          </h3>
          <p className="text-muted small">
            Klik pada salah satu kartu di bawah ini untuk melihat detail
            informasi selengkapnya.
          </p>
        </div>

        <div className="row g-4">
          {dataPengumumkan.map((item) => (
            <div className="col-md-4" key={item.id_kartu || item.id}>
              <div
                className="card card-modern p-4 text-center bg-white h-100 cursor-pointer"
                style={{
                  cursor: "pointer",
                  border: "1px solid rgba(0,0,0,0.03)",
                }}
                data-bs-toggle="modal"
                data-bs-target="#pengumumanModal"
                onClick={() => setActivePengumuman(item)}
              >
                <div className="text-info mb-3">
                  <i className={`bi ${item.icon || "bi-info-circle"} fs-1`}></i>
                </div>
                <span
                  className="badge bg-light text-formidable-navy border mb-2 align-self-center px-2 py-1"
                  style={{ fontSize: "0.75rem" }}
                >
                  {item.kategori}
                </span>
                <h5 className="fw-bold text-formidable-navy">{item.judul}</h5>
                <p className="text-muted small mb-0">{item.ringkasan}</p>
                <div className="mt-3 text-info small fw-bold">
                  Baca Selengkapnya{" "}
                  <i className="bi bi-chevron-right small"></i>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* POP-UP MODAL */}
      <div
        className="modal fade"
        id="pengumumanModal"
        tabIndex="-1"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div
            className="modal-content border-0 shadow-lg"
            style={{ borderRadius: "16px" }}
          >
            {activePengumuman && (
              <>
                <div
                  className="modal-header bg-formidable-navy text-white"
                  style={{
                    borderTopLeftRadius: "16px",
                    borderTopRightRadius: "16px",
                  }}
                >
                  <h5 className="modal-title fw-bold d-flex align-items-center">
                    <i
                      className={`bi ${activePengumuman.icon || "bi-info-circle"} text-info me-2 fs-4`}
                    ></i>
                    {activePengumuman.judul}
                  </h5>
                  <button
                    type="button"
                    className="btn-close btn-close-white"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>
                </div>

                <div className="modal-body p-4 bg-light">
                  <div className="d-flex flex-wrap gap-2 mb-3">
                    <span className="badge bg-info text-dark px-2.5 py-1.5 rounded-pill fw-bold">
                      {activePengumuman.kategori}
                    </span>
                    <span className="badge bg-white text-muted border px-2.5 py-1.5 rounded-pill">
                      <i className="bi bi-clock me-1"></i>{" "}
                      {activePengumuman.tanggal}
                    </span>
                  </div>
                  <div className="card border-0 p-3 bg-white shadow-sm mb-3">
                    <p
                      className="text-formidable-navy mb-0"
                      style={{ lineHeight: "1.6", textAlign: "justify" }}
                    >
                      {activePengumuman.detail}
                    </p>
                  </div>
                  <div
                    className="text-end text-muted"
                    style={{ fontSize: "0.8rem" }}
                  >
                    Diterbitkan oleh:{" "}
                    <strong className="text-formidable-navy">
                      {activePengumuman.oleh}
                    </strong>
                  </div>
                </div>

                <div
                  className="modal-footer bg-white"
                  style={{
                    borderBottomLeftRadius: "16px",
                    borderBottomRightRadius: "16px",
                    borderTop: "none",
                  }}
                >
                  <button
                    type="button"
                    className="btn bg-formidable-navy text-white px-4 py-2 rounded-pill fw-bold"
                    data-bs-dismiss="modal"
                  >
                    Dimengerti
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
