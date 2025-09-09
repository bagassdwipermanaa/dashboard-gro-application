import { NavLink, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { useState } from "react";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [openMenu, setOpenMenu] = useState(null); // 'list' | 'report' | 'master' | 'user' | null

  function toggle(menu) {
    setOpenMenu((prev) => (prev === menu ? null : menu));
  }

  function closeAll() {
    setOpenMenu(null);
  }

  return (
    <header
      className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b"
      onClick={closeAll}
    >
      <div
        className="mx-auto max-w-6xl px-4 h-16 grid grid-cols-3 items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <Link to="/" className="inline-flex items-center gap-2">
          <div className="size-6 rounded bg-gray-900" />
          <span className="font-semibold">Dashboard GRO</span>
        </Link>

        <nav className="hidden md:flex items-center justify-center gap-6 text-sm col-start-2 col-end-3">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `hover:text-gray-900 ${
                isActive ? "text-gray-900" : "text-gray-600"
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
                  `hover:text-gray-900 ${
                    isActive ? "text-gray-900" : "text-gray-600"
                  }`
                }
              >
                Buku Tamu
              </NavLink>
              <NavLink
                to="/history-tamu"
                className={({ isActive }) =>
                  `hover:text-gray-900 ${
                    isActive ? "text-gray-900" : "text-gray-600"
                  }`
                }
              >
                History Tamu
              </NavLink>
              <NavLink
                to="/log-telepon"
                className={({ isActive }) =>
                  `hover:text-gray-900 ${
                    isActive ? "text-gray-900" : "text-gray-600"
                  }`
                }
              >
                Log Telepon
              </NavLink>
              <NavLink
                to="/notes"
                className={({ isActive }) =>
                  `hover:text-gray-900 ${
                    isActive ? "text-gray-900" : "text-gray-600"
                  }`
                }
              >
                Notes (0)
              </NavLink>

              <div className="relative">
                <button
                  onClick={() => toggle("list")}
                  className={`inline-flex items-center gap-1 ${
                    openMenu === "list" ? "text-gray-900" : "text-gray-600"
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
                  <div className="absolute left-0 mt-2 w-40 rounded-md border bg-white shadow-md">
                    <Link
                      to="/list/kategori"
                      className="block px-3 py-2 text-sm hover:bg-gray-50"
                      onClick={closeAll}
                    >
                      Kategori
                    </Link>
                    <Link
                      to="/list/status"
                      className="block px-3 py-2 text-sm hover:bg-gray-50"
                      onClick={closeAll}
                    >
                      Status
                    </Link>
                  </div>
                ) : null}
              </div>

              <div className="relative">
                <button
                  onClick={() => toggle("report")}
                  className={`inline-flex items-center gap-1 ${
                    openMenu === "report" ? "text-gray-900" : "text-gray-600"
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
                  <div className="absolute left-0 mt-2 w-48 rounded-md border bg-white shadow-md">
                    <Link
                      to="/report/harian"
                      className="block px-3 py-2 text-sm hover:bg-gray-50"
                      onClick={closeAll}
                    >
                      Laporan Harian
                    </Link>
                    <Link
                      to="/report/bulanan"
                      className="block px-3 py-2 text-sm hover:bg-gray-50"
                      onClick={closeAll}
                    >
                      Laporan Bulanan
                    </Link>
                  </div>
                ) : null}
              </div>

              <div className="relative">
                <button
                  onClick={() => toggle("master")}
                  className={`inline-flex items-center gap-1 ${
                    openMenu === "master" ? "text-gray-900" : "text-gray-600"
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
                  <div className="absolute left-0 mt-2 w-48 rounded-md border bg-white shadow-md">
                    <Link
                      to="/master/users"
                      className="block px-3 py-2 text-sm hover:bg-gray-50"
                      onClick={closeAll}
                    >
                      Pengguna
                    </Link>
                    <Link
                      to="/master/roles"
                      className="block px-3 py-2 text-sm hover:bg-gray-50"
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

        <div className="flex items-center gap-3 justify-end col-start-3 col-end-4">
          {!user ? (
            <NavLink
              to="/login"
              className={({ isActive }) =>
                `inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors ${
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
                className="inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-white bg-gray-900 hover:bg-gray-800"
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
                      navigate("/");
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
