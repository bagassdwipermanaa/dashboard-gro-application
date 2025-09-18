import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import DeleteModal from "./DeleteModal";

function LogTelepon() {
  const navigate = useNavigate();
  const [dataLogTelepon, setDataLogTelepon] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    log: null,
    index: null,
  });

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [telpFilter, setTelpFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  // UI state for new filter bar
  const [openFilter, setOpenFilter] = useState(null);
  const [filtersCollapsed, setFiltersCollapsed] = useState(true);
  const filterBodyRef = useRef(null);
  const filterContentRef = useRef(null);
  const [filterBodyHeight, setFilterBodyHeight] = useState(0);

  useEffect(() => {
    const contentEl = filterContentRef.current;
    if (!contentEl) return;
    if (!filtersCollapsed) {
      const measure = () => setFilterBodyHeight(contentEl.scrollHeight || 0);
      measure();
      const id = requestAnimationFrame(measure);
      return () => cancelAnimationFrame(id);
    } else {
      setFilterBodyHeight(0);
    }
  }, [filtersCollapsed]);

  useEffect(() => {
    if (filtersCollapsed) return;
    const contentEl = filterContentRef.current;
    if (!contentEl) return;
    const update = () => setFilterBodyHeight(contentEl.scrollHeight || 0);
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
    telpFilter,
    dateFrom,
    dateTo,
  ]);

  // Load data from backend on component mount
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/logs/telepon");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const rows = await res.json();
        const mapped = rows.map((r) => ({
          idbukutlp: r.idbukutlp,
          namaPenelpon: r.nama_penelpon || "",
          noPenelpon: r.no_penelpon || "",
          namaDituju: r.nama_dituju || "",
          noDituju: r.no_dituju || "",
          tanggal: r.tanggal || new Date().toISOString().split("T")[0],
          jam: r.jam || "00:00",
          pesan: r.pesan || "",
          keterangan: r.ket || "",
          status: r.status || "Open",
          telpKeluarMasuk: r.statusinout || "Masuk",
        }));
        setDataLogTelepon(mapped);
        setFilteredData(mapped);
      } catch (e) {
        console.error("Gagal memuat data log telepon:", e);
      }
    };
    load();
  }, []);

  // Filter data based on all filter criteria
  useEffect(() => {
    let filtered = [...dataLogTelepon];

    // Search term filter (searches across multiple fields)
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (log) =>
          log.namaPenelpon.toLowerCase().includes(searchLower) ||
          log.noPenelpon.toLowerCase().includes(searchLower) ||
          log.namaDituju.toLowerCase().includes(searchLower) ||
          log.noDituju.toLowerCase().includes(searchLower) ||
          log.pesan?.toLowerCase().includes(searchLower) ||
          log.keterangan?.toLowerCase().includes(searchLower)
      );
    }

    // Status filter
    if (statusFilter) {
      filtered = filtered.filter((log) => log.status === statusFilter);
    }

    // Telp filter (Keluar/Masuk)
    if (telpFilter) {
      filtered = filtered.filter((log) => log.telpKeluarMasuk === telpFilter);
    }

    // Date range filter
    if (dateFrom) {
      filtered = filtered.filter((log) => {
        const logDate = new Date(log.tanggal).toISOString().split("T")[0];
        return logDate >= dateFrom;
      });
    }

    if (dateTo) {
      filtered = filtered.filter((log) => {
        const logDate = new Date(log.tanggal).toISOString().split("T")[0];
        return logDate <= dateTo;
      });
    }

    setFilteredData(filtered);
  }, [dataLogTelepon, searchTerm, statusFilter, telpFilter, dateFrom, dateTo]);

  const handleDelete = (log, index) => {
    setDeleteModal({ isOpen: true, log, index });
  };

  const handleDeleteConfirm = async () => {
    try {
      const id = deleteModal.log?.idbukutlp;
      if (!id) throw new Error("ID log tidak ditemukan");
      const res = await fetch(`/api/logs/telepon/${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const updatedData = dataLogTelepon.filter(
        (_, i) => i !== deleteModal.index
      );
      setDataLogTelepon(updatedData);
    } catch (e) {
      alert(`Gagal menghapus: ${e.message}`);
    } finally {
      setDeleteModal({ isOpen: false, log: null, index: null });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModal({ isOpen: false, log: null, index: null });
  };

  const clearAllFilters = () => {
    setSearchTerm("");
    setStatusFilter("");
    setTelpFilter("");
    setDateFrom("");
    setDateTo("");
  };

  return (
    <div className="space-y-5">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Log Telepon</h1>
          <p className="text-gray-600">Kelola log telepon masuk dan keluar</p>
        </div>
        <button
          onClick={() => navigate("/log-telepon/tambah")}
          className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
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
          Tambah Log Telepon
        </button>
      </header>

      {/* New Filter Bar with pills */}
      <div className="bg-white rounded-xl border p-6 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900">Filter</h3>
          <div className="flex items-center gap-2">
            <span className="hidden sm:block text-sm text-gray-600">
              {filteredData.length} dari {dataLogTelepon.length} data
            </span>
            <button
              onClick={() => setFiltersCollapsed((v) => !v)}
              className="px-3 py-1.5 text-sm border rounded-md bg-white hover:bg-gray-50 active:scale-[.98] transition-colors"
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
            filtersCollapsed ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
          style={{ height: `${filterBodyHeight}px` }}
        >
          <div ref={filterContentRef} className="pt-2">
            {/* Search */}
            <div className="mb-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pencarian Global
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Cari nama penelpon, no telepon, nama dituju, pesan, dll..."
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
              </div>
            </div>

            {/* Pills */}
            <div className="flex flex-wrap items-center gap-3 mt-3">
              {[
                {
                  key: "status",
                  label: statusFilter ? `Status: ${statusFilter}` : "Status",
                },
                {
                  key: "telp",
                  label: telpFilter ? `Telp: ${telpFilter}` : "Telp",
                },
                {
                  key: "tanggal",
                  label: dateFrom || dateTo ? "Tanggal" : "Tanggal",
                },
              ].map((btn) => (
                <button
                  key={btn.key}
                  onClick={() =>
                    setOpenFilter((prev) => (prev === btn.key ? null : btn.key))
                  }
                  className={`px-4 py-2 rounded-full border text-sm transition-colors hover:shadow-sm hover:ring-2 hover:ring-gray-200 active:scale-[.98] ${
                    (btn.key === "status" && !!statusFilter) ||
                    (btn.key === "telp" && !!telpFilter) ||
                    (btn.key === "tanggal" && (dateFrom || dateTo))
                      ? "bg-gray-900 text-white border-gray-900"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>

            {/* Panels */}
            {openFilter && (
              <div className="mt-3 w-full max-w-xl rounded-xl border bg-white shadow-lg p-4 transition-all duration-200 ease-out transform origin-top">
                {openFilter === "status" && (
                  <div className="space-y-2">
                    {["", "Open", "Closed"].map((opt, i) => (
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
                {openFilter === "telp" && (
                  <div className="space-y-2">
                    {["", "Keluar", "Masuk"].map((opt, i) => (
                      <label
                        key={i}
                        className="flex items-center gap-2 text-sm"
                      >
                        <input
                          type="radio"
                          name="telp-opt"
                          checked={telpFilter === opt}
                          onChange={() => setTelpFilter(opt)}
                        />
                        <span>{opt || "Semua"}</span>
                      </label>
                    ))}
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
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => setOpenFilter(null)}
                    className="px-3 py-1.5 text-sm border rounded hover:bg-gray-50 active:scale-[.98]"
                  >
                    Tutup
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Active Filters Display (tetap) */}
        {(searchTerm || statusFilter || telpFilter || dateFrom || dateTo) && (
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
              {telpFilter && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                  Telp: {telpFilter}
                  <button
                    onClick={() => setTelpFilter("")}
                    className="ml-1 hover:text-purple-600"
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

      {/* Table Section */}
      <div className="rounded-xl border bg-white overflow-hidden">
        <div className="px-4 py-3 border-b flex items-center justify-between">
          <div className="text-sm text-gray-600">Data Log Telepon</div>
          <div className="text-xs text-gray-400">
            {filteredData.length} hasil
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                {[
                  "No",
                  "Actions",
                  "Nama Penelpon",
                  "No Penelpon",
                  "Nama Dituju",
                  "No Dituju",
                  "Tanggal",
                  "Jam",
                  "Pesan",
                  "Keterangan",
                  "Telp. Keluar/masuk",
                  "Status",
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
              {filteredData.length === 0 ? (
                <tr>
                  <td
                    colSpan={12}
                    className="px-3 py-10 text-center text-gray-500"
                  >
                    {dataLogTelepon.length === 0
                      ? "Belum ada data log telepon"
                      : "Tidak ada data yang sesuai dengan filter"}
                  </td>
                </tr>
              ) : (
                filteredData.map((log, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="px-3 py-2">{index + 1}</td>
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            navigate(
                              "/log-telepon/edit/" + (log.idbukutlp || log.id),
                              {
                                state: { data: log },
                              }
                            )
                          }
                          className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                          title="Edit"
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
                          onClick={() => handleDelete(log, index)}
                          className="p-1 text-red-600 hover:bg-red-100 rounded"
                          title="Delete"
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
                    <td className="px-3 py-2 font-medium">
                      {log.namaPenelpon}
                    </td>
                    <td className="px-3 py-2">{log.noPenelpon}</td>
                    <td className="px-3 py-2">{log.namaDituju}</td>
                    <td className="px-3 py-2">{log.noDituju}</td>
                    <td className="px-3 py-2">
                      {new Date(log.tanggal).toLocaleDateString("id-ID")}
                    </td>
                    <td className="px-3 py-2">{log.jam}</td>
                    <td
                      className="px-3 py-2 max-w-xs truncate"
                      title={log.pesan}
                    >
                      {log.pesan || "-"}
                    </td>
                    <td
                      className="px-3 py-2 max-w-xs truncate"
                      title={log.keterangan}
                    >
                      {log.keterangan || "-"}
                    </td>
                    <td className="px-3 py-2">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          log.telpKeluarMasuk === "Keluar"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {log.telpKeluarMasuk}
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          log.status === "Open"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Modal */}
      {deleteModal.isOpen && (
        <DeleteModal
          isOpen={deleteModal.isOpen}
          onClose={handleDeleteCancel}
          onConfirm={handleDeleteConfirm}
          tamuName={deleteModal.log?.namaPenelpon || ""}
        />
      )}
    </div>
  );
}

export default LogTelepon;
