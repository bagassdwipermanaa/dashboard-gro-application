import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import DeleteModal from "./DeleteModal";

function List() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState("tamu"); // "tamu" or "internal"
  const [dataTeleponTamu, setDataTeleponTamu] = useState([]);
  const [dataTeleponInternal, setDataTeleponInternal] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    data: null,
    index: null,
    type: null, // "tamu" or "internal"
  });

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");

  // Load data from backend on component mount
  useEffect(() => {
    const load = async () => {
      try {
        const [resTamu, resInternal] = await Promise.all([
          fetch("/api/phonebook/guests"),
          fetch("/api/phonebook/internal"),
        ]);
        if (!resTamu.ok || !resInternal.ok)
          throw new Error(`HTTP ${resTamu.status}/${resInternal.status}`);
        const [tamuRows, internalRows] = await Promise.all([
          resTamu.json(),
          resInternal.json(),
        ]);
        const tamu = tamuRows.map((r) => ({
          id: r.tlp1, // use primary key as id
          nama: r.nama || "",
          instansi: r.instansi || "",
          noTlp1: r.tlp1 || "",
          noTlp2: r.tlp2 || "",
          alamat: r.alamat || "",
          fax: r.fax || "",
          email: r.email || "",
        }));
        const internal = internalRows.map((r) => ({
          id: r.idtlp,
          idTlp: r.idtlp,
          nama: r.nama || "",
          jabatan: r.jabatan || "",
          divisi: r.divisi || "",
          noTlp1: r.tlp1 || "",
          noTlp2: r.tlp2 || "",
          extension: r.extension || "",
          email: r.email || "",
        }));
        setDataTeleponTamu(tamu);
        setDataTeleponInternal(internal);
      } catch (e) {
        console.error("Gagal memuat buku telepon:", e);
      }
    };
    load();
  }, []);

  // Handle tab change from URL parameters
  useEffect(() => {
    const tabFromUrl = searchParams.get("tab");
    if (tabFromUrl && (tabFromUrl === "tamu" || tabFromUrl === "internal")) {
      setActiveTab(tabFromUrl);
    }
  }, [searchParams]);

  // Update filtered data when active tab or search changes
  useEffect(() => {
    const currentData =
      activeTab === "tamu" ? dataTeleponTamu : dataTeleponInternal;

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const filtered = currentData.filter((item) => {
        if (activeTab === "tamu") {
          return (
            item.nama?.toLowerCase().includes(searchLower) ||
            item.instansi?.toLowerCase().includes(searchLower) ||
            item.noTlp1?.toLowerCase().includes(searchLower) ||
            item.noTlp2?.toLowerCase().includes(searchLower) ||
            item.alamat?.toLowerCase().includes(searchLower) ||
            item.fax?.toLowerCase().includes(searchLower) ||
            item.email?.toLowerCase().includes(searchLower)
          );
        } else {
          return (
            item.nama?.toLowerCase().includes(searchLower) ||
            item.jabatan?.toLowerCase().includes(searchLower) ||
            item.divisi?.toLowerCase().includes(searchLower) ||
            item.noTlp1?.toLowerCase().includes(searchLower) ||
            item.noTlp2?.toLowerCase().includes(searchLower) ||
            item.extension?.toLowerCase().includes(searchLower) ||
            item.email?.toLowerCase().includes(searchLower)
          );
        }
      });
      setFilteredData(filtered);
    } else {
      setFilteredData(currentData);
    }
  }, [activeTab, dataTeleponTamu, dataTeleponInternal, searchTerm]);

  const handleDelete = (data, index, type) => {
    setDeleteModal({ isOpen: true, data, index, type });
  };

  const handleDeleteConfirm = async () => {
    const { type, index } = deleteModal;
    try {
      if (type === "tamu") {
        const id = dataTeleponTamu[index]?.noTlp1 || dataTeleponTamu[index]?.id;
        if (!id) throw new Error("ID tidak ditemukan");
        const res = await fetch(
          `/api/phonebook/guests/${encodeURIComponent(id)}`,
          { method: "DELETE" }
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const updatedData = dataTeleponTamu.filter((_, i) => i !== index);
        setDataTeleponTamu(updatedData);
      } else {
        const id =
          dataTeleponInternal[index]?.idTlp || dataTeleponInternal[index]?.id;
        if (!id) throw new Error("ID tidak ditemukan");
        const res = await fetch(
          `/api/phonebook/internal/${encodeURIComponent(id)}`,
          { method: "DELETE" }
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const updatedData = dataTeleponInternal.filter((_, i) => i !== index);
        setDataTeleponInternal(updatedData);
      }
    } catch (e) {
      alert(`Gagal menghapus: ${e.message}`);
    } finally {
      setDeleteModal({ isOpen: false, data: null, index: null, type: null });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModal({ isOpen: false, data: null, index: null, type: null });
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  const handleExport = () => {
    // TODO: Implement export functionality
    alert("Export functionality akan diimplementasikan");
  };

  const currentData =
    activeTab === "tamu" ? dataTeleponTamu : dataTeleponInternal;
  const pageTitle =
    activeTab === "tamu" ? "Buku Telepon Tamu" : "Buku Telepon Internal";

  return (
    <div className="space-y-5">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{pageTitle}</h1>
          <p className="text-gray-600">
            Kelola {activeTab === "tamu" ? "kontak tamu" : "kontak internal"}
          </p>
        </div>
        <div className="flex items-center gap-4">
          {/* Tab Switcher */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => handleTabChange("tamu")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === "tamu"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Buku Telepon Tamu
            </button>
            <button
              onClick={() => handleTabChange("internal")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === "internal"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Buku Telepon Internal
            </button>
          </div>

          <button
            onClick={() => navigate(`/list/${activeTab}/tambah`)}
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
            Tambah
          </button>
        </div>
      </header>

      {/* Search and Export Section */}
      <div className="bg-white rounded-xl border p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            🔍 Pencarian & Export
          </h3>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">
              {filteredData.length} dari {currentData.length} data
            </span>
            <button
              onClick={clearSearch}
              className="px-3 py-1.5 text-sm text-red-600 border border-red-300 rounded-md hover:bg-red-50 transition-colors"
            >
              Clear Search
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                placeholder={`Cari ${
                  activeTab === "tamu"
                    ? "nama, instansi, telepon, alamat, email..."
                    : "nama, jabatan, divisi, telepon, extension, email..."
                }`}
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
                  onClick={clearSearch}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Export Button */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              📊 Export
            </label>
            <button
              onClick={handleExport}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Export Data
            </button>
          </div>
        </div>

        {/* Active Search Display */}
        {searchTerm && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-medium text-gray-700">
                Pencarian Aktif:
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                Search: "{searchTerm}"
                <button
                  onClick={clearSearch}
                  className="ml-1 hover:text-blue-600"
                >
                  ✕
                </button>
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Table Section */}
      <div className="rounded-xl border bg-white overflow-hidden">
        <div className="px-4 py-3 border-b flex items-center justify-between">
          <div className="text-sm text-gray-600">Data {pageTitle}</div>
          <div className="text-xs text-gray-400">
            Showing {filteredData.length > 0 ? 1 : 0}-{filteredData.length} of{" "}
            {currentData.length} items
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                {activeTab === "tamu" ? (
                  <>
                    {[
                      "No",
                      "Nama",
                      "Instansi",
                      "No.Tlp 1",
                      "No.Tlp 2",
                      "Alamat",
                      "Fax",
                      "Email",
                      "Actions",
                    ].map((h) => (
                      <th
                        key={h}
                        className="px-3 py-2 font-medium text-left whitespace-nowrap"
                      >
                        {h}
                      </th>
                    ))}
                  </>
                ) : (
                  <>
                    {[
                      "No",
                      "ID.Tlp",
                      "Nama",
                      "Jabatan",
                      "Divisi",
                      "No.Tlp 1",
                      "No.Tlp 2",
                      "Extension",
                      "Email",
                      "Actions",
                    ].map((h) => (
                      <th
                        key={h}
                        className="px-3 py-2 font-medium text-left whitespace-nowrap"
                      >
                        {h}
                      </th>
                    ))}
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {filteredData.length === 0 ? (
                <tr>
                  <td
                    colSpan={activeTab === "tamu" ? 9 : 10}
                    className="px-3 py-10 text-center text-gray-500"
                  >
                    {currentData.length === 0
                      ? `Belum ada data ${pageTitle}`
                      : "Tidak ada data yang sesuai dengan pencarian"}
                  </td>
                </tr>
              ) : (
                filteredData.map((item, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="px-3 py-2">{index + 1}</td>
                    {activeTab === "tamu" ? (
                      <>
                        <td className="px-3 py-2 font-medium">
                          {item.nama || "-"}
                        </td>
                        <td className="px-3 py-2">{item.instansi || "-"}</td>
                        <td className="px-3 py-2">{item.noTlp1 || "-"}</td>
                        <td className="px-3 py-2">{item.noTlp2 || "-"}</td>
                        <td
                          className="px-3 py-2 max-w-xs truncate"
                          title={item.alamat}
                        >
                          {item.alamat || "-"}
                        </td>
                        <td className="px-3 py-2">{item.fax || "-"}</td>
                        <td className="px-3 py-2">{item.email || "-"}</td>
                      </>
                    ) : (
                      <>
                        <td className="px-3 py-2">{item.idTlp || "-"}</td>
                        <td className="px-3 py-2 font-medium">
                          {item.nama || "(belum diset)"}
                        </td>
                        <td className="px-3 py-2">{item.jabatan || "-"}</td>
                        <td className="px-3 py-2">{item.divisi || "-"}</td>
                        <td className="px-3 py-2">{item.noTlp1 || "-"}</td>
                        <td className="px-3 py-2">{item.noTlp2 || "-"}</td>
                        <td className="px-3 py-2">{item.extension || "-"}</td>
                        <td className="px-3 py-2">{item.email || "-"}</td>
                      </>
                    )}
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            navigate(`/list/${activeTab}/edit/${item.id}`, {
                              state: { data: item },
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
                          onClick={() => handleDelete(item, index, activeTab)}
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
          tamuName={deleteModal.data?.nama || deleteModal.data?.idTlp || ""}
        />
      )}
    </div>
  );
}

export default List;
