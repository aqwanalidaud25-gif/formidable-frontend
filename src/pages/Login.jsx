import React, { useState } from "react";

export default function Login({ setRole, setSessionUser, setCurrentPage }) {
  const [isRegister, setIsRegister] = useState(false);
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [github, setGithub] = useState("");
  const [bidang, setBidang] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isRegister && password !== confirmPassword) {
      return alert(
        "❌ Konfirmasi password tidak cocok! Silakan periksa kembali ketikan kamu.",
      );
    }

    // 🔥 REVISI URL: Menggunakan Localhost agar stabil dan bebas dari masalah CORS
    const url = isRegister
      ? "http://localhost:5000/api/auth/register"
      : "http://localhost:5000/api/auth/login";

    const bodyData = isRegister
      ? { nama, email, password, github, bidang }
      : { email, password };

    try {
      const respon = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(bodyData),
      });

      const data = await respon.json();

      if (!respon.ok)
        return alert(data.pesan || data.error || "Terjadi kesalahan!");

      if (isRegister) {
        alert(data.pesan || "Registrasi berhasil!");
        setIsRegister(false);
        setNama("");
        setConfirmPassword("");
        setPassword("");
        setGithub("");
        setBidang("");
      } else {
        const userLogin = data.user || data.data || data;
        const roleUser = userLogin.role || "student";

        alert(`Selamat Datang, ${userLogin.nama || "Admin Formidable"}!`);

        setRole(roleUser);
        setSessionUser(userLogin);

        localStorage.setItem("user_role", roleUser);
        localStorage.setItem("user_session", JSON.stringify(userLogin));

        setCurrentPage("home");
      }
    } catch (error) {
      console.error("Detail Error Browser:", error);
      alert(
        `Gagal terhubung ke server backend!\nDetail: ${error.message}\n\nPastikan MySQL XAMPP sudah di-START dan server backend berjalan di port 5000.`,
      );
    }
  };

  const handleToggleMode = () => {
    setIsRegister(!isRegister);
    setPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="container my-5 py-4">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card border-0 bg-white p-4 rounded-4 shadow-sm">
            <div className="text-center mb-4">
              <span className="badge bg-info text-dark px-3 py-2 rounded-pill fw-bold mb-2">
                ACADEMIC GATEWAY
              </span>
              <h4 className="fw-bold text-formidable-navy">
                {isRegister
                  ? "Registrasi Profil Anggota Kelas"
                  : "Login Portal Kelas"}
              </h4>
            </div>

            <form onSubmit={handleSubmit}>
              {isRegister && (
                <>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold text-muted">
                      Nama Lengkap
                    </label>
                    <input
                      type="text"
                      className="form-control bg-light border-0 py-2.5"
                      placeholder="Nama lengkap sesuai siakad"
                      value={nama}
                      onChange={(e) => setNama(e.target.value)}
                      required
                    />
                  </div>
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold text-muted">
                        Username GitHub (Opsional)
                      </label>
                      <div className="input-group">
                        <span className="input-group-text bg-light border-0 text-muted">
                          @
                        </span>
                        <input
                          type="text"
                          className="form-control bg-light border-0 py-2.5"
                          placeholder="username-kamu"
                          value={github}
                          onChange={(e) => setGithub(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold text-muted">
                        Bidang yang Ditekunin
                      </label>
                      <select
                        className="form-select bg-light border-0 py-2.5"
                        value={bidang}
                        onChange={(e) => setBidang(e.target.value)}
                        required
                      >
                        <option value="">-- Pilih Bidang --</option>
                        <option value="Frontend Developer">
                          Frontend Developer
                        </option>
                        <option value="Backend Developer">
                          Backend Developer
                        </option>
                        <option value="Fullstack Developer">
                          Fullstack Developer
                        </option>
                        <option value="UI/UX Designer">UI/UX Designer</option>
                        <option value="IoT Engineer">IoT Engineer</option>
                        <option value="Mobile Developer">
                          Mobile Developer
                        </option>
                        <option value="Data Analyst">Data Analyst</option>
                      </select>
                    </div>
                  </div>
                </>
              )}

              <div className="mb-3">
                <label className="form-label small fw-semibold text-muted">
                  Email Student
                </label>
                <input
                  type="email"
                  className="form-control bg-light border-0 py-2.5"
                  placeholder="nama@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold text-muted">
                  {isRegister ? "Buat Password Baru" : "Password Security"}
                </label>
                <input
                  type="password"
                  className="form-control bg-light border-0 py-2.5"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {isRegister && (
                <div className="mb-4">
                  <label className="form-label small fw-semibold text-muted">
                    Ulangi Password Baru
                  </label>
                  <input
                    type="password"
                    className="form-control bg-light border-0 py-2.5"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              )}

              <button
                type="submit"
                className="btn btn-info w-100 py-2.5 fw-bold text-dark shadow-sm mb-3"
              >
                {isRegister
                  ? "Daftar & Tampilkan di About"
                  : "Verifikasi Masuk"}
              </button>

              <div className="text-center">
                <button
                  type="button"
                  className="btn btn-link text-decoration-none small text-muted"
                  onClick={handleToggleMode}
                >
                  {isRegister
                    ? "Sudah terdata? Silakan Login"
                    : "Mahasiswa Baru? Klik untuk Melengkapi Data Kelas"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
