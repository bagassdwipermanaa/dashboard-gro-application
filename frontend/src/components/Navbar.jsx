import { NavLink, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { useState, useEffect } from "react";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [openMenu, setOpenMenu] = useState(null); // 'list' | 'report' | 'master' | 'user' | null
  const [notesCount, setNotesCount] = useState(0);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });

  function handleToggle(menu, event) {
    const buttonRect = event.currentTarget.getBoundingClientRect();
    const dropdownWidthPx = 192; // Tailwind w-48
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

  function closeAll() {
    setOpenMenu(null);
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
      className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b"
      onClick={closeAll}
    >
      <div
        className="mx-auto max-w-6xl px-4 h-20 flex items-center gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        <Link to="/" className="inline-flex items-center gap-3">
          {/* Mobile logo */}
          <img
            src="/image/Logo_PLN-removebg-preview.png"
            alt="Logo PLN"
            className="block md:hidden h-10 w-auto object-contain"
          />
          {/* Desktop logo */}
          <img
            src="/image/logoplnes-removebg-preview.png"
            alt="Logo"
            className="hidden md:block h-40 w-auto object-contain"
          />
          {/* Remove text label as requested */}
        </Link>

        <nav className="hidden md:flex items-center gap-2 text-sm flex-1 justify-center overflow-x-auto no-scrollbar whitespace-nowrap">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `px-3 py-2 rounded-md transition-all duration-200 ${
                isActive
                  ? "bg-gray-900 text-white shadow-sm"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`
            }
          >
            Home
          </NavLink>

          {user ? (
            <>
              <NavLink
                to="/buku-tamu"
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md transition-all duration-200 ${
                    isActive
                      ? "bg-gray-900 text-white shadow-sm"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`
                }
              >
                Buku Tamu
              </NavLink>
              <NavLink
                to="/history-tamu"
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md transition-all duration-200 ${
                    isActive
                      ? "bg-gray-900 text-white shadow-sm"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`
                }
              >
                History Tamu
              </NavLink>
              <NavLink
                to="/log-telepon"
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md transition-all duration-200 ${
                    isActive
                      ? "bg-gray-900 text-white shadow-sm"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`
                }
              >
                Log Telepon
              </NavLink>
              <NavLink
                to="/notes"
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md transition-all duration-200 ${
                    isActive
                      ? "bg-gray-900 text-white shadow-sm"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`
                }
              >
                Notes ({notesCount})
              </NavLink>

              <div className="relative group">
                <button
                  onClick={(e) => handleToggle("list", e)}
                  className={`inline-flex items-center gap-1 px-3 py-2 rounded-md transition-all duration-200 ${
                    openMenu === "list"
                      ? "bg-gray-900 text-white shadow-sm"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
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
                    className="fixed w-48 rounded-md border bg-white shadow-lg"
                    style={{
                      zIndex: 9999,
                      top: dropdownPos.top,
                      left: dropdownPos.left,
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Link
                      to="/list?tab=tamu"
                      className="block px-3 py-2 text-sm hover:bg-gray-50 rounded-t-md"
                      onClick={closeAll}
                    >
                      Buku Telepon Tamu
                    </Link>
                    <Link
                      to="/list?tab=internal"
                      className="block px-3 py-2 text-sm hover:bg-gray-50 rounded-b-md"
                      onClick={closeAll}
                    >
                      Buku Telepon Internal
                    </Link>
                  </div>
                ) : null}
              </div>

              <div className="relative">
                <button
                  onClick={(e) => handleToggle("report", e)}
                  className={`inline-flex items-center gap-1 px-3 py-2 rounded-md transition-all duration-200 ${
                    openMenu === "report"
                      ? "bg-gray-900 text-white shadow-sm"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
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
                    className="fixed w-48 rounded-md border bg-white shadow-lg"
                    style={{
                      zIndex: 9999,
                      top: dropdownPos.top,
                      left: dropdownPos.left,
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Link
                      to="/report/harian"
                      className="block px-3 py-2 text-sm hover:bg-gray-50 rounded-t-md"
                      onClick={closeAll}
                    >
                      Laporan Harian
                    </Link>
                    <Link
                      to="/report/bulanan"
                      className="block px-3 py-2 text-sm hover:bg-gray-50 rounded-b-md"
                      onClick={closeAll}
                    >
                      Laporan Bulanan
                    </Link>
                  </div>
                ) : null}
              </div>

              <div className="relative">
                <button
                  onClick={(e) => handleToggle("master", e)}
                  className={`inline-flex items-center gap-1 px-3 py-2 rounded-md transition-all duration-200 ${
                    openMenu === "master"
                      ? "bg-gray-900 text-white shadow-sm"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
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
                    className="fixed w-48 rounded-md border bg-white shadow-lg"
                    style={{
                      zIndex: 9999,
                      top: dropdownPos.top,
                      left: dropdownPos.left,
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Link
                      to="/master/users"
                      className="block px-3 py-2 text-sm hover:bg-gray-50 rounded-t-md"
                      onClick={closeAll}
                    >
                      Pengguna
                    </Link>
                    <Link
                      to="/master/roles"
                      className="block px-3 py-2 text-sm hover:bg-gray-50 rounded-b-md"
                      onClick={closeAll}
                    >
                      Role & Akses
                    </Link>
                  </div>
                ) : null}
              </div>
            </>
          ) : null}
        </nav>

        <div className="flex items-center gap-3 justify-end">
          {!user ? (
            <NavLink
              to="/login"
              className={({ isActive }) =>
                `inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-gray-800 text-white"
                    : "bg-gray-900 text-white hover:bg-gray-800"
                }`
              }
            >
              Login
            </NavLink>
          ) : (
            <div className="relative">
              <button
                onClick={() => toggle("user")}
                className="inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 transition-all duration-200"
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
                <div className="absolute right-0 mt-2 w-44 rounded-md border bg-white shadow-md">
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
    </header>
  );
}

export default Navbar;
