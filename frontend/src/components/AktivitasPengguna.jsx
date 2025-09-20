import { useEffect, useMemo, useState } from "react";

function AktivitasPengguna() {
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const params = new URLSearchParams({
          page: String(page),
          pageSize: String(pageSize),
        });
        if (debouncedSearch) params.set("search", debouncedSearch);
        const res = await fetch(`/api/aktivitas-pengguna?${params.toString()}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        if (json?.success === false)
          throw new Error(json?.message || "Gagal memuat data");
        const data = json?.data ?? json;
        const pagination = json?.pagination ?? {};
        setRows(Array.isArray(data) ? data : []);
        setTotalPages(Number(pagination.totalPages) || 1);
        setTotal(
          Number(pagination.total) || (Array.isArray(data) ? data.length : 0)
        );
      } catch (e) {
        setError(e.message || "Terjadi kesalahan saat memuat data");
        setRows([]);
        setTotalPages(1);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [page, pageSize, debouncedSearch]);

  const canPrev = page > 1;
  const canNext = page < totalPages;

  return (
    <div className="px-4 py-6">
      <div className="max-w-7xl mx-auto space-y-4">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              Data Aktivitas Pengguna
            </h1>
            <p className="text-sm text-gray-600">
              Catatan aktivitas admin pada sistem. Gunakan pencarian untuk
              memfilter berdasarkan model, username, atau keterangan.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Cari model/username/keterangan..."
              className="h-10 w-64 px-3 rounded-lg border border-gray-300 bg-white/80 backdrop-blur focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value) || 20);
                setPage(1);
              }}
              className="h-10 px-3 rounded-lg border border-gray-300 bg-white/80 backdrop-blur focus:outline-none"
            >
              {[10, 20, 50, 100].map((n) => (
                <option key={n} value={n}>
                  {n}/hal
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="rounded-2xl border bg-white/80 backdrop-blur shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <div className="text-sm text-gray-600">
              {loading ? "Memuat..." : `${total} aktivitas ditemukan`}
            </div>
            <div className="flex items-center gap-2">
              <button
                disabled={!canPrev || loading}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className={`px-3 py-1.5 text-sm rounded-lg border ${
                  canPrev && !loading
                    ? "bg-white hover:bg-gray-50"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
              >
                Sebelumnya
              </button>
              <div className="text-sm text-gray-600">
                Hal {page} / {totalPages}
              </div>
              <button
                disabled={!canNext || loading}
                onClick={() => setPage((p) => p + 1)}
                className={`px-3 py-1.5 text-sm rounded-lg border ${
                  canNext && !loading
                    ? "bg-white hover:bg-gray-50"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
              >
                Berikutnya
              </button>
            </div>
          </div>

          {error ? (
            <div className="p-6 text-sm text-red-600">{error}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50 text-gray-600">
                  <tr>
                    {["No", "Model", "Username", "Keterangan"].map((h) => (
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
                  {rows.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-3 py-10 text-center text-gray-500"
                      >
                        {loading ? "Memuat data..." : "Tidak ada data"}
                      </td>
                    </tr>
                  ) : (
                    rows.map((r, idx) => (
                      <tr
                        key={r.ID_AKTIVITAS ?? idx}
                        className="border-b hover:bg-gray-50"
                      >
                        <td className="px-3 py-2">
                          {(page - 1) * pageSize + idx + 1}
                        </td>
                        <td className="px-3 py-2 font-medium">
                          {r.MODEL || "-"}
                        </td>
                        <td className="px-3 py-2">{r.USERNAME || "-"}</td>
                        <td className="px-3 py-2">
                          <Keterangan value={r.KETERANGAN} />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Keterangan({ value }) {
  const text = (value || "").toString();
  const isJson = useMemo(() => {
    try {
      const obj = JSON.parse(text);
      return obj && typeof obj === "object";
    } catch {
      return false;
    }
  }, [text]);

  if (!text) return <span className="text-gray-400">-</span>;
  if (!isJson) return <span className="text-gray-700">{text}</span>;

  try {
    const obj = JSON.parse(text);
    return (
      <div className="text-gray-700">
        {Object.entries(obj).map(([k, v]) => (
          <div key={k} className="flex gap-2">
            <span className="min-w-24 text-gray-500">{k}</span>
            <span className="font-medium break-words">{formatValue(v)}</span>
          </div>
        ))}
      </div>
    );
  } catch {
    return <span className="text-gray-700">{text}</span>;
  }
}

function formatValue(v) {
  if (v == null) return "-";
  if (typeof v === "object") return JSON.stringify(v);
  return String(v);
}

function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

export default AktivitasPengguna;
