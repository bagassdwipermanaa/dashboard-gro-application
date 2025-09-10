import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DeleteModal from "./DeleteModal";
import Pagination from "./Pagination";

function BukuTamu() {
  const formatDateTime = (value) => {
    if (!value) return "-";
    const date = new Date(value.replace(" ", "T"));
    if (Number.isNaN(date.getTime())) return value;
    return `${String(date.getDate()).padStart(2, "0")}/${String(
      date.getMonth() + 1
    ).padStart(2, "0")}/${date.getFullYear()} ${String(
      date.getHours()
    ).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
  };
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [dataTamu, setDataTamu] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedTamu, setSelectedTamu] = useState(null);
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    tamu: null,
    index: null,
  });

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [kategoriFilter, setKategoriFilter] = useState("");
  const [keperluanFilter, setKeperluanFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [divisiFilter, setDivisiFilter] = useState("");
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Load data from backend on mount
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/tamu");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const rows = await res.json();
        // Map DB rows (tabletamu) to FE fields
        const mapped = rows.map((r) => ({
          nama: r.namatamu || "",
          instansi: r.instansi || "",
          keperluan: r.keperluan || "",
          tujuan: r.tujuan || "",
          divisi: r.divisi || "",
          jenisKartu: r.jenisid || "",
          // kategoriTamu berasal dari cattamu (CLASS1/CLASS2/...) di DB
          kategoriTamu: r.cattamu || "",
          waktuBerkunjung: r.jamdatang || "",
          waktuKeluar: r.jamkeluar || "",
          noIdTamu: r.noid || "",
          fotoTamu: r.foto || "",
          fotoKartuIdentitas: r.fotoid || "",
          statusTamu: r.statustamu || "",
          status: r.status || "",
          keterangan: r.ket || r.cattamu || "",
          idvisit: r.idvisit,
        }));
        setDataTamu(mapped);
        setFilteredData(mapped);
      } catch (e) {
        console.error("Gagal memuat data tamu:", e);
      }
    };
    load();
  }, []);

  // Filter data based on all filter criteria
  useEffect(() => {
    let filtered = [...dataTamu];

    // Search term filter (searches across multiple fields)
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (tamu) =>
          tamu.nama.toLowerCase().includes(searchLower) ||
          tamu.instansi.toLowerCase().includes(searchLower) ||
          tamu.keperluan.toLowerCase().includes(searchLower) ||
          tamu.tujuan.toLowerCase().includes(searchLower) ||
          tamu.divisi.toLowerCase().includes(searchLower) ||
          tamu.jenisKartu?.toLowerCase().includes(searchLower) ||
          tamu.kategoriTamu?.toLowerCase().includes(searchLower) ||
          tamu.noIdTamu?.toLowerCase().includes(searchLower) ||
          tamu.keterangan?.toLowerCase().includes(searchLower)
      );
    }

    // Status filter
    if (statusFilter) {
      filtered = filtered.filter((tamu) => tamu.statusTamu === statusFilter);
    }

    // Kategori filter
    if (kategoriFilter) {
      filtered = filtered.filter(
        (tamu) => tamu.kategoriTamu === kategoriFilter
      );
    }

    // Keperluan filter
    if (keperluanFilter) {
      filtered = filtered.filter((tamu) => tamu.keperluan === keperluanFilter);
    }

    // Divisi filter
    if (divisiFilter) {
      filtered = filtered.filter((tamu) =>
        tamu.divisi.toLowerCase().includes(divisiFilter.toLowerCase())
      );
    }

    // Date range filter
    if (dateFrom) {
      filtered = filtered.filter((tamu) => {
        const visitDate = new Date(tamu.waktuBerkunjung)
          .toISOString()
          .split("T")[0];
        return visitDate >= dateFrom;
      });
    }

    if (dateTo) {
      filtered = filtered.filter((tamu) => {
        const visitDate = new Date(tamu.waktuBerkunjung)
          .toISOString()
          .split("T")[0];
        return visitDate <= dateTo;
      });
    }

    setFilteredData(filtered);
  }, [
    dataTamu,
    searchTerm,
    statusFilter,
    kategoriFilter,
    keperluanFilter,
    divisiFilter,
    dateFrom,
    dateTo,
  ]);
  // Reset halaman saat filter/ukuran halaman berubah
  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchTerm,
    statusFilter,
    kategoriFilter,
    keperluanFilter,
    divisiFilter,
    dateFrom,
    dateTo,
    pageSize,
  ]);

  const totalItems = filteredData.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const firstItemIndex = (currentPage - 1) * pageSize;
  const lastItemIndex = Math.min(firstItemIndex + pageSize, totalItems);
  const pageItems = filteredData.slice(firstItemIndex, lastItemIndex);

  // Listen for new data from TambahTamu
  useEffect(() => {
    const handleStorageChange = () => {
      const savedData = localStorage.getItem("dataTamu");
      if (savedData) {
        setDataTamu(JSON.parse(savedData));
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const updateStatusTamu = (index, newStatus) => {
    const updatedData = [...dataTamu];
    updatedData[index].statusTamu = newStatus;
    setDataTamu(updatedData);
  };

  const handleDeleteClick = (tamu, index) => {
    setDeleteModal({ isOpen: true, tamu, index });
  };

  const handleDeleteConfirm = () => {
    const updatedData = dataTamu.filter((_, i) => i !== deleteModal.index);
    setDataTamu(updatedData);
    setDeleteModal({ isOpen: false, tamu: null, index: null });
  };

  const handleDeleteCancel = () => {
    setDeleteModal({ isOpen: false, tamu: null, index: null });
  };

  const clearAllFilters = () => {
    setSearchTerm("");
    setStatusFilter("");
    setKategoriFilter("");
    setKeperluanFilter("");
    setDateFrom("");
    setDateTo("");
    setDivisiFilter("");
  };

  return (
    <div className="space-y-5">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Data Tamu</h1>
          <p className="text-gray-600">
            Kelola buku tamu dan riwayat kunjungan
          </p>
        </div>
        <button
          onClick={() =>
            navigate("/buku-tamu/tambah", {
              state: {
                waktuBerkunjung: new Date().toISOString(),
              },
            })
          }
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
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
              d="M12 4v16m8-8H4"
            />
          </svg>
          Tambah
        </button>
      </header>

      {/* Advanced Filter Section */}
      <div className="bg-white rounded-xl border p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            🔍 Filter & Pencarian
          </h3>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">
              {filteredData.length} dari {dataTamu.length} data
            </span>
            <button
              onClick={clearAllFilters}
              className="px-3 py-1.5 text-sm text-red-600 border border-red-300 rounded-md hover:bg-red-50 transition-colors"
            >
              Clear All
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {/* Search Input */}
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              🔍 Pencarian Global
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cari nama, instansi, keperluan, tujuan, divisi, dll..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <svg
                className="absolute left-3 top-3 w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              📊 Status Tamu
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Semua Status</option>
              <option value="Open">Open</option>
              <option value="Entry">Entry</option>
              <option value="Closed">Closed</option>
            </select>
          </div>

          {/* Kategori Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              👑 Kategori Tamu
            </label>
            <select
              value={kategoriFilter}
              onChange={(e) => setKategoriFilter(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Semua Kategori</option>
              <option value="VIP">VIP</option>
              <option value="Class 1">Class 1</option>
              <option value="Class 2">Class 2</option>
              <option value="Class 3">Class 3</option>
            </select>
          </div>

          {/* Keperluan Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              🎯 Keperluan
            </label>
            <select
              value={keperluanFilter}
              onChange={(e) => setKeperluanFilter(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Semua Keperluan</option>
              <option value="Dinas">Dinas</option>
              <option value="Pribadi">Pribadi</option>
              <option value="Meeting">Meeting</option>
              <option value="Penawaran Jasa/Produk">
                Penawaran Jasa/Produk
              </option>
              <option value="Lainnya">Lainnya</option>
            </select>
          </div>

          {/* Divisi Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              🏢 Divisi
            </label>
            <input
              type="text"
              value={divisiFilter}
              onChange={(e) => setDivisiFilter(e.target.value)}
              placeholder="Cari divisi..."
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Date From */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              📅 Dari Tanggal
            </label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Date To */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              📅 Sampai Tanggal
            </label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Active Filters Display */}
        {(searchTerm ||
          statusFilter ||
          kategoriFilter ||
          keperluanFilter ||
          divisiFilter ||
          dateFrom ||
          dateTo) && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-medium text-gray-700">
                Filter Aktif:
              </span>
              {searchTerm && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                  Search: "{searchTerm}"
                  <button
                    onClick={() => setSearchTerm("")}
                    className="ml-1 hover:text-blue-600"
                  >
                    ✕
                  </button>
                </span>
              )}
              {statusFilter && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                  Status: {statusFilter}
                  <button
                    onClick={() => setStatusFilter("")}
                    className="ml-1 hover:text-green-600"
                  >
                    ✕
                  </button>
                </span>
              )}
              {kategoriFilter && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                  Kategori: {kategoriFilter}
                  <button
                    onClick={() => setKategoriFilter("")}
                    className="ml-1 hover:text-purple-600"
                  >
                    ✕
                  </button>
                </span>
              )}
              {keperluanFilter && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                  Keperluan: {keperluanFilter}
                  <button
                    onClick={() => setKeperluanFilter("")}
                    className="ml-1 hover:text-yellow-600"
                  >
                    ✕
                  </button>
                </span>
              )}
              {divisiFilter && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
                  Divisi: {divisiFilter}
                  <button
                    onClick={() => setDivisiFilter("")}
                    className="ml-1 hover:text-orange-600"
                  >
                    ✕
                  </button>
                </span>
              )}
              {dateFrom && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-indigo-100 text-indigo-800 text-xs rounded-full">
                  Dari: {dateFrom}
                  <button
                    onClick={() => setDateFrom("")}
                    className="ml-1 hover:text-indigo-600"
                  >
                    ✕
                  </button>
                </span>
              )}
              {dateTo && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-indigo-100 text-indigo-800 text-xs rounded-full">
                  Sampai: {dateTo}
                  <button
                    onClick={() => setDateTo("")}
                    className="ml-1 hover:text-indigo-600"
                  >
                    ✕
                  </button>
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="rounded-xl border bg-white overflow-hidden">
        <div className="px-4 py-3 border-b flex items-center justify-between">
          <div className="text-sm text-gray-600">Data Tamu</div>
          <div className="flex items-center gap-3 text-xs text-gray-600">
            <span>
              Menampilkan {totalItems === 0 ? 0 : firstItemIndex + 1}–
              {lastItemIndex} dari {totalItems} hasil
            </span>
            <select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              className="border rounded px-2 py-1 text-xs"
            >
              <option value={10}>10 / halaman</option>
              <option value={25}>25 / halaman</option>
              <option value={50}>50 / halaman</option>
              <option value={100}>100 / halaman</option>
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm table-auto">
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
                  "Status",
                  "Keterangan",
                  "Actions",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-3 py-2 font-medium text-left whitespace-nowrap sticky top-0 bg-gray-50 z-10"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredData.length === 0 ? (
                <tr>
                  <td
                    colSpan={15}
                    className="px-3 py-10 text-center text-gray-500"
                  >
                    {dataTamu.length === 0
                      ? "Belum ada data tamu"
                      : "Tidak ada data yang sesuai dengan filter"}
                  </td>
                </tr>
              ) : (
                pageItems.map((tamu, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="px-3 py-2">{firstItemIndex + index + 1}</td>
                    <td
                      className="px-3 py-2 font-medium cursor-pointer hover:text-blue-600"
                      onClick={() => setSelectedTamu(tamu)}
                    >
                      {tamu.nama}
                    </td>
                    <td className="px-3 py-2">{tamu.instansi}</td>
                    <td className="px-3 py-2">{tamu.keperluan}</td>
                    <td className="px-3 py-2">{tamu.tujuan}</td>
                    <td className="px-3 py-2">{tamu.divisi}</td>
                    <td className="px-3 py-2">{tamu.jenisKartu || "-"}</td>
                    <td className="px-3 py-2">{tamu.kategoriTamu || "-"}</td>
                    <td className="px-3 py-2">
                      {formatDateTime(tamu.waktuBerkunjung)}
                    </td>
                    <td className="px-3 py-2">
                      {formatDateTime(tamu.waktuKeluar)}
                    </td>
                    <td className="px-3 py-2">{tamu.noIdTamu || "-"}</td>
                    <td className="px-3 py-2">
                      <select
                        value={tamu.statusTamu || ""}
                        onChange={(e) =>
                          updateStatusTamu(index, e.target.value)
                        }
                        className={`px-2 py-1 rounded-full text-xs border-0 ${
                          tamu.statusTamu === "Open"
                            ? "bg-green-100 text-green-800"
                            : tamu.statusTamu === "Entry"
                            ? "bg-blue-100 text-blue-800"
                            : tamu.statusTamu === "Closed"
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        <option value="">Pilih Status</option>
                        <option value="Open">Open</option>
                        <option value="Entry">Entry</option>
                        <option value="Closed">Closed</option>
                      </select>
                    </td>
                    <td className="px-3 py-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          tamu.status === "Clear"
                            ? "bg-green-100 text-green-800"
                            : tamu.status === "Warning"
                            ? "bg-yellow-100 text-yellow-800"
                            : tamu.status === "Attention"
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {tamu.status || "-"}
                      </span>
                    </td>
                    <td className="px-3 py-2">{tamu.keterangan || "-"}</td>
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedTamu(tamu);
                          }}
                          className="text-blue-600 hover:text-blue-800"
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
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/buku-tamu/edit/${tamu.id}`, {
                              state: { data: tamu },
                            });
                          }}
                          className="text-yellow-600 hover:text-yellow-800"
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
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteClick(tamu, index);
                          }}
                          className="text-red-600 hover:text-red-800"
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
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t flex items-center justify-between text-sm">
          <div className="text-gray-600">
            Halaman {currentPage} dari {totalPages}
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onChange={(p) => setCurrentPage(p)}
          />
        </div>
      </div>

      {/* Detail View Modal */}
      {selectedTamu ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setSelectedTamu(null)}
          />
          <div className="relative w-full max-w-4xl max-h-[90vh] overflow-auto rounded-xl border bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4 sticky top-0 bg-white">
              <h3 className="text-lg font-semibold">Detail Data Tamu</h3>
              <button
                onClick={() => setSelectedTamu(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Foto
                </label>
                <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center">
                  {selectedTamu.fotoTamu ? (
                    <img
                      src={selectedTamu.fotoTamu}
                      alt="Foto Tamu"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <svg
                      className="w-8 h-8 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nama
                </label>
                <p className="text-sm text-gray-900">{selectedTamu.nama}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Instansi
                </label>
                <p className="text-sm text-gray-900">{selectedTamu.instansi}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Keperluan
                </label>
                <p className="text-sm text-gray-900">
                  {selectedTamu.keperluan}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tujuan
                </label>
                <p className="text-sm text-gray-900">{selectedTamu.tujuan}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Divisi
                </label>
                <p className="text-sm text-gray-900">{selectedTamu.divisi}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Jenis Kartu Identitas
                </label>
                <p className="text-sm text-gray-900">
                  {selectedTamu.jenisKartu || "-"}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  No. Kartu Identitas
                </label>
                <p className="text-sm text-gray-900">
                  {selectedTamu.noIdTamu || "-"}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Foto Kartu Identitas
                </label>
                <div className="w-24 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                  {selectedTamu.fotoKartuIdentitas ? (
                    <img
                      src={selectedTamu.fotoKartuIdentitas}
                      alt="Foto Kartu Identitas"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <svg
                      className="w-6 h-6 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kategori Tamu
                </label>
                <p className="text-sm text-gray-900">
                  {selectedTamu.kategoriTamu || "-"}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Waktu Berkunjung
                </label>
                <p className="text-sm text-gray-900">
                  {formatDateTime(selectedTamu.waktuBerkunjung)}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Waktu Keluar
                </label>
                <p className="text-sm text-gray-900">
                  {formatDateTime(selectedTamu.waktuKeluar)}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  No. ID Tamu
                </label>
                <p className="text-sm text-gray-900">
                  {selectedTamu.noIdTamu || "-"}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <span
                  className={`inline-flex px-2 py-1 rounded-full text-xs ${
                    selectedTamu.status === "Clear"
                      ? "bg-green-100 text-green-800"
                      : selectedTamu.status === "Warning"
                      ? "bg-yellow-100 text-yellow-800"
                      : selectedTamu.status === "Attention"
                      ? "bg-red-100 text-red-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {selectedTamu.status || "-"}
                </span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Keterangan
                </label>
                <p className="text-sm text-gray-900">
                  {selectedTamu.keterangan || "-"}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pos GRO
                </label>
                <p className="text-sm text-gray-900">ADMIN POS 1A</p>
              </div>
            </div>
          </div>
        </div>
      ) : null}

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

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={deleteModal.isOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        tamuName={deleteModal.tamu?.nama || ""}
      />
    </div>
  );
}

export default BukuTamu;
