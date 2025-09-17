import { useState, useEffect, useRef } from "react";
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
  const [imagePreview, setImagePreview] = useState(null);
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
  // UI state
  const [openFilter, setOpenFilter] = useState(null);
  const [filtersCollapsed, setFiltersCollapsed] = useState(true);
  const [isPanelClosing, setIsPanelClosing] = useState(false);
  const filterBodyRef = useRef(null);
  const filterContentRef = useRef(null);
  const [filterBodyHeight, setFilterBodyHeight] = useState(0);

  useEffect(() => {
    const contentEl = filterContentRef.current;
    if (!contentEl) return;
    // Measure natural height when expanding, set to 0 when collapsing
    if (!filtersCollapsed) {
      const measure = () => {
        const hNow = contentEl.scrollHeight || 0;
        setFilterBodyHeight(hNow);
      };
      // measure now and after next frame to capture late DOM changes
      measure();
      const id = requestAnimationFrame(measure);
      return () => cancelAnimationFrame(id);
    } else {
      setFilterBodyHeight(0);
    }
  }, [filtersCollapsed]);

  // Recalculate height when inner content changes (e.g., opening a panel)
  useEffect(() => {
    if (filtersCollapsed) return;
    const contentEl = filterContentRef.current;
    if (!contentEl) return;
    const update = () => setFilterBodyHeight(contentEl.scrollHeight || 0);
    // double RAF to ensure layout settled after panel mount/unmount
    requestAnimationFrame(() => requestAnimationFrame(update));
    const ro = new ResizeObserver(update);
    ro.observe(contentEl);
    window.addEventListener("resize", update);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
    };
  }, [
    filtersCollapsed,
    openFilter,
    searchTerm,
    statusFilter,
    kategoriFilter,
    keperluanFilter,
    divisiFilter,
    dateFrom,
    dateTo,
  ]);
  const statusOptions = ["", "Open", "Entry"];
  const kategoriOptions = ["", "VIP", "Class 1", "Class 2", "Class 3"];
  const keperluanOptions = [
    "",
    "Dinas",
    "Pribadi",
    "Meeting",
    "Penawaran Jasa/Produk",
    "Lainnya",
  ];

  // helper lama dihapus karena tidak digunakan lagi
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

    // Hanya tampilkan status tamu Open atau Entry
    filtered = filtered.filter(
      (tamu) => tamu.statusTamu === "Open" || tamu.statusTamu === "Entry"
    );

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

  const updateStatusTamu = async (index, newStatus) => {
    try {
      const tamu = dataTamu[index];
      const idvisit = tamu?.idvisit;
      if (!idvisit) throw new Error("ID kunjungan tidak ditemukan");
      const res = await fetch(
        `/api/tamu/${encodeURIComponent(idvisit)}/status`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ statustamu: newStatus }),
        }
      );
      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || `Gagal update status (HTTP ${res.status})`);
      }
      const updated = [...dataTamu];
      updated[index].statusTamu = newStatus;
      // Jika status menjadi Closed, hapus dari daftar Buku Tamu (akan terlihat di History)
      const finalList =
        newStatus === "Closed"
          ? updated.filter((_, i) => i !== index)
          : updated;
      setDataTamu(finalList);
    } catch (err) {
      console.error("Update status tamu gagal:", err);
      alert(`Gagal mengubah status: ${err.message}`);
    }
  };

  const handleDeleteClick = (tamu, index) => {
    setDeleteModal({ isOpen: true, tamu, index });
  };

  const handleDeleteConfirm = async () => {
    try {
      const idvisit = deleteModal.tamu?.idvisit;
      if (!idvisit) throw new Error("ID kunjungan tidak ditemukan");
      const res = await fetch(`/api/tamu/${encodeURIComponent(idvisit)}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || `Gagal menghapus (HTTP ${res.status})`);
      }
      const updatedData = dataTamu.filter((_, i) => i !== deleteModal.index);
      setDataTamu(updatedData);
    } catch (err) {
      console.error("Hapus tamu gagal:", err);
      alert(`Gagal menghapus data: ${err.message}`);
    } finally {
      setDeleteModal({ isOpen: false, tamu: null, index: null });
    }
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
      <div className="bg-white rounded-xl border p-4 md:p-6 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-gray-900">Filter</h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden sm:block text-sm text-gray-600">
              {filteredData.length} dari {dataTamu.length} data
            </span>
            <button
              onClick={() => {
                if (!filtersCollapsed && openFilter) {
                  setIsPanelClosing(true);
                  setTimeout(() => {
                    setOpenFilter(null);
                    setIsPanelClosing(false);
                    setFiltersCollapsed(true);
                  }, 180);
                } else {
                  setFiltersCollapsed((v) => !v);
                }
              }}
              className="px-3 py-1.5 text-sm border rounded-md bg-white hover:bg-gray-50 active:scale-[.98] transition-colors"
              aria-expanded={!filtersCollapsed}
              title={
                filtersCollapsed ? "Tampilkan filter" : "Sembunyikan filter"
              }
            >
              {filtersCollapsed ? "Tampilkan" : "Sembunyikan"}
            </button>
            <button
              onClick={clearAllFilters}
              className="px-3 py-1.5 text-sm text-red-600 border border-red-300 rounded-md hover:bg-red-50"
            >
              Clear
            </button>
          </div>
        </div>

        <div
          ref={filterBodyRef}
          className={`overflow-hidden transition-[height,opacity] duration-300 ease-in-out ${
            filtersCollapsed
              ? "opacity-0 pointer-events-none"
              : "opacity-100 pointer-events-auto"
          }`}
          style={{ height: `${filterBodyHeight}px` }}
        >
          <div ref={filterContentRef} className="pt-2">
            {/* Global search (selalu tampil) */}
            <div className="mb-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pencarian Global
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Cari nama, instansi, keperluan, tujuan, divisi, dll..."
                  className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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

            {/* Row pill buttons ala contoh (gambar 2) */}
            <div className="flex flex-wrap items-center gap-3 mt-3">
              {[
                {
                  key: "status",
                  label: statusFilter ? `Status: ${statusFilter}` : "Status",
                },
                {
                  key: "kategori",
                  label: kategoriFilter
                    ? `Kategori: ${kategoriFilter}`
                    : "Kategori",
                },
                {
                  key: "keperluan",
                  label: keperluanFilter
                    ? `Keperluan: ${keperluanFilter}`
                    : "Keperluan",
                },
                {
                  key: "divisi",
                  label: divisiFilter ? `Divisi: ${divisiFilter}` : "Divisi",
                },
                {
                  key: "tanggal",
                  label: dateFrom || dateTo ? `Tanggal` : "Tanggal",
                },
              ].map((btn) => (
                <button
                  key={btn.key}
                  onClick={() => {
                    if (openFilter === btn.key) {
                      setIsPanelClosing(true);
                      setTimeout(() => {
                        setOpenFilter(null);
                        setIsPanelClosing(false);
                      }, 180);
                    } else {
                      setOpenFilter(btn.key);
                    }
                  }}
                  className={`px-4 py-2 rounded-full border text-sm transition-colors hover:shadow-sm hover:ring-2 hover:ring-gray-200 active:scale-[.98] ${
                    (btn.key === "status" && !!statusFilter) ||
                    (btn.key === "kategori" && !!kategoriFilter) ||
                    (btn.key === "keperluan" && !!keperluanFilter) ||
                    (btn.key === "divisi" && !!divisiFilter) ||
                    (btn.key === "tanggal" && (dateFrom || dateTo))
                      ? "bg-gray-900 text-white border-gray-900"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>

            {/* Popover panels */}
            {openFilter && (
              <div
                className={`mt-3 w-full max-w-xl rounded-xl border bg-white shadow-lg p-4 transition duration-200 ease-out transform origin-top ${
                  isPanelClosing
                    ? "opacity-0 -translate-y-2 scale-[.98]"
                    : "opacity-100 translate-y-0 scale-100"
                }`}
              >
                {openFilter === "status" && (
                  <div className="space-y-2">
                    {statusOptions.map((opt, i) => (
                      <label
                        key={i}
                        className="flex items-center gap-2 text-sm"
                      >
                        <input
                          type="radio"
                          name="status-opt"
                          checked={statusFilter === opt}
                          onChange={() => setStatusFilter(opt)}
                        />
                        <span>{opt || "Semua Status"}</span>
                      </label>
                    ))}
                  </div>
                )}
                {openFilter === "kategori" && (
                  <div className="space-y-2">
                    {kategoriOptions.map((opt, i) => (
                      <label
                        key={i}
                        className="flex items-center gap-2 text-sm"
                      >
                        <input
                          type="radio"
                          name="kategori-opt"
                          checked={kategoriFilter === opt}
                          onChange={() => setKategoriFilter(opt)}
                        />
                        <span>{opt || "Semua Kategori"}</span>
                      </label>
                    ))}
                  </div>
                )}
                {openFilter === "keperluan" && (
                  <div className="space-y-2">
                    {keperluanOptions.map((opt, i) => (
                      <label
                        key={i}
                        className="flex items-center gap-2 text-sm"
                      >
                        <input
                          type="radio"
                          name="keperluan-opt"
                          checked={keperluanFilter === opt}
                          onChange={() => setKeperluanFilter(opt)}
                        />
                        <span>{opt || "Semua Keperluan"}</span>
                      </label>
                    ))}
                  </div>
                )}
                {openFilter === "divisi" && (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={divisiFilter}
                      onChange={(e) => setDivisiFilter(e.target.value)}
                      placeholder="Ketik nama divisi"
                      className="w-full px-3 py-2 border rounded"
                    />
                  </div>
                )}
                {openFilter === "tanggal" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">
                        Dari
                      </label>
                      <input
                        type="date"
                        value={dateFrom}
                        onChange={(e) => setDateFrom(e.target.value)}
                        className="w-full px-3 py-2 border rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">
                        Sampai
                      </label>
                      <input
                        type="date"
                        value={dateTo}
                        onChange={(e) => setDateTo(e.target.value)}
                        className="w-full px-3 py-2 border rounded"
                      />
                    </div>
                  </div>
                )}
                <div className="mt-4 flex items-center justify-between">
                  <button
                    onClick={() => {
                      // clear only the active filter
                      if (openFilter === "status") setStatusFilter("");
                      if (openFilter === "kategori") setKategoriFilter("");
                      if (openFilter === "keperluan") setKeperluanFilter("");
                      if (openFilter === "divisi") setDivisiFilter("");
                      if (openFilter === "tanggal") {
                        setDateFrom("");
                        setDateTo("");
                      }
                    }}
                    className="text-sm text-red-600 hover:underline"
                  >
                    Hapus
                  </button>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setOpenFilter(null)}
                      className="px-3 py-1.5 text-sm border rounded hover:bg-gray-50 active:scale-[.98]"
                    >
                      Tutup
                    </button>
                    <button
                      onClick={() => setOpenFilter(null)}
                      className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 active:scale-[.98]"
                    >
                      Simpan
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Menghilangkan chip ringkasan filter aktif sesuai permintaan */}
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
                            navigate(`/buku-tamu/edit/${tamu.idvisit}`, {
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
                      className="w-full h-full object-cover rounded-lg cursor-zoom-in"
                      onClick={() => setImagePreview(selectedTamu.fotoTamu)}
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
                      className="w-full h-full object-cover rounded-lg cursor-zoom-in"
                      onClick={() =>
                        setImagePreview(selectedTamu.fotoKartuIdentitas)
                      }
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

      {/* Image Lightbox */}
      {imagePreview ? (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
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
