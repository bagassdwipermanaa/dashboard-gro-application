import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function EditNotes() {
  const navigate = useNavigate();
  const location = useLocation();
  const noteData = location.state?.data;

  const [formData, setFormData] = useState({
    dari: "",
    tujuan: "",
    tanggal: "",
    pesan: "",
    status: "Open",
  });

  useEffect(() => {
    if (noteData) {
      setFormData({
        dari: noteData.dari || "",
        tujuan: noteData.tujuan || "",
        tanggal: noteData.tanggal || "",
        pesan: noteData.pesan || "",
        status: noteData.status || "Open",
      });
    }
  }, [noteData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const id = noteData?.idnotes || noteData?.id;
      if (!id) throw new Error("ID notes tidak ditemukan");
      const res = await fetch(`/api/notes/${encodeURIComponent(id)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      window.dispatchEvent(new CustomEvent("notesUpdated"));
      navigate("/notes");
    } catch (err) {
      alert(`Gagal memperbarui notes: ${err.message}`);
    }
  };

  const handleCancel = () => {
    navigate("/notes");
  };

  if (!noteData) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Data Tidak Ditemukan
          </h1>
          <p className="text-gray-600 mb-6">
            Data notes yang akan diedit tidak ditemukan.
          </p>
          <button
            onClick={() => navigate("/notes")}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Kembali ke Notes
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Edit Notes</h1>
          <p className="text-gray-600">Edit catatan</p>
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
          {/* Informasi Pengirim dan Penerima */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
              📝 Informasi Notes
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dari <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="dari"
                  value={formData.dari}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Masukkan pengirim notes"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tujuan <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="tujuan"
                  value={formData.tujuan}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Masukkan penerima notes"
                />
              </div>
            </div>
          </div>

          {/* Tanggal dan Status */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
              ⏰ Tanggal dan Status
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

          {/* Pesan */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
              💬 Pesan
            </h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pesan <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="pesan"
                  value={formData.pesan}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Masukkan isi notes"
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
              Update Notes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditNotes;
