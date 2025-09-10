import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import DeleteModal from "./DeleteModal";

function DaftarPejabat() {
  const navigate = useNavigate();
  const [pejabat, setPejabat] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState({
    show: false,
    pejabat: null,
  });

  useEffect(() => {
    fetchDataPejabat();
  }, []);

  const fetchDataPejabat = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:8004/api/jabatan");
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
        `http://localhost:8004/api/jabatan/${deleteModal.pejabat.idjabatan}`,
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Daftar Pejabat</h1>
        <p className="text-gray-600">Master data pejabat/penanggung jawab.</p>
      </div>

      <div className="bg-white rounded-xl border p-4 flex items-center gap-3">
        <input
          placeholder="Cari nama / divisi / bidang / level..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-3 py-2 rounded-md border flex-1"
        />
        <button
          className="px-3 py-2 rounded-md border bg-green-500 text-white hover:bg-green-600"
          onClick={() => navigate("/tambah-pejabat")}
        >
          Tambah Pejabat
        </button>
        <button
          className="px-3 py-2 rounded-md border bg-blue-500 text-white hover:bg-blue-600"
          onClick={fetchDataPejabat}
        >
          Refresh Data
        </button>
      </div>

      <div className="rounded-xl border bg-white overflow-hidden">
        <div className="px-4 py-3 border-b text-sm text-gray-600">
          {loading ? "Loading..." : `${filtered.length} hasil`}
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                {[
                  "Nama",
                  "Divisi",
                  "Bidang",
                  "Level",
                  "Gedung",
                  "Ruang",
                  "Aksi",
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
                    colSpan={7}
                    className="px-3 py-10 text-center text-gray-500"
                  >
                    Loading data...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-3 py-10 text-center text-gray-500"
                  >
                    Belum ada data
                  </td>
                </tr>
              ) : (
                filtered.map((p, idx) => (
                  <tr key={idx} className="border-b hover:bg-gray-50">
                    <td className="px-3 py-2">{p.nama || "-"}</td>
                    <td className="px-3 py-2">{p.divisi || "-"}</td>
                    <td className="px-3 py-2">{p.bidang || "-"}</td>
                    <td className="px-3 py-2">{p.level || "-"}</td>
                    <td className="px-3 py-2">{p.gedung || "-"}</td>
                    <td className="px-3 py-2">{p.ruang || "-"}</td>
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
                  </tr>
                ))
              )}
            </tbody>
          </table>
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
