import { useState } from "react";

function BukuTamu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="space-y-5">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold">Data Tamu</h1>
          <p className="text-sm text-gray-600">
            Kelola buku tamu dan riwayat kunjungan
          </p>
        </div>
        <button
          onClick={() => setIsOpen(true)}
          className="inline-flex items-center gap-2 rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white hover:bg-gray-800"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-4 w-4"
          >
            <path d="M12 5.25a.75.75 0 01.75.75v5.25H18a.75.75 0 010 1.5h-5.25V18a.75.75 0 01-1.5 0v-5.25H6a.75.75 0 010-1.5h5.25V6a.75.75 0 01.75-.75z" />
          </svg>
          Tambah
        </button>
      </header>

      <div className="rounded-xl border bg-white overflow-hidden">
        <div className="px-4 py-3 border-b flex items-center justify-between">
          <div className="text-sm text-gray-600">Filter cepat</div>
          <div className="text-xs text-gray-400">0 hasil</div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                {[
                  "#",
                  "Nama",
                  "Instansi",
                  "Keperluan",
                  "Tujuan",
                  "Divisi",
                  "Jenis Kartu Identitas",
                  "Kategori Tamu",
                  "Waktu Berkunjung",
                  "Waktu Keluar",
                  "No. ID Tamu",
                  "Status Tamu",
                  "Keterangan",
                  "Actions",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-3 py-2 font-medium text-left whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td
                  colSpan={14}
                  className="px-3 py-10 text-center text-gray-500"
                >
                  No results found.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {isOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setIsOpen(false)}
          />
          <div className="relative w-full max-w-2xl rounded-xl border bg-white shadow-lg">
            <div className="px-5 py-4 border-b flex items-center justify-between">
              <h3 className="font-semibold">Tambah Data Tamu</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setIsOpen(false);
              }}
              className="px-5 py-5 grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <div>
                <label className="block text-xs text-gray-600 mb-1">Nama</label>
                <input
                  className="w-full rounded-md border px-3 py-2"
                  placeholder="Nama lengkap"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  Instansi
                </label>
                <input
                  className="w-full rounded-md border px-3 py-2"
                  placeholder="Nama instansi"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  Keperluan
                </label>
                <input
                  className="w-full rounded-md border px-3 py-2"
                  placeholder="Keperluan"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  Tujuan
                </label>
                <input
                  className="w-full rounded-md border px-3 py-2"
                  placeholder="Tujuan"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  Divisi
                </label>
                <input
                  className="w-full rounded-md border px-3 py-2"
                  placeholder="Divisi"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  Kategori Tamu
                </label>
                <select className="w-full rounded-md border px-3 py-2">
                  <option>Tamu Umum</option>
                  <option>Vendor</option>
                  <option>Internal</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  Waktu Berkunjung
                </label>
                <input
                  type="datetime-local"
                  className="w-full rounded-md border px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  Waktu Keluar
                </label>
                <input
                  type="datetime-local"
                  className="w-full rounded-md border px-3 py-2"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs text-gray-600 mb-1">
                  Keterangan
                </label>
                <textarea
                  className="w-full rounded-md border px-3 py-2"
                  rows={3}
                />
              </div>
              <div className="md:col-span-2 flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-3 py-2 text-sm rounded-md border hover:bg-gray-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-3 py-2 text-sm rounded-md bg-gray-900 text-white hover:bg-gray-800"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default BukuTamu;
