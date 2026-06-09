// src/components/Footer.jsx
import React from "react";

export default function Footer() {
  // Data media sosial untuk memudahkan pengelolaan link
  const socialLinks = [
    {
      icon: "bi-instagram",
      url: "https://instagram.com/formidable.informatics",
      label: "Instagram",
    },
    {
      icon: "bi-facebook",
      url: "https://facebook.com/formidable",
      label: "Facebook",
    },
    {
      icon: "bi-tiktok",
      url: "https://tiktok.com/@aliiii3944",
      label: "TikTok",
    },
    {
      icon: "bi-linkedin",
      url: "https://linkedin.com/in/formidable",
      label: "LinkedIn",
    },
    {
      icon: "bi-github",
      url: "https://github.com/formidable",
      label: "GitHub",
    },
  ];

  return (
    <footer className="bg-formidable-navy text-white py-5 mt-auto border-top border-secondary border-opacity-10">
      <div className="container">
        <div className="row align-items-center gy-4">
          {/* Kolon Kiri: Nama Brand & Deskripsi Singkat */}
          <div className="col-md-6 text-center text-md-start">
            <h5 className="fw-bold mb-2 tracking-wider text-info">
              <i className="bi bi-shield-check me-2"></i>FORMIDABLE
            </h5>
            <p
              className="text-white-50 small mb-0"
              style={{ maxWidth: "380px" }}
            >
              Wadah kolaborasi digital mahasiswa Informatika. Menghubungkan
              kreativitas, teknologi, dan solidaritas.
            </p>
          </div>

          {/* Kolon Kanan: Ikon Media Sosial dengan Efek Hover */}
          <div className="col-md-6 text-center text-md-end">
            <p className="text-white-50 small mb-2 d-none d-md-block">
              Connect with us:
            </p>
            <div className="d-flex justify-content-center justify-content-md-end gap-3">
              {socialLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline-light rounded-circle d-flex align-items-center justify-content-center"
                  style={{
                    width: "40px",
                    height: "40px",
                    transition: "all 0.3s ease",
                  }}
                  title={link.label}
                  // Efek interaktif bootstrap kustom lewat inline style sederhana
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#0dcaf0"; // Warna info Bootstrap
                    e.currentTarget.style.borderColor = "#0dcaf0";
                    e.currentTarget.style.color = "#0a192f";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.borderColor = "#f8f9fa";
                    e.currentTarget.style.color = "#f8f9fa";
                  }}
                >
                  <i className={`bi ${link.icon} fs-5`}></i>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Garis Pembatas Halus */}
        <hr className="my-4 text-white-50 opacity-25" />

        {/* Hak Cipta */}
        <div className="text-center">
          <p className="text-white-50 small mb-0">
            &copy; 2026{" "}
            <span className="text-info fw-bold">Formidable Class</span>. All
            Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
