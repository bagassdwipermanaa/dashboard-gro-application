import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../auth/AuthContext";
const API = import.meta.env.VITE_API_URL || "http://10.69.255.196:8004";

function Reports() {
  const { user } = useAuth();
  const [dataTamu, setDataTamu] = useState([]);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

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
        <h3 className="font-semibold mb-4">Sort Data Tamu</h3>
        <div className="flex flex-wrap items-center gap-3">
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
          <div className="ml-auto flex items-center gap-2">
            <input
              placeholder="Cari..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-3 py-2 rounded-md border"
            />
            <button
              onClick={exportCSV}
              className="px-3 py-2 rounded-md border bg-gray-50 hover:bg-gray-100"
            >
              Export
            </button>
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
