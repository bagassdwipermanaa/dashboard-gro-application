import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import DeleteModal from "./DeleteModal";

function Notes() {
  const navigate = useNavigate();
  const [dataNotes, setDataNotes] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    note: null,
    index: null,
  });

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
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
    dateFrom,
    dateTo,
  ]);

  // Load data from backend on component mount
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/notes");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const rows = await res.json();
        const mapped = rows.map((r) => ({
          idnotes: r.idnotes,
          dari: r.dari || "",
          tujuan: r.tujuan || "",
          tanggal: r.tanggal || new Date().toISOString().split("T")[0],
          pesan: r.pesan || "",
          status: r.status || "Open",
        }));
        setDataNotes(mapped);
        setFilteredData(mapped);
      } catch (e) {
        console.error("Gagal memuat notes:", e);
      }
    };
    load();
  }, []);

  // Filter data based on all filter criteria
  useEffect(() => {
    let filtered = [...dataNotes];

    // Search term filter (searches across multiple fields)
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (note) =>
          note.dari.toLowerCase().includes(searchLower) ||
          note.tujuan.toLowerCase().includes(searchLower) ||
          note.pesan.toLowerCase().includes(searchLower)
      );
    }

    // Status filter
    if (statusFilter) {
      filtered = filtered.filter((note) => note.status === statusFilter);
    }

    // Date range filter
    if (dateFrom) {
      filtered = filtered.filter((note) => {
        const noteDate = new Date(note.tanggal).toISOString().split("T")[0];
        return noteDate >= dateFrom;
      });
    }

    if (dateTo) {
      filtered = filtered.filter((note) => {
        const noteDate = new Date(note.tanggal).toISOString().split("T")[0];
        return noteDate <= dateTo;
      });
    }

    setFilteredData(filtered);
  }, [dataNotes, searchTerm, statusFilter, dateFrom, dateTo]);

  const handleDelete = (note, index) => {
    setDeleteModal({ isOpen: true, note, index });
  };

  const handleDeleteConfirm = async () => {
    try {
      const id = deleteModal.note?.idnotes || deleteModal.note?.id;
      if (!id) throw new Error("ID notes tidak ditemukan");
      const res = await fetch(`/api/notes/${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const updatedData = dataNotes.filter((_, i) => i !== deleteModal.index);
      setDataNotes(updatedData);
    } catch (e) {
      alert(`Gagal menghapus notes: ${e.message}`);
    } finally {
      setDeleteModal({ isOpen: false, note: null, index: null });
      window.dispatchEvent(new CustomEvent("notesUpdated"));
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModal({ isOpen: false, note: null, index: null });
  };

  const clearAllFilters = () => {
    setSearchTerm("");
    setStatusFilter("");
    setDateFrom("");
    setDateTo("");
  };

  // Export button tidak dipakai pada filter bar baru

  return (
    <div className="space-y-5">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Notes</h1>
          <p className="text-gray-600">Kelola catatan dan pesan</p>
        </div>
        <button
          onClick={() => navigate("/notes/tambah")}
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
          Tambah Notes
        </button>
      </header>

      {/* New Filter Bar with pills */}
      <div className="bg-white rounded-xl border p-6 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900">Filter</h3>
          <div className="flex items-center gap-2">
            <span className="hidden sm:block text-sm text-gray-600">
              {filteredData.length} dari {dataNotes.length} data
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
                  placeholder="Cari dari, tujuan, pesan, dll..."
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
        {(searchTerm || statusFilter || dateFrom || dateTo) && (
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
          <div className="text-sm text-gray-600">Data Notes</div>
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
                  "Dari",
                  "Tujuan",
                  "Tanggal",
                  "Pesan",
                  "Status",
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
              {filteredData.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-3 py-10 text-center text-gray-500"
                  >
                    {dataNotes.length === 0
                      ? "Belum ada data notes"
                      : "Tidak ada data yang sesuai dengan filter"}
                  </td>
                </tr>
              ) : (
                filteredData.map((note, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="px-3 py-2">{index + 1}</td>
                    <td className="px-3 py-2 font-medium">{note.dari}</td>
                    <td className="px-3 py-2">{note.tujuan}</td>
                    <td className="px-3 py-2">
                      {new Date(note.tanggal).toLocaleDateString("id-ID")}
                    </td>
                    <td
                      className="px-3 py-2 max-w-xs truncate"
                      title={note.pesan}
                    >
                      {note.pesan}
                    </td>
                    <td className="px-3 py-2">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          note.status === "Open"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {note.status}
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            navigate("/notes/edit/" + note.id, {
                              state: { data: note },
                            })
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
                          onClick={() => handleDelete(note, index)}
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
          tamuName={deleteModal.note?.dari || ""}
        />
      )}
    </div>
  );
}

export default Notes;
