import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function EditBukuTeleponTamu() {
  const navigate = useNavigate();
  const location = useLocation();
  const data = location.state?.data;

  const [formData, setFormData] = useState({
    nama: "",
    instansi: "",
    noTlp1: "",
    noTlp2: "",
    alamat: "",
    fax: "",
    email: "",
  });

  useEffect(() => {
    if (data) {
      setFormData({
        nama: data.nama || "",
        instansi: data.instansi || "",
        noTlp1: data.noTlp1 || "",
        noTlp2: data.noTlp2 || "",
        alamat: data.alamat || "",
        fax: data.fax || "",
        email: data.email || "",
      });
    }
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Get existing data
    const existingData = JSON.parse(
      localStorage.getItem("dataTeleponTamu") || "[]"
    );

    // Update the specific data
    const updatedData = existingData.map((item) =>
      item.id === data.id
        ? { ...item, ...formData, updatedAt: new Date().toISOString() }
        : item
    );

    // Save to localStorage
    localStorage.setItem("dataTeleponTamu", JSON.stringify(updatedData));

    // Navigate back to list page
    navigate("/list");
  };

  const handleCancel = () => {
    navigate("/list");
  };

  if (!data) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Data Tidak Ditemukan
          </h1>
          <p className="text-gray-600 mb-6">
            Data buku telepon tamu yang akan diedit tidak ditemukan.
          </p>
          <button
            onClick={() => navigate("/list")}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Kembali ke List
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Edit Buku Telepon Tamu</h1>
          <p className="text-gray-600">Edit kontak tamu</p>
        </div>
        <button
          onClick={handleCancel}
          className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Kembali
        </button>
      </header>

      <div className="bg-white rounded-xl border p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informasi Kontak */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
              📞 Informasi Kontak
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nama <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="nama"
                  value={formData.nama}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Masukkan nama lengkap"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Instansi
                </label>
                <input
                  type="text"
                  name="instansi"
                  value={formData.instansi}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Masukkan nama instansi"
                />
              </div>
            </div>
          </div>

          {/* Informasi Telepon */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
              📱 Informasi Telepon
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  No.Tlp 1 <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="noTlp1"
                  value={formData.noTlp1}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Masukkan nomor telepon utama"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  No.Tlp 2
                </label>
                <input
                  type="tel"
                  name="noTlp2"
                  value={formData.noTlp2}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Masukkan nomor telepon alternatif"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fax
                </label>
                <input
                  type="tel"
                  name="fax"
                  value={formData.fax}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Masukkan nomor fax"
                />
              </div>
            </div>
          </div>

          {/* Informasi Alamat dan Email */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
              📍 Alamat dan Email
            </h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Alamat
                </label>
                <textarea
                  name="alamat"
                  value={formData.alamat}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Masukkan alamat lengkap"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Masukkan alamat email"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-4 pt-6 border-t">
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-2.5 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Update Data
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditBukuTeleponTamu;