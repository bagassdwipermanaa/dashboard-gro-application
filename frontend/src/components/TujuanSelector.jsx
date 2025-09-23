import { useState, useEffect } from "react";

function TujuanSelector({
  value,
  onChange,
  placeholder = "Tujuan yang akan dikunjungi",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [pejabatList, setPejabatList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Load data pejabat dari API
  useEffect(() => {
    const loadPejabat = async () => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/jabatan");
        if (res.ok) {
          const data = await res.json();
          setPejabatList(data);
        }
      } catch (error) {
        console.error("Gagal memuat data pejabat:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadPejabat();
  }, []);

  // Filter pejabat berdasarkan search term
  const filteredPejabat = pejabatList.filter(
    (pejabat) =>
      pejabat.nama?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pejabat.jabatan?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pejabat.divisi?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectPejabat = (pejabat) => {
    const tujuanText = `${pejabat.nama} - ${
      pejabat.jabatan || pejabat.divisi || ""
    }`.trim();
    onChange(tujuanText);
    setIsOpen(false);
    setSearchTerm("");
  };

  const handleInputChange = (e) => {
    onChange(e.target.value);
  };

  return (
    <div className="relative group">
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 hover:border-gray-300 hover:shadow-md bg-white/80 backdrop-blur-sm"
        />
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 text-gray-400 hover:text-white hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600 rounded-lg transition-all duration-300 group/btn hover:shadow-lg hover:shadow-blue-500/25 hover:scale-110 active:scale-95"
          title="Pilih dari daftar pejabat"
        >
          <svg
            className={`w-5 h-5 transition-all duration-300 ${
              isOpen
                ? "rotate-45 scale-110"
                : "group-hover/btn:rotate-90 group-hover/btn:scale-110"
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M12 4v16m8-8H4"
            />
          </svg>
        </button>
      </div>

      {/* Dropdown Modal */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => setIsOpen(false)}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-2xl bg-white/95 backdrop-blur-xl border border-gray-200/50 rounded-2xl shadow-2xl max-h-[80vh] overflow-hidden animate-zoom-in">
              {/* Header */}
              <div className="p-4 border-b border-gray-100/50 bg-gradient-to-r from-blue-50/80 to-purple-50/80 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                      Pilih Pejabat
                    </h3>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-200 hover:scale-110 active:scale-95"
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
                        strokeWidth={2.5}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
                <div className="relative group">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="🔍 Cari nama, jabatan, atau divisi..."
                    className="w-full px-4 py-3 pl-12 text-sm border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 hover:border-gray-300 hover:shadow-lg bg-white/90 backdrop-blur-sm"
                  />
                  <svg
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200"
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

              {/* Content */}
              <div className="max-h-72 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                {isLoading ? (
                  <div className="p-8 text-center">
                    <div className="relative">
                      <div className="animate-spin w-12 h-12 border-4 border-blue-200 border-t-blue-500 rounded-full mx-auto mb-4"></div>
                      <div className="animate-pulse w-8 h-2 bg-blue-200 rounded mx-auto mb-2"></div>
                      <div className="animate-pulse w-6 h-2 bg-gray-200 rounded mx-auto"></div>
                    </div>
                    <p className="text-sm text-gray-500 mt-4 font-medium">
                      Memuat data pejabat...
                    </p>
                  </div>
                ) : filteredPejabat.length === 0 ? (
                  <div className="p-8 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
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
                          d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                        />
                      </svg>
                    </div>
                    <p className="text-sm text-gray-500 font-medium">
                      {searchTerm
                        ? "Tidak ada pejabat yang sesuai"
                        : "Tidak ada data pejabat"}
                    </p>
                  </div>
                ) : (
                  <div className="py-2">
                    {filteredPejabat.map((pejabat, index) => (
                      <button
                        key={pejabat.idjabatan || index}
                        onClick={() => handleSelectPejabat(pejabat)}
                        className="w-full px-4 py-4 text-left hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-gray-900 transition-all duration-300 group border-b border-gray-100/50 last:border-b-0 hover:shadow-sm hover:scale-[1.02] active:scale-[0.98]"
                        style={{
                          animationDelay: `${index * 50}ms`,
                          animation: "fadeInUp 0.3s ease-out forwards",
                        }}
                      >
                        <div className="flex items-center space-x-4">
                          <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center group-hover:from-blue-200 group-hover:to-purple-200 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                            <svg
                              className="w-6 h-6 text-blue-600 group-hover:text-purple-600 transition-colors duration-300"
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
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-base font-semibold text-gray-900 group-hover:text-blue-900 truncate transition-colors duration-200">
                              {pejabat.nama}
                            </p>
                            <p className="text-sm text-gray-600 group-hover:text-blue-700 truncate transition-colors duration-200">
                              {pejabat.jabatan || pejabat.divisi || "Pejabat"}
                            </p>
                            {pejabat.gedung && pejabat.ruang && (
                              <p className="text-xs text-gray-500 group-hover:text-blue-600 truncate transition-colors duration-200 flex items-center mt-1">
                                <svg
                                  className="w-3 h-3 mr-1"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                  />
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                  />
                                </svg>
                                {pejabat.gedung} - {pejabat.ruang}
                              </p>
                            )}
                          </div>
                          <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-gray-100 group-hover:bg-gradient-to-r group-hover:from-blue-500 group-hover:to-purple-600 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-12">
                              <svg
                                className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors duration-300"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2.5}
                                  d="M9 5l7 7-7 7"
                                />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-gray-100/50 bg-gradient-to-r from-gray-50/80 to-blue-50/80 backdrop-blur-sm">
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <p className="text-sm text-gray-600 font-medium">
                    {filteredPejabat.length} pejabat ditemukan
                  </p>
                  <div
                    className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"
                    style={{ animationDelay: "0.5s" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes zoomIn {
          from {
            opacity: 0;
            transform: scale(0.9) translateY(-20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        .animate-zoom-in {
          animation: zoomIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

export default TujuanSelector;
