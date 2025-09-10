import { useEffect, useMemo, useState } from "react";

function DaftarPejabat() {
  const [pejabat, setPejabat] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("dataPejabat");
    if (saved) setPejabat(JSON.parse(saved));
  }, []);

  const filtered = useMemo(() => {
    if (!search) return pejabat;
    const s = search.toLowerCase();
    return pejabat.filter(
      (p) =>
        p.nama?.toLowerCase().includes(s) ||
        p.jabatan?.toLowerCase().includes(s) ||
        p.divisi?.toLowerCase().includes(s)
    );
  }, [pejabat, search]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Daftar Pejabat</h1>
        <p className="text-gray-600">Master data pejabat/penanggung jawab.</p>
      </div>

      <div className="bg-white rounded-xl border p-4 flex items-center gap-3">
        <input
          placeholder="Cari nama / jabatan / divisi..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-3 py-2 rounded-md border flex-1"
        />
        <button
          className="px-3 py-2 rounded-md border"
          onClick={() => {
            const sample = [
              {
                nama: "Bagas Dwi Permana",
                jabatan: "Supervisor",
                divisi: "GRO",
              },
              { nama: "Rina", jabatan: "Manager", divisi: "Keuangan" },
            ];
            localStorage.setItem("dataPejabat", JSON.stringify(sample));
            setPejabat(sample);
          }}
        >
          Muat Contoh Data
        </button>
      </div>

      <div className="rounded-xl border bg-white overflow-hidden">
        <div className="px-4 py-3 border-b text-sm text-gray-600">
          {filtered.length} hasil
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                {["Nama", "Jabatan", "Divisi"].map((h) => (
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
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={3}
                    className="px-3 py-10 text-center text-gray-500"
                  >
                    Belum ada data
                  </td>
                </tr>
              ) : (
                filtered.map((p, idx) => (
                  <tr key={idx} className="border-b hover:bg-gray-50">
                    <td className="px-3 py-2">{p.nama}</td>
                    <td className="px-3 py-2">{p.jabatan}</td>
                    <td className="px-3 py-2">{p.divisi}</td>
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

export default DaftarPejabat;
