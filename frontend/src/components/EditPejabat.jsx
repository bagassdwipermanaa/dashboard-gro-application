import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function EditPejabat() {
  const navigate = useNavigate();
  const location = useLocation();
  const { pejabatData } = location.state || {};

  const [formData, setFormData] = useState({
    nama: "",
    gedung: "",
    ruang: "",
    divisi: "",
    bidang: "",
    level: "",
    foto: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (pejabatData) {
      setFormData({
        nama: pejabatData.nama || "",
        gedung: pejabatData.gedung || "",
        ruang: pejabatData.ruang || "",
        divisi: pejabatData.divisi || "",
        bidang: pejabatData.bidang || "",
        level: pejabatData.level || "",
        foto: pejabatData.foto || "",
      });
    }
  }, [pejabatData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(
        `http://localhost:8004/api/jabatan/${pejabatData.idjabatan}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        alert("Data pejabat berhasil diperbarui!");
        navigate("/daftar-pejabat");
      } else {
        const errorData = await response.json();
        alert(`Gagal memperbarui data: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Gagal memperbarui data pejabat");
    } finally {
      setLoading(false);
    }
  };

  if (!pejabatData) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Edit Data Pejabat</h1>
          <p className="text-gray-600">Data pejabat tidak ditemukan.</p>
        </div>
        <div className="bg-white rounded-xl border p-6">
          <p className="text-gray-500">
            Silakan kembali ke halaman daftar pejabat.
          </p>
          <button
            onClick={() => navigate("/daftar-pejabat")}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Kembali
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Edit Data Pejabat</h1>
        <p className="text-gray-600">Edit data pejabat yang sudah ada.</p>
      </div>

      <div className="bg-white rounded-xl border p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nama *
              </label>
              <input
                type="text"
                name="nama"
                value={formData.nama}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Masukkan nama pejabat"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Divisi
              </label>
              <input
                type="text"
                name="divisi"
                value={formData.divisi}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Masukkan divisi"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bidang
              </label>
              <input
                type="text"
                name="bidang"
                value={formData.bidang}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Masukkan bidang"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Level
              </label>
              <input
                type="text"
                name="level"
                value={formData.level}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Masukkan level"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gedung
              </label>
              <input
                type="text"
                name="gedung"
                value={formData.gedung}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Masukkan gedung"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ruang
              </label>
              <input
                type="text"
                name="ruang"
                value={formData.ruang}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Masukkan ruang"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Foto (URL)
            </label>
            <input
              type="url"
              name="foto"
              value={formData.foto}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Masukkan URL foto"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/daftar-pejabat")}
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
            >
              Batal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditPejabat;
