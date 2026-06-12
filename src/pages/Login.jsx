// src/pages/Login.jsx
import React, { useState } from "react";
import { toast } from "react-toastify";

export default function Login({ setRole, setSessionUser, setCurrentPage }) {
  const [isRegister, setIsRegister] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // State lengkap yang tadi sempat hilang karena komentar
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [github, setGithub] = useState("");
  const [bidang, setBidang] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isRegister && password !== confirmPassword) {
      return toast.error("Konfirmasi password tidak cocok!");
    }

    setIsLoading(true);

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

      if (!respon.ok) {
        return toast.error(data.pesan || data.error || "Terjadi kesalahan!");
      }

      if (isRegister) {
        toast.success(data.pesan || "Registrasi berhasil!");
        setIsRegister(false);
        setNama("");
        setConfirmPassword("");
        setPassword("");
        setGithub("");
        setBidang("");
      } else {
        const userLogin = data.user || data.data || data;
        const roleUser = userLogin.role || "student";

        toast.success(`Selamat Datang, ${userLogin.nama || "User"}!`);

        setRole(roleUser);
        setSessionUser(userLogin);
        localStorage.setItem("user_role", roleUser);
        localStorage.setItem("user_session", JSON.stringify(userLogin));
        setCurrentPage("home");
      }
    } catch (error) {
      toast.error("Gagal terhubung ke server!");
    } finally {
      setIsLoading(false);
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
                      placeholder="Nama lengkap"
                      value={nama}
                      onChange={(e) => setNama(e.target.value)}
                      required
                    />
                  </div>
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold text-muted">
                        GitHub
                      </label>
                      <input
                        type="text"
                        className="form-control bg-light border-0 py-2.5"
                        placeholder="username"
                        value={github}
                        onChange={(e) => setGithub(e.target.value)}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold text-muted">
                        Bidang
                      </label>
                      <select
                        className="form-select bg-light border-0 py-2.5"
                        value={bidang}
                        onChange={(e) => setBidang(e.target.value)}
                        required
                      >
                        <option value="">-- Pilih --</option>
                        <option value="Frontend Developer">
                          Frontend Developer
                        </option>
                        <option value="Backend Developer">
                          Backend Developer
                        </option>
                      </select>
                    </div>
                  </div>
                </>
              )}

              <div className="mb-3">
                <label className="form-label small fw-semibold text-muted">
                  Email
                </label>
                <input
                  type="email"
                  className="form-control bg-light border-0 py-2.5"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold text-muted">
                  Password
                </label>
                <input
                  type="password"
                  className="form-control bg-light border-0 py-2.5"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {isRegister && (
                <div className="mb-4">
                  <label className="form-label small fw-semibold text-muted">
                    Ulangi Password
                  </label>
                  <input
                    type="password"
                    className="form-control bg-light border-0 py-2.5"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              )}

              <button
                type="submit"
                className="btn btn-info w-100 py-2.5 fw-bold text-dark shadow-sm mb-3"
                disabled={isLoading}
              >
                {isLoading
                  ? "Memproses..."
                  : isRegister
                    ? "Daftar"
                    : "Verifikasi Masuk"}
              </button>

              <div className="text-center">
                <button
                  type="button"
                  className="btn btn-link text-decoration-none small text-muted"
                  onClick={handleToggleMode}
                >
                  {isRegister
                    ? "Sudah terdata? Login"
                    : "Belum punya akun? Registrasi"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
