import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

function DashboardAnnouncements() {
  const [listInfo, setListInfo] = useState([]);
  const [selectedInfo, setSelectedInfo] = useState(null);
  const [isSaving, setIsSaving] = useState(false); // 🔥 State baru untuk loading
  const API_URL = "http://localhost:5000/api/announcements";

  const muatPengumuman = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      if (Array.isArray(data)) setListInfo(data);
    } catch (error) {
      console.error("Gagal memuat data:", error);
    }
  };

  useEffect(() => {
    muatPengumuman();
  }, []);

  const handleSimpanPerubahan = async (e) => {
    e.preventDefault();
    setIsSaving(true); // 🔥 Mulai loading

    try {
      const response = await fetch(`${API_URL}/${selectedInfo.id_kartu}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-user-role": localStorage.getItem("user_role"),
        },
        body: JSON.stringify(selectedInfo),
      });

      const hasil = await response.json();

      if (response.status === 403) {
        toast.error("Akses Ditolak: Anda bukan admin!");
      } else if (hasil.success) {
        toast.success(`Berhasil memperbarui ${selectedInfo.judul}!`);
        muatPengumuman();
        setSelectedInfo(null);
      } else {
        toast.error(hasil.message || "Gagal memperbarui.");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan koneksi.");
    } finally {
      setIsSaving(false); // 🔥 Selesai loading (apapun hasilnya)
    }
  };

  return (
    <div className="container py-4">
      <h2 className="fw-bold text-formidable-navy mb-4">
        Management Informasi Home
      </h2>
      <div className="row g-4">
        <div className={selectedInfo ? "col-md-6" : "col-md-12"}>
          <div
            className="card border-0 shadow-sm p-4 bg-white"
            style={{ borderRadius: "12px" }}
          >
            <table className="table table-hover align-middle">
              <thead>
                <tr>
                  <th>Slot</th>
                  <th>Judul</th>
                  <th className="text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {listInfo.map((info) => (
                  <tr key={info.id_kartu}>
                    <td>{info.id_kartu}</td>
                    <td className="fw-bold">{info.judul}</td>
                    <td className="text-center">
                      <button
                        className="btn btn-sm btn-info"
                        onClick={() => setSelectedInfo({ ...info })}
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {selectedInfo && (
          <div className="col-md-6">
            <div
              className="card border-0 shadow p-4 bg-light"
              style={{ borderRadius: "12px" }}
            >
              <form onSubmit={handleSimpanPerubahan}>
                <div className="mb-3">
                  <label className="form-label small fw-bold">Judul</label>
                  <input
                    type="text"
                    className="form-control"
                    value={selectedInfo.judul}
                    onChange={(e) =>
                      setSelectedInfo({
                        ...selectedInfo,
                        judul: e.target.value,
                      })
                    }
                  />
                </div>

                {/* 🔥 Tombol dengan Loading State */}
                <button
                  type="submit"
                  className="btn btn-success w-100"
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Menyimpan...
                    </>
                  ) : (
                    "Simpan Teks Konten"
                  )}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default DashboardAnnouncements;
