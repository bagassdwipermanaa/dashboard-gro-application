import { useEffect, useMemo, useState, useRef } from "react";
import { useAuth } from "../auth/AuthContext";
const API = import.meta.env.VITE_API_URL || "http://10.69.255.196:8004";

function Reports() {
  const { user } = useAuth();
  const [dataTamu, setDataTamu] = useState([]);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  // UI state for unified filter bar
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
  }, [filtersCollapsed, dateFrom, dateTo, search]);

  useEffect(() => {
    fetchDataTamu();
  }, []);

  const fetchDataTamu = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API}/tamu`);
      if (response.ok) {
        const data = await response.json();
        setDataTamu(data);
      } else {
        console.error("Gagal mengambil data tamu");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const filtered = useMemo(() => {
    let rows = [...dataTamu];
    if (dateFrom) {
      rows = rows.filter(
        (r) =>
          new Date(r.waktuBerkunjung).toISOString().split("T")[0] >= dateFrom
      );
    }
    if (dateTo) {
      rows = rows.filter(
        (r) => new Date(r.waktuBerkunjung).toISOString().split("T")[0] <= dateTo
      );
    }
    if (search) {
      const s = search.toLowerCase();
      rows = rows.filter(
        (r) =>
          r.nama?.toLowerCase().includes(s) ||
          r.instansi?.toLowerCase().includes(s) ||
          r.tujuan?.toLowerCase().includes(s) ||
          r.divisi?.toLowerCase().includes(s) ||
          r.keperluan?.toLowerCase().includes(s)
      );
    }
    return rows;
  }, [dataTamu, dateFrom, dateTo, search]);

  function exportCSV() {
    const headers = [
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
      "No. Induk GRO",
      "Pos GRO",
    ];
    const csvRows = [headers.join(",")];
    filtered.forEach((r) => {
      const row = [
        r.nama || "",
        r.instansi || "",
        r.keperluan || "",
        r.tujuan || "",
        r.divisi || "",
        r.jenisKartu || "",
        r.cattamu || "", // Menggunakan cattamu dari database
        r.waktuBerkunjung || "",
        r.waktuKeluar || "",
        r.noIdTamu || "",
        r.statusTamu || "",
        r.status || "",
        r.ket || "", // Menggunakan ket dari database
        user?.noIndukGRO || "-",
        user?.posGRO || "ADMIN POS 1A",
      ];
      csvRows.push(
        row.map((v) => `"${String(v).replaceAll('"', '""')}"`).join(",")
      );
    });
    const blob = new Blob([csvRows.join("\n")], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "report-tamu-per-bulan.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-center">Report Data Tamu</h1>
        <p className="text-sm text-gray-600 text-center">Export Table Result</p>
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
              onClick={() => {
                setDateFrom("");
                setDateTo("");
                setSearch("");
              }}
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
                  placeholder="Cari..."
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
              {[
                { key: "tanggal", label: "Tanggal" },
                { key: "export", label: "Export" },
              ].map((btn) =>
                btn.key === "export" ? (
                  <button
                    key={btn.key}
                    onClick={exportCSV}
                    className="px-4 py-2 rounded-full border text-sm transition-colors hover:shadow-sm hover:ring-2 hover:ring-gray-200 active:scale-[.98] bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  >
                    {btn.label}
                  </button>
                ) : (
                  <div key={btn.key} className="flex items-center gap-2">
                    <input
                      type="date"
                      value={dateFrom}
                      onChange={(e) => setDateFrom(e.target.value)}
                      className="px-3 py-2 rounded-md border"
                    />
                    <input
                      type="date"
                      value={dateTo}
                      onChange={(e) => setDateTo(e.target.value)}
                      className="px-3 py-2 rounded-md border"
                    />
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border bg-white overflow-hidden">
        <div className="px-4 py-3 border-b flex items-center justify-between">
          <div className="text-sm text-gray-600">Hasil</div>
          <div className="text-xs text-gray-400">
            {loading ? "Loading..." : `${filtered.length} hasil`}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                {[
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
                  "No. Induk GRO",
                  "Pos GRO",
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
                    colSpan={15}
                    className="px-3 py-10 text-center text-gray-500"
                  >
                    Loading data...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={15}
                    className="px-3 py-10 text-center text-gray-500"
                  >
                    No results found.
                  </td>
                </tr>
              ) : (
                filtered.map((r, idx) => (
                  <tr key={idx} className="border-b hover:bg-gray-50">
                    <td className="px-3 py-2">{r.nama}</td>
                    <td className="px-3 py-2">{r.instansi}</td>
                    <td className="px-3 py-2">{r.keperluan}</td>
                    <td className="px-3 py-2">{r.tujuan}</td>
                    <td className="px-3 py-2">{r.divisi}</td>
                    <td className="px-3 py-2">{r.jenisKartu || "-"}</td>
                    <td className="px-3 py-2">{r.cattamu || "-"}</td>
                    <td className="px-3 py-2">{r.waktuBerkunjung || "-"}</td>
                    <td className="px-3 py-2">{r.waktuKeluar || "-"}</td>
                    <td className="px-3 py-2">{r.noIdTamu || "-"}</td>
                    <td className="px-3 py-2">{r.statusTamu || "-"}</td>
                    <td className="px-3 py-2">{r.status || "-"}</td>
                    <td className="px-3 py-2">{r.ket || "-"}</td>
                    <td className="px-3 py-2">{user?.noIndukGRO || "-"}</td>
                    <td className="px-3 py-2">
                      {user?.posGRO || "ADMIN POS 1A"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Reports;
