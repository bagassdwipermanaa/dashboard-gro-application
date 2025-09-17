import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function EditTamu() {
  const navigate = useNavigate();
  const location = useLocation();
  const { data } = location.state || {};

  const [formData, setFormData] = useState({
    nama: "",
    instansi: "",
    keperluan: "",
    tujuan: "",
    divisi: "",
    jenisKartu: "",
    kategoriTamu: "",
    waktuBerkunjung: "",
    waktuKeluar: "",
    noIdTamu: "",
    fotoTamu: "",
    fotoKartuIdentitas: "",
    statusTamu: "",
    status: "",
    keterangan: "",
  });
  const [imagePreview, setImagePreview] = useState(null);

  // Load data from location state
  useEffect(() => {
    if (data) {
      setFormData(data);
    } else {
      // If no data, redirect back
      navigate("/buku-tamu");
    }
  }, [data, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const idvisit = data?.idvisit || formData?.idvisit;
      if (!idvisit) throw new Error("ID kunjungan tidak ditemukan");
      const payload = { ...formData, idvisit };
      const res = await fetch(`/api/tamu/${encodeURIComponent(idvisit)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || `Gagal update (HTTP ${res.status})`);
      }
      alert("Data tamu berhasil diperbarui!");
      navigate("/buku-tamu");
    } catch (err) {
      console.error("Update tamu gagal:", err);
      alert(`Gagal memperbarui data: ${err.message}`);
    }
  };

  if (!data) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Data tidak ditemukan
          </h2>
          <p className="text-gray-600 mb-4">
            Data tamu yang akan diedit tidak ditemukan.
          </p>
          <button
            onClick={() => navigate("/buku-tamu")}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Kembali ke Buku Tamu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Edit Data Tamu</h1>
          <p className="text-gray-600">Perbarui data tamu yang sudah ada</p>
        </div>
        <button
          onClick={() => navigate("/buku-tamu")}
          className="px-4 py-2 text-sm border rounded-md hover:bg-gray-50"
        >
          ← Kembali
        </button>
      </header>

      <div className="bg-white rounded-xl border shadow-sm">
        <form onSubmit={handleSubmit} className="p-8">
          {/* Foto Tamu di bagian paling atas */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Foto Tamu *
            </label>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      if (!window.isSecureContext) {
                        alert(
                          "Akses kamera memerlukan koneksi HTTPS. Buka aplikasi melalui HTTPS lalu ulangi."
                        );
                        return;
                      }

                      if (
                        navigator.mediaDevices &&
                        navigator.mediaDevices.getUserMedia
                      ) {
                        const stream =
                          await navigator.mediaDevices.getUserMedia({
                            video: { facingMode: "environment" },
                          });

                        const video = document.createElement("video");
                        video.srcObject = stream;
                        video.play();

                        const canvas = document.createElement("canvas");
                        const ctx = canvas.getContext("2d");

                        const modal = document.createElement("div");
                        modal.className =
                          "fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50";
                        modal.innerHTML = `
                              <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                                <div class="text-center mb-4">
                                  <h3 class="text-lg font-semibold">Ambil Foto</h3>
                                  <p class="text-sm text-gray-600">Posisikan kamera dan klik 'Ambil'</p>
                                </div>
                                <div class="mb-4">
                                  <video id="camera-preview" class="w-full h-64 bg-gray-200 rounded-lg object-cover"></video>
                                </div>
                                <div class="flex gap-3">
                                  <button id="capture-btn" class="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700">
                                    Ambil
                                  </button>
                                  <button id="cancel-btn" class="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400">
                                    Batal
                                  </button>
                                </div>
                              </div>
                            `;

                        document.body.appendChild(modal);
                        const videoElement =
                          modal.querySelector("#camera-preview");
                        videoElement.srcObject = stream;
                        videoElement.play();

                        modal.querySelector("#capture-btn").onclick = () => {
                          canvas.width = videoElement.videoWidth;
                          canvas.height = videoElement.videoHeight;
                          ctx.drawImage(videoElement, 0, 0);

                          const dataURL = canvas.toDataURL("image/jpeg", 0.8);
                          setFormData((prev) => ({
                            ...prev,
                            fotoTamu: dataURL,
                          }));

                          stream.getTracks().forEach((track) => track.stop());
                          document.body.removeChild(modal);
                        };

                        modal.querySelector("#cancel-btn").onclick = () => {
                          stream.getTracks().forEach((track) => track.stop());
                          document.body.removeChild(modal);
                        };
                      } else {
                        alert(
                          "Perangkat/browser tidak mendukung akses kamera. Coba perangkat atau browser lain."
                        );
                      }
                    } catch (error) {
                      console.error("Error accessing camera:", error);
                      alert(
                        "Gagal mengakses kamera. Pastikan izin kamera diberikan dan menggunakan koneksi HTTPS."
                      );
                    }
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  Ambil Foto
                </button>
                {formData.fotoTamu && (
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, fotoTamu: "" }))
                    }
                    className="px-3 py-2 text-sm text-red-600 border border-red-300 rounded-md hover:bg-red-50"
                  >
                    Hapus
                  </button>
                )}
              </div>
              {formData.fotoTamu ? (
                <div className="mt-2">
                  <img
                    src={formData.fotoTamu}
                    alt="Preview Foto Tamu"
                    className="w-40 h-40 object-cover rounded-md border-2 border-gray-200 cursor-zoom-in"
                    onClick={() => setImagePreview(formData.fotoTamu)}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Foto berhasil diambil
                  </p>
                </div>
              ) : (
                <div className="w-40 h-40 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center">
                  <div className="text-center">
                    <svg
                      className="w-8 h-8 text-gray-400 mx-auto mb-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <p className="text-xs text-gray-500">Belum ada foto</p>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nama Lengkap *
              </label>
              <input
                type="text"
                name="nama"
                value={formData.nama}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Masukkan nama lengkap"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Instansi *
              </label>
              <input
                type="text"
                name="instansi"
                value={formData.instansi}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nama instansi/perusahaan"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Keperluan *
              </label>
              <select
                name="keperluan"
                value={formData.keperluan}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Pilih Keperluan</option>
                <option value="Dinas">Dinas</option>
                <option value="Pribadi">Pribadi</option>
                <option value="Meeting">Meeting</option>
                <option value="Penawaran Jasa/Produk">
                  Penawaran Jasa/Produk
                </option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tujuan *
              </label>
              <input
                type="text"
                name="tujuan"
                value={formData.tujuan}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Lokasi yang akan dikunjungi"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Divisi *
              </label>
              <input
                type="text"
                name="divisi"
                value={formData.divisi}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nama divisi yang dikunjungi"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Jenis Kartu Identitas *
              </label>
              <select
                name="jenisKartu"
                value={formData.jenisKartu}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Pilih Jenis ID</option>
                <option value="ID PLN">ID PLN</option>
                <option value="ID KANTOR">ID KANTOR</option>
                <option value="KTP">KTP</option>
                <option value="KTP ASING">KTP ASING</option>
                <option value="SIM">SIM</option>
                <option value="Paspor">Paspor</option>
                <option value="Kartu Pelajar">Kartu Pelajar</option>
                <option value="KTA Polisi/TNI">KTA Polisi/TNI</option>
                <option value="KITAS">KITAS</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kategori Tamu *
              </label>
              <select
                name="kategoriTamu"
                value={formData.kategoriTamu}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Pilih Kategori Tamu</option>
                <option value="VIP">VIP</option>
                <option value="Class 1">Class 1</option>
                <option value="Class 2">Class 2</option>
                <option value="Class 3">Class 3</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                No. ID Tamu
              </label>
              <input
                type="text"
                name="noIdTamu"
                value={formData.noIdTamu}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nomor ID tamu (opsional)"
              />
            </div>
          </div>

          {/* Section Dokumentasi */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              Dokumentasi
            </h3>
            <div className="grid grid-cols-1 gap-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Foto Kartu Identitas *
                </label>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={async () => {
                        try {
                          // Cek apakah device support camera
                          if (
                            navigator.mediaDevices &&
                            navigator.mediaDevices.getUserMedia
                          ) {
                            // Buka kamera langsung
                            const stream =
                              await navigator.mediaDevices.getUserMedia({
                                video: {
                                  facingMode: "environment", // Kamera belakang di mobile
                                },
                              });

                            // Buat video element untuk preview
                            const video = document.createElement("video");
                            video.srcObject = stream;
                            video.play();

                            // Buat canvas untuk capture
                            const canvas = document.createElement("canvas");
                            const ctx = canvas.getContext("2d");

                            // Buat modal untuk kamera
                            const modal = document.createElement("div");
                            modal.className =
                              "fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50";
                            modal.innerHTML = `
                              <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                                <div class="text-center mb-4">
                                  <h3 class="text-lg font-semibold">Ambil Foto Kartu Identitas</h3>
                                  <p class="text-sm text-gray-600">Posisikan kartu identitas dan klik 'Ambil'</p>
                                </div>
                                <div class="mb-4">
                                  <video id="camera-preview-kartu" class="w-full h-64 bg-gray-200 rounded-lg object-cover"></video>
                                </div>
                                <div class="flex gap-3">
                                  <button id="capture-btn-kartu" class="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700">
                                    Ambil
                                  </button>
                                  <button id="cancel-btn-kartu" class="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400">
                                    Batal
                                  </button>
                                </div>
                              </div>
                            `;

                            document.body.appendChild(modal);
                            const videoElement = modal.querySelector(
                              "#camera-preview-kartu"
                            );
                            videoElement.srcObject = stream;
                            videoElement.play();

                            // Event listeners
                            modal.querySelector("#capture-btn-kartu").onclick =
                              () => {
                                canvas.width = videoElement.videoWidth;
                                canvas.height = videoElement.videoHeight;
                                ctx.drawImage(videoElement, 0, 0);

                                const dataURL = canvas.toDataURL(
                                  "image/jpeg",
                                  0.8
                                );
                                setFormData((prev) => ({
                                  ...prev,
                                  fotoKartuIdentitas: dataURL,
                                }));

                                // Stop camera dan hapus modal
                                stream
                                  .getTracks()
                                  .forEach((track) => track.stop());
                                document.body.removeChild(modal);
                              };

                            modal.querySelector("#cancel-btn-kartu").onclick =
                              () => {
                                stream
                                  .getTracks()
                                  .forEach((track) => track.stop());
                                document.body.removeChild(modal);
                              };
                          } else {
                            alert(
                              "Perangkat/browser tidak mendukung akses kamera. Coba perangkat atau browser lain."
                            );
                          }
                        } catch (error) {
                          console.error("Error accessing camera:", error);
                          alert(
                            "Gagal mengakses kamera. Pastikan izin kamera diberikan dan menggunakan koneksi HTTPS."
                          );
                        }
                      }}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      Ambil Foto Kartu
                    </button>
                    {formData.fotoKartuIdentitas && (
                      <button
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            fotoKartuIdentitas: "",
                          }))
                        }
                        className="px-3 py-2 text-sm text-red-600 border border-red-300 rounded-md hover:bg-red-50"
                      >
                        Hapus
                      </button>
                    )}
                  </div>
                  {formData.fotoKartuIdentitas ? (
                    <div className="mt-2">
                      <img
                        src={formData.fotoKartuIdentitas}
                        alt="Preview Foto Kartu Identitas"
                        className="w-40 h-40 object-cover rounded-md border-2 border-gray-200 cursor-zoom-in"
                        onClick={() =>
                          setImagePreview(formData.fotoKartuIdentitas)
                        }
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Foto kartu identitas berhasil diambil
                      </p>
                    </div>
                  ) : (
                    <div className="w-40 h-40 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center">
                      <div className="text-center">
                        <svg
                          className="w-8 h-8 text-gray-400 mx-auto mb-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        <p className="text-xs text-gray-500">
                          Belum ada foto kartu
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Image Lightbox */}
          {imagePreview ? (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              <div
                className="absolute inset-0 bg-black/80"
                onClick={() => setImagePreview(null)}
              />
              <div className="relative max-w-[90vw] max-h-[90vh]">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-auto h-auto max-w-[90vw] max-h-[90vh] object-contain rounded-lg shadow-2xl"
                />
                <button
                  onClick={() => setImagePreview(null)}
                  className="absolute -top-3 -right-3 bg-white text-gray-700 rounded-full p-2 shadow hover:bg-gray-100"
                  aria-label="Tutup"
                >
                  ✕
                </button>
              </div>
            </div>
          ) : null}

          {/* Section Waktu dan Status */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              Informasi Waktu & Status
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Waktu Berkunjung *
                </label>
                <input
                  type="datetime-local"
                  name="waktuBerkunjung"
                  value={formData.waktuBerkunjung}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Waktu Keluar
                </label>
                <input
                  type="datetime-local"
                  name="waktuKeluar"
                  value={formData.waktuKeluar}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status Tamu *
                </label>
                <select
                  name="statusTamu"
                  value={formData.statusTamu}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Pilih Status Tamu</option>
                  <option value="Open">Open</option>
                  <option value="Entry">Entry</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status *
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Pilih Status</option>
                  <option value="Clear">Clear</option>
                  <option value="Warning">Warning</option>
                  <option value="Attention">Attention</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section Keterangan */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              Catatan Tambahan
            </h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Keterangan
              </label>
              <textarea
                name="keterangan"
                value={formData.keterangan}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Catatan tambahan (opsional)"
              />
            </div>
          </div>

          {/* Section Tombol Submit */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-end gap-4">
              <button
                type="button"
                onClick={() => navigate("/buku-tamu")}
                className="px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-8 py-3 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                Update Data Tamu
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditTamu;
