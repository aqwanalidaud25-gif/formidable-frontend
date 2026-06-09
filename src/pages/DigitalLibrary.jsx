// src/pages/DigitalLibrary.jsx
import React, { useState, useEffect } from "react";

export default function DigitalLibrary() {
  const [dataMateri, setDataMateri] = useState([]);
  const [kataKunci, setKataKunci] = useState("");
  const [kategoriTerpilih, setKategoriTerpilih] = useState("Semua");

  // STATE UNTUK TOGGLE FORM ADMIN (Biar bisa disembunyikan/tampilkan)
  const [showAdminForm, setShowAdminForm] = useState(false);

  // STATE FORM INPUT MATERI BARU
  const [inputJudul, setInputJudul] = useState("");
  const [inputMatkul, setInputMatkul] = useState("");
  const [inputTipe, setInputTipe] = useState("PDF");
  const [inputUkuran, setInputUkuran] = useState("");
  const [inputKategori, setInputKategori] = useState("Modul Kuliah");
  const [inputLink, setInputLink] = useState("");

  const daftarKategori = [
    "Semua",
    "Modul Kuliah",
    "Slide Presentasi",
    "E-Book",
    "Template Dokumen",
    "Source Code",
    "Arsip Ujian",
  ];
  const API_URL = "http://localhost:5000/api/library";

  // FUNGSI LOAD DATA DARI MYSQL
  const muatMateriLibrary = async () => {
    try {
      const respon = await fetch(API_URL);
      const data = await respon.json();
      setDataMateri(data);
    } catch (error) {
      console.error("Gagal memuat materi library:", error);
    }
  };

  useEffect(() => {
    muatMateriLibrary();
  }, []);

  // FUNGSI POST DATA BARU KE BACKEND
  const handleTambahMateri = async (e) => {
    e.preventDefault();
    if (!inputJudul || !inputMatkul || !inputUkuran || !inputLink) {
      return alert("Mohon isi semua kolom data materi!");
    }

    const materiBaru = {
      judul: inputJudul,
      matkul: inputMatkul,
      tipe: inputTipe,
      ukuran: inputUkuran,
      kategori: inputKategori,
      linkDownload: inputLink,
    };

    try {
      const respon = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(materiBaru),
      });

      if (respon.ok) {
        alert("Mantap! Materi baru sukses diunggah ke database.");
        muatMateriLibrary(); // Refresh list kartu materi
        // Reset form input
        setInputJudul("");
        setInputMatkul("");
        setInputUkuran("");
        setInputLink("");
        setShowAdminForm(false); // Sembunyikan form lagi
      }
    } catch (error) {
      alert("Gagal mengirim data ke server backend!");
    }
  };

  // LOGIKA LIVE SEARCH & FILTER
  const materiTersaring = dataMateri.filter((materi) => {
    const cocokKategori =
      kategoriTerpilih === "Semua" || materi.kategori === kategoriTerpilih;
    const cocokKataKunci =
      materi.judul.toLowerCase().includes(kataKunci.toLowerCase()) ||
      materi.matkul.toLowerCase().includes(kataKunci.toLowerCase());
    return cocokKategori && cocokKataKunci;
  });

  const getFileIcon = (tipe) => {
    switch (tipe?.toUpperCase()) {
      case "PDF":
        return <i className="bi bi-file-earmark-pdf-fill text-danger fs-2"></i>;
      case "PPTX":
        return (
          <i className="bi bi-file-earmark-ppt-fill text-warning fs-2"></i>
        );
      case "DOCX":
        return (
          <i className="bi bi-file-earmark-word-fill text-primary fs-2"></i>
        );
      case "ZIP":
        return (
          <i
            className="bi bi-file-earmark-zip-fill fs-2"
            style={{ color: "#fd7e14" }}
          ></i>
        );
      default:
        return (
          <i className="bi bi-file-earmark-arrow-down-fill text-secondary fs-2"></i>
        );
    }
  };

  return (
    <div className="container my-5 py-2">
      {/* HEADER */}
      <div className="text-center mb-5">
        <span className="badge bg-info text-dark px-3 py-2 rounded-pill fw-bold text-uppercase mb-2">
          Resource Center
        </span>
        <h2 className="fw-bold text-formidable-navy display-5">
          Digital Library Formidable
        </h2>
        <div
          className="bg-info mx-auto my-3"
          style={{ width: "50px", height: "4px", borderRadius: "2px" }}
        ></div>

        {/* TOMBOL TOGGLE ADMIN MODE */}
        <button
          onClick={() => setShowAdminForm(!showAdminForm)}
          className={`btn btn-sm fw-bold px-4 py-2 mt-2 rounded-pill ${showAdminForm ? "btn-danger" : "btn-formidable-navy text-white"}`}
        >
          {showAdminForm ? (
            <>
              <i className="bi bi-x-circle me-1"></i> Tutup Panel Admin
            </>
          ) : (
            <>
              <i className="bi bi-lock-fill me-1"></i> Mode Tambah Materi
              (Admin)
            </>
          )}
        </button>
      </div>

      {/* FORM INPUT ADMIN (HANYA MUNCUL JIKA SHOWADMINFORM = TRUE) */}
      {showAdminForm && (
        <div className="card border-0 bg-white p-4 rounded-4 shadow-sm border-start border-4 border-info mb-5 animate__animated animate__fadeIn">
          <h5 className="fw-bold text-formidable-navy mb-3">
            <i className="bi bi-cloud-arrow-up text-info me-2"></i>Form Unggah
            Berkas Digital Baru
          </h5>
          <form onSubmit={handleTambahMateri}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label small fw-semibold text-muted">
                  Judul Materi / Modul
                </label>
                <input
                  type="text"
                  className="form-control bg-light border-0 py-2.5 text-formidable-navy"
                  placeholder="Contoh: Modul Kisi-Kisi UTS"
                  value={inputJudul}
                  onChange={(e) => setInputJudul(e.target.value)}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label small fw-semibold text-muted">
                  Mata Kuliah
                </label>
                <input
                  type="text"
                  className="form-control bg-light border-0 py-2.5 text-formidable-navy"
                  placeholder="Contoh: Pemrograman Web Backend"
                  value={inputMatkul}
                  onChange={(e) => setInputMatkul(e.target.value)}
                />
              </div>
              <div className="col-md-3">
                <label className="form-label small fw-semibold text-muted">
                  Format Berkas
                </label>
                <select
                  className="form-select bg-light border-0 py-2.5 text-formidable-navy"
                  value={inputTipe}
                  onChange={(e) => setInputTipe(e.target.value)}
                >
                  <option value="PDF">PDF</option>
                  <option value="PPTX">PPTX (PowerPoint)</option>
                  <option value="DOCX">DOCX (Word)</option>
                  <option value="ZIP">ZIP / RAR (Source Code)</option>
                </select>
              </div>
              <div className="col-md-3">
                <label className="form-label small fw-semibold text-muted">
                  Ukuran Berkas
                </label>
                <input
                  type="text"
                  className="form-control bg-light border-0 py-2.5 text-formidable-navy"
                  placeholder="Contoh: 3.5 MB atau 12 KB"
                  value={inputUkuran}
                  onChange={(e) => setInputUkuran(e.target.value)}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label small fw-semibold text-muted">
                  Kategori Resource
                </label>
                <select
                  className="form-select bg-light border-0 py-2.5 text-formidable-navy"
                  value={inputKategori}
                  onChange={(e) => setInputKategori(e.target.value)}
                >
                  {daftarKategori
                    .filter((k) => k !== "Semua")
                    .map((kat, i) => (
                      <option key={i} value={kat}>
                        {kat}
                      </option>
                    ))}
                </select>
              </div>
              <div className="col-12">
                <label className="form-label small fw-semibold text-muted">
                  Tautan Unduhan (Google Drive Link / URL)
                </label>
                <input
                  type="url"
                  className="form-control bg-light border-0 py-2.5 text-formidable-navy"
                  placeholder="https://drive.google.com/..."
                  value={inputLink}
                  onChange={(e) => setInputLink(e.target.value)}
                />
              </div>
              <div className="col-12 mt-4">
                <button
                  type="submit"
                  className="btn btn-info px-4 py-2.5 fw-bold text-dark shadow-sm"
                >
                  <i className="bi bi-save2-fill me-1"></i>Masukkan ke Database
                  Library
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* SEARCH BAR & FILTER ZONE */}
      <div className="bg-white p-4 rounded-4 shadow-sm border mb-4">
        <div className="row g-3 align-items-center">
          <div className="col-md-5 col-lg-4">
            <div className="input-group">
              <span className="input-group-text bg-light border-0 text-muted">
                <i className="bi bi-search"></i>
              </span>
              <input
                type="text"
                className="form-control bg-light border-0 py-2.5 text-formidable-navy"
                placeholder="Cari judul atau matkul..."
                value={kataKunci}
                onChange={(e) => setKataKunci(e.target.value)}
              />
            </div>
          </div>

          <div className="col-md-7 col-lg-8">
            <div
              className="d-flex gap-2 overflow-x-auto pb-1"
              style={{ whiteSpace: "nowrap" }}
            >
              {daftarKategori.map((kat, index) => (
                <button
                  key={index}
                  onClick={() => setKategoriTerpilih(kat)}
                  className={`btn btn-sm px-3 py-2 rounded-pill fw-semibold ${kategoriTerpilih === kat ? "btn-info text-dark shadow-sm" : "btn-light border text-muted"}`}
                >
                  {kat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* GRID DAFTAR MATERI */}
      <div className="row g-3">
        {materiTersaring.length === 0 ? (
          <div className="col-12 text-center p-5 bg-white rounded-4 border text-muted">
            <i className="bi bi-folder-x fs-1 text-secondary d-block mb-2"></i>
            Materi tidak ditemukan di database.
          </div>
        ) : (
          materiTersaring.map((materi) => (
            <div className="col-md-6 col-xl-4" key={materi.id}>
              <div
                className="card h-100 bg-white border-0 p-3 rounded-4 shadow-sm d-flex flex-column"
                style={{ border: "1px solid rgba(0,0,0,0.03)" }}
              >
                <div className="d-flex align-items-start gap-3 mb-3">
                  <div
                    className="p-2.5 bg-light rounded-3 flex-shrink-0 d-flex align-items-center justify-content-center"
                    style={{ width: "55px", height: "55px" }}
                  >
                    {getFileIcon(materi.tipe)}
                  </div>

                  <div className="overflow-hidden">
                    <span
                      className="badge bg-info-subtle text-info mb-1"
                      style={{ fontSize: "0.65rem", fontWeight: "700" }}
                    >
                      {materi.kategori}
                    </span>
                    <h6
                      className="fw-bold text-formidable-navy text-truncate-2 mb-1"
                      style={{ lineHeight: "1.4", fontSize: "0.95rem" }}
                      title={materi.judul}
                    >
                      {materi.judul}
                    </h6>
                    <small
                      className="text-muted d-block text-truncate fw-semibold"
                      style={{ fontSize: "0.8rem" }}
                    >
                      <i className="bi bi-book-half me-1"></i>
                      {materi.matkul}
                    </small>
                  </div>
                </div>

                <div className="mt-auto pt-3 border-top d-flex align-items-center justify-content-between">
                  <small className="text-muted fw-medium">
                    {materi.tipe} &bull; {materi.ukuran}
                  </small>
                  <a
                    href={materi.linkDownload}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-sm btn-formidable-navy text-white px-3 py-1.5 rounded-pill fw-bold"
                  >
                    <i className="bi bi-cloud-arrow-down-fill me-1"></i>Unduh
                  </a>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
