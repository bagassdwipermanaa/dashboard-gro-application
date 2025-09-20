import { NavLink, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { useState, useEffect } from "react";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [openMenu, setOpenMenu] = useState(null); // 'list' | 'report' | 'master' | 'user' | null
  const [notesCount, setNotesCount] = useState(0);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });
  const [mobileOpen, setMobileOpen] = useState(false);
  // Admin diidentifikasi dari asal tabel "data_pengguna" (mendukung banyak nama field)
  const sourceTable = (
    user?.table ??
    user?.source ??
    user?.asal_tabel ??
    user?.asal ??
    user?.tableName ??
    user?.table_name ??
    user?.from ??
    ""
  )
    .toString()
    .toLowerCase();
  const isAdmin =
    (user?.userType ?? "").toString().toLowerCase() === "admin" ||
    sourceTable.includes("data_pengguna");
  // Debug ringan (aktif bila window.__DEV__ = true)
  if (typeof window !== "undefined" && window.__DEV__ === true) {
    console.debug(
      "Auth user:",
      user,
      "sourceTable:",
      sourceTable,
      "isAdmin:",
      isAdmin
    );
  }

  function handleToggle(menu, event) {
    const buttonRect = event.currentTarget.getBoundingClientRect();
    // Set width per menu: list=w-48(192), report=w-64(256), master=w-56(224)
    const dropdownWidthPx =
      menu === "report" ? 256 : menu === "master" ? 224 : 192;
    const computedLeft = Math.max(
      8,
      Math.min(
        window.innerWidth - dropdownWidthPx - 8,
        buttonRect.right - dropdownWidthPx
      )
    );
    const computedTop = buttonRect.bottom + window.scrollY + 8;

    setDropdownPos({ top: computedTop, left: computedLeft });

    console.log("🔥 TOGGLE:", menu, "Current:", openMenu);
    setOpenMenu((prev) => {
      const newValue = prev === menu ? null : menu;
      console.log("🔥 NEW VALUE:", newValue);
      return newValue;
    });
  }

  // Simple toggle used by the ADMIN user dropdown (no position calc needed)
  function toggle(menu) {
    setOpenMenu((prev) => (prev === menu ? null : menu));
  }

  function closeAll() {
    setOpenMenu(null);
    setMobileOpen(false);
  }

  // Load notes count from localStorage
  useEffect(() => {
    const loadNotesCount = () => {
      const savedData = localStorage.getItem("dataNotes");
      if (savedData) {
        const notes = JSON.parse(savedData);
        setNotesCount(notes.length);
      }
    };

    loadNotesCount();

    // Listen for storage changes
    const handleStorageChange = () => {
      loadNotesCount();
    };

    window.addEventListener("storage", handleStorageChange);

    // Also listen for custom events when data changes in same tab
    window.addEventListener("notesUpdated", loadNotesCount);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("notesUpdated", loadNotesCount);
    };
  }, []);

  return (
    <header
      className="sticky top-0 z-20 border-b bg-gradient-to-b from-white/70 to-white/40 backdrop-blur-xl supports-[backdrop-filter]:bg-white/40 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.2)]"
      onClick={closeAll}
    >
      <div
        className="w-full max-w-none px-6 lg:px-8 h-20 flex items-center gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        <Link to="/" className="inline-flex items-center gap-3 group">
          {/* Mobile logo */}
          <img
            src="/image/Logo_PLN-removebg-preview.png"
            alt="Logo PLN"
            className="block md:hidden h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
          />
          {/* Desktop logo */}
          <img
            src="/image/logoplnes-removebg-preview.png"
            alt="Logo"
            className="hidden md:block h-40 w-auto object-contain transition-transform duration-300 group-hover:scale-[1.02]"
          />
          {/* Remove text label as requested */}
        </Link>

        <nav className="hidden md:flex items-center gap-2 text-sm flex-1 justify-center overflow-x-auto no-scrollbar whitespace-nowrap">
          {user ? (
            <>
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  `px-3 py-2 rounded-xl transition-all duration-300 ${
                    isActive
                      ? "text-white shadow-md bg-gradient-to-r from-sky-600 to-indigo-600"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gradient-to-r hover:from-sky-500/10 hover:to-indigo-500/10 hover:shadow-sm"
                  }`
                }
              >
                Home
              </NavLink>
              <NavLink
                to="/buku-tamu"
                className={({ isActive }) =>
                  `px-3 py-2 rounded-xl transition-all duration-300 ${
                    isActive
                      ? "text-white shadow-md bg-gradient-to-r from-sky-600 to-indigo-600"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gradient-to-r hover:from-sky-500/10 hover:to-indigo-500/10 hover:shadow-sm"
                  }`
                }
              >
                Buku Tamu
              </NavLink>
              <NavLink
                to="/history-tamu"
                className={({ isActive }) =>
                  `px-3 py-2 rounded-xl transition-all duration-300 ${
                    isActive
                      ? "text-white shadow-md bg-gradient-to-r from-sky-600 to-indigo-600"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gradient-to-r hover:from-sky-500/10 hover:to-indigo-500/10 hover:shadow-sm"
                  }`
                }
              >
                History Tamu
              </NavLink>
              <NavLink
                to="/log-telepon"
                className={({ isActive }) =>
                  `px-3 py-2 rounded-xl transition-all duration-300 ${
                    isActive
                      ? "text-white shadow-md bg-gradient-to-r from-sky-600 to-indigo-600"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gradient-to-r hover:from-sky-500/10 hover:to-indigo-500/10 hover:shadow-sm"
                  }`
                }
              >
                Log Telepon
              </NavLink>
              <NavLink
                to="/notes"
                className={({ isActive }) =>
                  `px-3 py-2 rounded-xl transition-all duration-300 ${
                    isActive
                      ? "text-white shadow-md bg-gradient-to-r from-sky-600 to-indigo-600"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gradient-to-r hover:from-sky-500/10 hover:to-indigo-500/10 hover:shadow-sm"
                  }`
                }
              >
                Notes ({notesCount})
              </NavLink>

              <div className="relative group">
                <button
                  onClick={(e) => handleToggle("list", e)}
                  className={`inline-flex items-center gap-1 px-3 py-2 rounded-xl transition-all duration-300 ${
                    openMenu === "list"
                      ? "text-white shadow-md bg-gradient-to-r from-sky-600 to-indigo-600"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gradient-to-r hover:from-sky-500/10 hover:to-indigo-500/10 hover:shadow-sm"
                  }`}
                >
                  List
                  <svg
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.25 8.29a.75.75 0 01-.02-1.08z" />
                  </svg>
                </button>
                {openMenu === "list" ? (
                  <div
                    className="fixed w-48 rounded-2xl p-[1px] bg-gradient-to-b from-sky-200 to-indigo-200 shadow-xl animate-[fadeIn_.2s_ease-out]"
                    style={{
                      zIndex: 9999,
                      top: dropdownPos.top,
                      left: dropdownPos.left,
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="rounded-2xl border bg-white/90 backdrop-blur-md">
                      <Link
                        to="/list?tab=tamu"
                        className="block px-3 py-2 text-sm hover:bg-gray-50 rounded-t-2xl transition-colors"
                        onClick={closeAll}
                      >
                        Buku Telepon Tamu
                      </Link>
                      <Link
                        to="/list?tab=internal"
                        className="block px-3 py-2 text-sm hover:bg-gray-50 rounded-b-2xl transition-colors"
                        onClick={closeAll}
                      >
                        Buku Telepon Internal
                      </Link>
                    </div>
                  </div>
                ) : null}
              </div>

              <div className="relative">
                <button
                  onClick={(e) => handleToggle("report", e)}
                  className={`inline-flex items-center gap-1 px-3 py-2 rounded-xl transition-all duration-300 ${
                    openMenu === "report"
                      ? "text-white shadow-md bg-gradient-to-r from-sky-600 to-indigo-600"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gradient-to-r hover:from-sky-500/10 hover:to-indigo-500/10 hover:shadow-sm"
                  }`}
                >
                  Report
                  <svg
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.25 8.29a.75.75 0 01-.02-1.08z" />
                  </svg>
                </button>
                {openMenu === "report" ? (
                  <div
                    className="fixed w-64 rounded-2xl p-[1px] bg-gradient-to-b from-sky-200 to-indigo-200 shadow-xl animate-[fadeIn_.2s_ease-out]"
                    style={{
                      zIndex: 9999,
                      top: dropdownPos.top,
                      left: dropdownPos.left,
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="rounded-2xl border bg-white/90 backdrop-blur-md">
                      <Link
                        to="/reports"
                        className="block px-4 py-2 text-sm hover:bg-gray-50 rounded-2xl transition-colors"
                        onClick={closeAll}
                      >
                        Report Tamu Per Bulan
                      </Link>
                    </div>
                  </div>
                ) : null}
              </div>

              <div className="relative">
                <button
                  onClick={(e) => handleToggle("master", e)}
                  className={`inline-flex items-center gap-1 px-3 py-2 rounded-xl transition-all duration-300 ${
                    openMenu === "master"
                      ? "text-white shadow-md bg-gradient-to-r from-sky-600 to-indigo-600"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gradient-to-r hover:from-sky-500/10 hover:to-indigo-500/10 hover:shadow-sm"
                  }`}
                >
                  Data Master
                  <svg
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.25 8.29a.75.75 0 01-.02-1.08z" />
                  </svg>
                </button>
                {openMenu === "master" ? (
                  <div
                    className="fixed w-56 rounded-2xl p-[1px] bg-gradient-to-b from-sky-200 to-indigo-200 shadow-xl animate-[fadeIn_.2s_ease-out]"
                    style={{
                      zIndex: 9999,
                      top: dropdownPos.top,
                      left: dropdownPos.left,
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="rounded-2xl border bg-white/90 backdrop-blur-md">
                      {isAdmin ? (
                        <>
                          <Link
                            to="/master/aktivitas-pengguna"
                            className="block px-4 py-2 text-sm hover:bg-gray-50 transition-colors"
                            onClick={closeAll}
                          >
                            Data Aktivitas Pengguna
                          </Link>
                          <Link
                            to="/master/pengguna-aplikasi"
                            className="block px-4 py-2 text-sm hover:bg-gray-50 transition-colors"
                            onClick={closeAll}
                          >
                            Data Pengguna Aplikasi
                          </Link>
                          <Link
                            to="/master/gro"
                            className="block px-4 py-2 text-sm hover:bg-gray-50 transition-colors"
                            onClick={closeAll}
                          >
                            Data GRO
                          </Link>
                        </>
                      ) : null}
                      <Link
                        to="/master/pejabat"
                        className={`block px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                          isAdmin ? "rounded-b-2xl" : "rounded-2xl"
                        }`}
                        onClick={closeAll}
                      >
                        Daftar Pejabat
                      </Link>
                    </div>
                  </div>
                ) : null}
              </div>
            </>
          ) : null}
        </nav>

        <div className="flex items-center gap-3 justify-end ml-auto">
          {/* Mobile hamburger */}
          <button
            className="md:hidden inline-flex items-center justify-center h-10 w-10 rounded-lg border border-gray-200 bg-white/60 backdrop-blur hover:bg-white transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              setMobileOpen((v) => !v);
            }}
            aria-label="Toggle menu"
          >
            <span
              className={`block h-0.5 w-5 bg-gray-900 transition-all ${
                mobileOpen ? "translate-y-1 rotate-45" : "-translate-y-1"
              }`}
            ></span>
            <span
              className={`block h-0.5 w-5 bg-gray-900 transition-opacity ${
                mobileOpen ? "opacity-0" : "opacity-100"
              }`}
            ></span>
            <span
              className={`block h-0.5 w-5 bg-gray-900 transition-all ${
                mobileOpen ? "-translate-y-1 -rotate-45" : "translate-y-1"
              }`}
            ></span>
          </button>

          {!user ? (
            <NavLink
              to="/login"
              className={({ isActive }) =>
                `hidden md:inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition-all duration-300 ${
                  isActive
                    ? "bg-gray-800 text-white"
                    : "bg-gray-900 text-white hover:bg-gray-800 shadow-sm"
                }`
              }
            >
              Login
            </NavLink>
          ) : (
            <div className="relative">
              <button
                onClick={() => toggle("user")}
                className="hidden md:inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 shadow-sm transition-all duration-300"
              >
                {(user.username || "ADMIN").toUpperCase()}
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.25 8.29a.75.75 0 01-.02-1.08z" />
                </svg>
              </button>
              {openMenu === "user" ? (
                <div className="absolute right-0 mt-2 w-44 rounded-xl border bg-white/90 backdrop-blur shadow-md animate-[fadeIn_.2s_ease-out]">
                  <Link
                    to="/profile"
                    className="block px-3 py-2 text-sm hover:bg-gray-50"
                    onClick={closeAll}
                  >
                    Profil
                  </Link>
                  <Link
                    to="/settings"
                    className="block px-3 py-2 text-sm hover:bg-gray-50"
                    onClick={closeAll}
                  >
                    Pengaturan
                  </Link>
                  <Link
                    to="/change-password"
                    className="block px-3 py-2 text-sm hover:bg-gray-50"
                    onClick={closeAll}
                  >
                    Rubah Password
                  </Link>
                  <button
                    onClick={() => {
                      closeAll();
                      logout();
                      navigate("/welcome", {
                        state: { type: "logout", next: "/" },
                      });
                    }}
                    className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-50"
                  >
                    Keluar
                  </button>
                </div>
              ) : null}
            </div>
          )}
        </div>
      </div>

      {/* Mobile panel */}
      <div
        className={`md:hidden overflow-hidden transition-[max-height,opacity] duration-300 ${
          mobileOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 pb-6 pt-2 space-y-2 bg-white/80 backdrop-blur border-t">
          {user ? (
            <>
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-md ${
                    isActive ? "bg-gray-900 text-white" : "hover:bg-gray-100"
                  }`
                }
                onClick={closeAll}
              >
                Home
              </NavLink>
              <NavLink
                to="/buku-tamu"
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-md ${
                    isActive ? "bg-gray-900 text-white" : "hover:bg-gray-100"
                  }`
                }
                onClick={closeAll}
              >
                Buku Tamu
              </NavLink>
              <NavLink
                to="/history-tamu"
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-md ${
                    isActive ? "bg-gray-900 text-white" : "hover:bg-gray-100"
                  }`
                }
                onClick={closeAll}
              >
                History Tamu
              </NavLink>
              <NavLink
                to="/log-telepon"
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-md ${
                    isActive ? "bg-gray-900 text-white" : "hover:bg-gray-100"
                  }`
                }
                onClick={closeAll}
              >
                Log Telepon
              </NavLink>
              <NavLink
                to="/notes"
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-md ${
                    isActive ? "bg-gray-900 text-white" : "hover:bg-gray-100"
                  }`
                }
                onClick={closeAll}
              >
                Notes ({notesCount})
              </NavLink>
              <div className="pt-2">
                <div className="text-xs text-gray-500 px-3 pb-1">Menu Lain</div>
                {isAdmin ? (
                  <>
                    <Link
                      to="/master/aktivitas-pengguna"
                      className="block px-3 py-2 rounded-md hover:bg-gray-100"
                      onClick={closeAll}
                    >
                      Data Aktivitas Pengguna
                    </Link>
                    <Link
                      to="/master/pengguna-aplikasi"
                      className="block px-3 py-2 rounded-md hover:bg-gray-100"
                      onClick={closeAll}
                    >
                      Data Pengguna Aplikasi
                    </Link>
                    <Link
                      to="/master/gro"
                      className="block px-3 py-2 rounded-md hover:bg-gray-100"
                      onClick={closeAll}
                    >
                      Data GRO
                    </Link>
                  </>
                ) : null}
                <Link
                  to="/list?tab=tamu"
                  className="block px-3 py-2 rounded-md hover:bg-gray-100"
                  onClick={closeAll}
                >
                  Buku Telepon Tamu
                </Link>
                <Link
                  to="/list?tab=internal"
                  className="block px-3 py-2 rounded-md hover:bg-gray-100"
                  onClick={closeAll}
                >
                  Buku Telepon Internal
                </Link>
                <Link
                  to="/reports"
                  className="block px-3 py-2 rounded-md hover:bg-gray-100"
                  onClick={closeAll}
                >
                  Report Tamu Per Bulan
                </Link>
                <Link
                  to="/master/pejabat"
                  className="block px-3 py-2 rounded-md hover:bg-gray-100"
                  onClick={closeAll}
                >
                  Daftar Pejabat
                </Link>
              </div>
              {user ? (
                <button
                  onClick={() => {
                    closeAll();
                    logout();
                    navigate("/welcome", {
                      state: { type: "logout", next: "/" },
                    });
                  }}
                  className="mt-2 block w-full text-left px-3 py-2 rounded-md bg-gray-900 text-white"
                >
                  Keluar
                </button>
              ) : (
                <Link
                  to="/login"
                  className="mt-2 block w-full text-left px-3 py-2 rounded-md bg-gray-900 text-white"
                  onClick={closeAll}
                >
                  Login
                </Link>
              )}
            </>
          ) : (
            <Link
              to="/login"
              className="block px-3 py-2 rounded-md bg-gray-900 text-white"
              onClick={closeAll}
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
