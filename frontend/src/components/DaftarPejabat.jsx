import { useEffect, useMemo, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import DeleteModal from "./DeleteModal";
import Pagination from "./Pagination";

function DaftarPejabat() {
  const navigate = useNavigate();
  const [pejabat, setPejabat] = useState([]);
  const [search, setSearch] = useState("");
  const [filtersCollapsed, setFiltersCollapsed] = useState(true);
  const filterBodyRef = useRef(null);
  const filterContentRef = useRef(null);
  const [filterBodyHeight, setFilterBodyHeight] = useState(0);

  useEffect(() => {
    const el = filterContentRef.current;
    if (!el) return;
    if (!filtersCollapsed) {
      const measure = () => setFilterBodyHeight(el.scrollHeight || 0);
      measure();
      const id = requestAnimationFrame(measure);
      return () => cancelAnimationFrame(id);
    } else {
      setFilterBodyHeight(0);
    }
  }, [filtersCollapsed]);

  useEffect(() => {
    if (filtersCollapsed) return;
    const el = filterContentRef.current;
    if (!el) return;
    const update = () => setFilterBodyHeight(el.scrollHeight || 0);
    requestAnimationFrame(() => requestAnimationFrame(update));
    const ro = new ResizeObserver(update);
    ro.observe(el);
    window.addEventListener("resize", update);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
    };
  }, [filtersCollapsed, search]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState({
    show: false,
    pejabat: null,
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    fetchDataPejabat();
  }, []);

  const fetchDataPejabat = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/jabatan");
      if (response.ok) {
        const data = await response.json();
        setPejabat(data);
      } else {
        console.error("Gagal mengambil data pejabat");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      const response = await fetch(
        `/api/jabatan/${deleteModal.pejabat.idjabatan}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        alert("Data pejabat berhasil dihapus!");
        setPejabat(
          pejabat.filter((p) => p.idjabatan !== deleteModal.pejabat.idjabatan)
        );
        setDeleteModal({ show: false, pejabat: null });
      } else {
        const errorData = await response.json();
        alert(`Gagal menghapus data: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Gagal menghapus data pejabat");
    }
  };

  const filtered = useMemo(() => {
    if (!search) return pejabat;
    const s = search.toLowerCase();
    return pejabat.filter(
      (p) =>
        p.nama?.toLowerCase().includes(s) ||
        p.divisi?.toLowerCase().includes(s) ||
        p.bidang?.toLowerCase().includes(s) ||
        p.level?.toLowerCase().includes(s)
    );
  }, [pejabat, search]);

  // Pagination calculations
  const totalItems = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const firstItemIndex = (currentPage - 1) * pageSize;
  const lastItemIndex = Math.min(firstItemIndex + pageSize, totalItems);
  const pageItems = filtered.slice(firstItemIndex, lastItemIndex);

  // Reset page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Daftar Pejabat</h1>
        <p className="text-gray-600">Master data pejabat/penanggung jawab.</p>
      </div>

      <div className="bg-white rounded-xl border p-6 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900">Filter</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFiltersCollapsed((v) => !v)}
              className="px-3 py-1.5 text-sm border rounded-md bg-white hover:bg-gray-50 active:scale-[.98] transition-colors"
            >
              {filtersCollapsed ? "Tampilkan" : "Sembunyikan"}
            </button>
            <button
              onClick={() => setSearch("")}
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
            <div className="mb-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pencarian Global
              </label>
              <div className="relative">
                <input
                  placeholder="Cari nama / divisi / bidang / level..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
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
            <div className="flex flex-wrap items-center gap-3 mt-3">
              <button
                className="px-4 py-2 rounded-full border text-sm bg-green-600 text-white hover:bg-green-700"
                onClick={() => navigate("/tambah-pejabat")}
              >
                Tambah Pejabat
              </button>
              <button
                className="px-4 py-2 rounded-full border text-sm bg-blue-600 text-white hover:bg-blue-700"
                onClick={fetchDataPejabat}
              >
                Refresh Data
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border bg-white overflow-hidden">
        <div className="px-4 py-3 border-b flex items-center justify-between">
          <div className="text-sm text-gray-600">Data Pejabat</div>
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
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                {[
                  "No",
                  "Aksi",
                  "Nama",
                  "Divisi",
                  "Bidang",
                  "Level",
                  "Gedung",
                  "Ruang",
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
              {loading ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-3 py-10 text-center text-gray-500"
                  >
                    Loading data...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-3 py-10 text-center text-gray-500"
                  >
                    Belum ada data
                  </td>
                </tr>
              ) : (
                pageItems.map((p, idx) => (
                  <tr key={idx} className="border-b hover:bg-gray-50">
                    <td className="px-3 py-2">{firstItemIndex + idx + 1}</td>
                    <td className="px-3 py-2">
                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            navigate("/edit-pejabat", {
                              state: { pejabatData: p },
                            })
                          }
                          className="px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() =>
                            setDeleteModal({ show: true, pejabat: p })
                          }
                          className="px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600"
                        >
                          Hapus
                        </button>
                      </div>
                    </td>
                    <td className="px-3 py-2 font-medium">{p.nama || "-"}</td>
                    <td className="px-3 py-2">{p.divisi || "-"}</td>
                    <td className="px-3 py-2">{p.bidang || "-"}</td>
                    <td className="px-3 py-2">{p.level || "-"}</td>
                    <td className="px-3 py-2">{p.gedung || "-"}</td>
                    <td className="px-3 py-2">{p.ruang || "-"}</td>
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

      <DeleteModal
        show={deleteModal.show}
        onClose={() => setDeleteModal({ show: false, pejabat: null })}
        onConfirm={handleDeleteConfirm}
        tamuName={deleteModal.pejabat?.nama || ""}
      />
    </div>
  );
}

export default DaftarPejabat;
