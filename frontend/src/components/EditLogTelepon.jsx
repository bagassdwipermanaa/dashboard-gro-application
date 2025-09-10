import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function EditLogTelepon() {
  const navigate = useNavigate();
  const location = useLocation();
  const logData = location.state?.data;

  const [formData, setFormData] = useState({
    namaPenelpon: "",
    noPenelpon: "",
    namaDituju: "",
    noDituju: "",
    tanggal: "",
    jam: "",
    pesan: "",
    keterangan: "",
    telpKeluarMasuk: "Masuk",
    status: "Open",
  });

  useEffect(() => {
    if (logData) {
      setFormData({
        namaPenelpon: logData.namaPenelpon || "",
        noPenelpon: logData.noPenelpon || "",
        namaDituju: logData.namaDituju || "",
        noDituju: logData.noDituju || "",
        tanggal: logData.tanggal || "",
        jam: logData.jam || "",
        pesan: logData.pesan || "",
        keterangan: logData.keterangan || "",
        telpKeluarMasuk: logData.telpKeluarMasuk || "Masuk",
        status: logData.status || "Open",
      });
    }
  }, [logData]);

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
      localStorage.getItem("dataLogTelepon") || "[]"
    );

    // Update the specific log
    const updatedData = existingData.map((log) =>
      log.id === logData.id
        ? { ...log, ...formData, updatedAt: new Date().toISOString() }
        : log
    );

    // Save to localStorage
    localStorage.setItem("dataLogTelepon", JSON.stringify(updatedData));

    // Navigate back to log telepon page
    navigate("/log-telepon");
  };

  const handleCancel = () => {
    navigate("/log-telepon");
  };

  if (!logData) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Data Tidak Ditemukan
          </h1>
          <p className="text-gray-600 mb-6">
            Data log telepon yang akan diedit tidak ditemukan.
          </p>
          <button
            onClick={() => navigate("/log-telepon")}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Kembali ke Log Telepon
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Edit Log Telepon</h1>
          <p className="text-gray-600">Edit data log telepon</p>
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
          {/* Informasi Penelpon */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
              📞 Informasi Penelpon
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nama Penelpon <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="namaPenelpon"
                  value={formData.namaPenelpon}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Masukkan nama penelpon"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  No Penelpon <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="noPenelpon"
                  value={formData.noPenelpon}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Masukkan nomor telepon"
                />
              </div>
            </div>
          </div>

          {/* Informasi Dituju */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
              🎯 Informasi Dituju
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nama Dituju <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="namaDituju"
                  value={formData.namaDituju}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Masukkan nama yang dituju"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  No Dituju <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="noDituju"
                  value={formData.noDituju}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Masukkan nomor yang dituju"
                />
              </div>
            </div>
          </div>

          {/* Waktu dan Status */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
              ⏰ Waktu dan Status
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tanggal <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="tanggal"
                  value={formData.tanggal}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Jam <span className="text-red-500">*</span>
                </label>
                <input
                  type="time"
                  name="jam"
                  value={formData.jam}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Telp. Keluar/Masuk <span className="text-red-500">*</span>
                </label>
                <select
                  name="telpKeluarMasuk"
                  value={formData.telpKeluarMasuk}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Masuk">Masuk</option>
                  <option value="Keluar">Keluar</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status <span className="text-red-500">*</span>
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Open">Open</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>
            </div>
          </div>

          {/* Pesan dan Keterangan */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
              💬 Pesan dan Keterangan
            </h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pesan
                </label>
                <textarea
                  name="pesan"
                  value={formData.pesan}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Masukkan pesan atau isi percakapan"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Keterangan
                </label>
                <textarea
                  name="keterangan"
                  value={formData.keterangan}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Masukkan keterangan tambahan"
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
              Update Log Telepon
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditLogTelepon;
