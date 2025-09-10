import { useState } from "react";
import { useNavigate } from "react-router-dom";

function TambahTamu() {
  const navigate = useNavigate();
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
    keterangan: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Submit to backend
    console.log("Form data:", formData);
    alert("Data tamu berhasil disimpan!");
    navigate("/buku-tamu");
  };

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Tambah Data Tamu</h1>
          <p className="text-gray-600">
            Isi form untuk menambah data tamu baru
          </p>
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
              <input
                type="text"
                name="keperluan"
                value={formData.keperluan}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Tujuan kunjungan"
              />
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
              <select
                name="divisi"
                value={formData.divisi}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Pilih Divisi</option>
                <option value="IT">IT</option>
                <option value="HR">HR</option>
                <option value="Finance">Finance</option>
                <option value="Operations">Operations</option>
                <option value="Marketing">Marketing</option>
              </select>
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
                <option value="">Pilih Jenis Kartu</option>
                <option value="KTP">KTP</option>
                <option value="SIM">SIM</option>
                <option value="Paspor">Paspor</option>
                <option value="Kartu Pegawai">Kartu Pegawai</option>
                <option value="Lainnya">Lainnya</option>
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
                <option value="">Pilih Kategori</option>
                <option value="Tamu Umum">Tamu Umum</option>
                <option value="Vendor">Vendor</option>
                <option value="Internal">Internal</option>
                <option value="Lainnya">Lainnya</option>
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
                            // Fallback ke file input jika kamera tidak tersedia
                            const input = document.createElement("input");
                            input.type = "file";
                            input.accept = "image/*";
                            input.capture = "environment";
                            input.onchange = (e) => {
                              const file = e.target.files[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onload = (e) => {
                                  setFormData((prev) => ({
                                    ...prev,
                                    fotoKartuIdentitas: e.target.result,
                                  }));
                                };
                                reader.readAsDataURL(file);
                              }
                            };
                            input.click();
                          }
                        } catch (error) {
                          console.error("Error accessing camera:", error);
                          // Fallback ke file input
                          const input = document.createElement("input");
                          input.type = "file";
                          input.accept = "image/*";
                          input.onchange = (e) => {
                            const file = e.target.files[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (e) => {
                                setFormData((prev) => ({
                                  ...prev,
                                  fotoKartuIdentitas: e.target.result,
                                }));
                              };
                              reader.readAsDataURL(file);
                            }
                          };
                          input.click();
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
                        className="w-40 h-40 object-cover rounded-md border-2 border-gray-200"
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Foto Tamu *
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

                            // Event listeners
                            modal.querySelector("#capture-btn").onclick =
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
                                  fotoTamu: dataURL,
                                }));

                                // Stop camera dan hapus modal
                                stream
                                  .getTracks()
                                  .forEach((track) => track.stop());
                                document.body.removeChild(modal);
                              };

                            modal.querySelector("#cancel-btn").onclick = () => {
                              stream
                                .getTracks()
                                .forEach((track) => track.stop());
                              document.body.removeChild(modal);
                            };
                          } else {
                            // Fallback ke file input jika kamera tidak tersedia
                            const input = document.createElement("input");
                            input.type = "file";
                            input.accept = "image/*";
                            input.capture = "environment";
                            input.onchange = (e) => {
                              const file = e.target.files[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onload = (e) => {
                                  setFormData((prev) => ({
                                    ...prev,
                                    fotoTamu: e.target.result,
                                  }));
                                };
                                reader.readAsDataURL(file);
                              }
                            };
                            input.click();
                          }
                        } catch (error) {
                          console.error("Error accessing camera:", error);
                          // Fallback ke file input
                          const input = document.createElement("input");
                          input.type = "file";
                          input.accept = "image/*";
                          input.onchange = (e) => {
                            const file = e.target.files[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (e) => {
                                setFormData((prev) => ({
                                  ...prev,
                                  fotoTamu: e.target.result,
                                }));
                              };
                              reader.readAsDataURL(file);
                            }
                          };
                          input.click();
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
                        className="w-40 h-40 object-cover rounded-md border-2 border-gray-200"
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
            </div>
          </div>

          {/* Section Waktu dan Status */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              Informasi Waktu & Status
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
                  <option value="">Pilih Status</option>
                  <option value="Masuk">Masuk</option>
                  <option value="Keluar">Keluar</option>
                  <option value="Pending">Pending</option>
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
                Simpan Data Tamu
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TambahTamu;
