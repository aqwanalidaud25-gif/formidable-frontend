import React from 'react';

export default function Schedule() {
  const kelasHariIni = [
    { matkul: 'Pemrograman Web Backend', jam: '08:00 - 10:30', ruang: 'Lab Komputer 2', dosen: 'Irwan, M.T.' },
    { matkul: 'Arsitektur Perangkat Lunak', jam: '11:00 - 13:00', ruang: 'Ruang Teori 4', dosen: 'Hendra, M.Kom' },
    { matkul: 'Sistem Embedded & IoT', jam: '14:00 - 16:30', ruang: 'Lab Elektronika', dosen: 'Fahmi, M.T.' }
  ];

  return (
    <div className="container my-5 py-3">
      <div className="text-center mb-5">
        <h2 className="fw-bold text-formidable-navy">Jadwal Perkuliahan</h2>
        <p className="text-muted">Daftar mata kuliah aktif semester ini</p>
      </div>

      <div className="card card-modern bg-white overflow-hidden p-3">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light text-formidable-navy fw-bold">
              <tr>
                <th className="py-3">Mata Kuliah</th>
                <th className="py-3">Waktu</th>
                <th className="py-3">Ruangan</th>
                <th className="py-3">Dosen Pengampu</th>
              </tr>
            </thead>
            <tbody>
              {kelasHariIni.map((k, index) => (
                <tr key={index}>
                  <td className="fw-bold py-3">{k.matkul}</td>
                  <td><span className="badge bg-light text-dark border"><i className="bi bi-clock me-1 text-info"></i>{k.jam}</span></td>
                  <td><i className="bi bi-geo-alt text-danger me-1"></i>{k.ruang}</td>
                  <td className="text-muted">{k.dosen}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}