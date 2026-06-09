// src/pages/DashboardAnnouncements.jsx
import React, { useState, useEffect } from "react";

export default function DashboardAnnouncements() {
  const [listInfo, setListInfo] = useState([]);
  const [selectedInfo, setSelectedInfo] = useState(null);
  const [pesanSukses, setPesanSukses] = useState("");

  const API_URL = "http://localhost:5000/api/announcements";

  // Ambil data pengumuman dari database
  const muatPengumuman = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      if (Array.isArray(data)) setListInfo(data);
    } catch (error) {
      console.error("Gagal memuat data di dashboard:", error);
    }
  };

  useEffect(() => {
    muatPengumuman();
  }, []);

  // Handler saat form disubmit
  const handleSimpanPerubahan = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/${selectedInfo.id_kartu}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selectedInfo),
      });
      const hasil = await response.json();

      if (hasil.success) {
        setPesanSukses(`Berhasil memperbarui ${selectedInfo.judul}!`);
        muatPengumuman(); // Refresh data list
        setSelectedInfo(null); // Tutup form edit
        setTimeout(() => setPesanSukses(""), 4000);
      }
    } catch (error) {
      console.error("Gagal memperbarui pengumuman:", error);
    }
  };

  return (
    <div className="container py-4">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h2 className="fw-bold text-formidable-navy">
            Management Informasi Home
          </h2>
          <p className="text-muted mb-0">
            Ubah teks konten pada 3 kartu pengumuman utama secara realtime.
          </p>
        </div>
      </div>

      {pesanSukses && (
        <div
          className="alert alert-success alert-dismissible fade show shadow-sm rounded-3"
          role="alert"
        >
          <i className="bi bi-check-circle-fill me-2"></i> {pesanSukses}
        </div>
      )}

      <div className="row g-4">
        {/* KOLOM DAFTAR KARTU */}
        <div className={selectedInfo ? "col-md-6" : "col-md-12"}>
          <div
            className="card border-0 shadow-sm p-4 bg-white"
            style={{ borderRadius: "12px" }}
          >
            <h5 className="fw-bold mb-3 text-secondary">
              Daftar Slot Pengumuman Aktif
            </h5>
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Slot Kartu</th>
                    <th>Judul Informasi</th>
                    <th>Kategori</th>
                    <th>Tanggal Terbit</th>
                    <th className="text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {listInfo.map((info) => (
                    <tr key={info.id_kartu}>
                      <td>
                        <span className="badge bg-secondary font-monospace">
                          {info.id_kartu}
                        </span>
                      </td>
                      <td className="fw-bold text-formidable-navy">
                        {info.judul}
                      </td>
                      <td>
                        <span className="badge bg-light text-dark border">
                          {info.kategori}
                        </span>
                      </td>
                      <td className="small text-muted">{info.tanggal}</td>
                      <td className="text-center">
                        <button
                          className="btn btn-sm btn-info fw-bold px-3 text-dark rounded-pill"
                          onClick={() => setSelectedInfo({ ...info })}
                        >
                          <i className="bi bi-pencil-square me-1"></i> Edit Teks
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* KOLOM FORM EDIT INTERAKTIF */}
        {selectedInfo && (
          <div className="col-md-6">
            <div
              className="card border-0 shadow p-4 bg-light border-start border-info border-4 sticky-top"
              style={{ borderRadius: "12px", top: "20px" }}
            >
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="fw-bold text-formidable-navy mb-0">
                  Form Editor: {selectedInfo.id_kartu}
                </h5>
                <button
                  className="btn-close"
                  onClick={() => setSelectedInfo(null)}
                ></button>
              </div>

              <form onSubmit={handleSimpanPerubahan}>
                <div className="mb-3">
                  <label className="form-label small fw-bold">
                    Judul Pengumuman
                  </label>
                  <input
                    type="text"
                    className="form-content form-control bg-white"
                    required
                    value={selectedInfo.judul}
                    onChange={(e) =>
                      setSelectedInfo({
                        ...selectedInfo,
                        judul: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="row mb-3">
                  <div className="col">
                    <label className="form-label small fw-bold">Kategori</label>
                    <input
                      type="text"
                      className="form-control bg-white"
                      required
                      value={selectedInfo.kategori}
                      onChange={(e) =>
                        setSelectedInfo({
                          ...selectedInfo,
                          kategori: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="col">
                    <label className="form-label small fw-bold">
                      Tanggal Teks
                    </label>
                    <input
                      type="text"
                      className="form-control bg-white"
                      placeholder="Contoh: 28 Mei 2026"
                      required
                      value={selectedInfo.tanggal}
                      onChange={(e) =>
                        setSelectedInfo({
                          ...selectedInfo,
                          tanggal: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-bold">
                    Diterbitkan Oleh
                  </label>
                  <input
                    type="text"
                    className="form-control bg-white"
                    required
                    value={selectedInfo.oleh}
                    onChange={(e) =>
                      setSelectedInfo({ ...selectedInfo, oleh: e.target.value })
                    }
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-bold">
                    Ringkasan Pendek (Tampil di Depan Card)
                  </label>
                  <textarea
                    className="form-control bg-white"
                    rows="2"
                    required
                    maxLength="100"
                    value={selectedInfo.ringkasan}
                    onChange={(e) =>
                      setSelectedInfo({
                        ...selectedInfo,
                        ringkasan: e.target.value,
                      })
                    }
                  ></textarea>
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-bold">
                    Isi Detail Informasi (Tampil di Dalam Pop-up Modal)
                  </label>
                  <textarea
                    className="form-control bg-white"
                    rows="4"
                    required
                    value={selectedInfo.detail}
                    onChange={(e) =>
                      setSelectedInfo({
                        ...selectedInfo,
                        detail: e.target.value,
                      })
                    }
                  ></textarea>
                </div>

                <div className="d-flex gap-2 justify-content-end mt-4">
                  <button
                    type="button"
                    className="btn btn-secondary px-3 rounded-pill fw-bold"
                    onClick={() => setSelectedInfo(null)}
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="btn btn-success px-4 rounded-pill fw-bold shadow-sm"
                  >
                    Simpan Teks Konten
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
