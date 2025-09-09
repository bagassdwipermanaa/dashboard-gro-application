import { NavLink, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  return (
    <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b">
      <div className="mx-auto max-w-6xl px-4 h-16 grid grid-cols-3 items-center">
        <Link to="/" className="inline-flex items-center gap-2">
          <div className="size-6 rounded bg-gray-900" />
          <span className="font-semibold">Dashboard GRO</span>
        </Link>

        <nav className="hidden md:flex items-center justify-center gap-8 text-sm col-start-2 col-end-3">
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
                to="/reports"
                className={({ isActive }) =>
                  `hover:text-gray-900 ${
                    isActive ? "text-gray-900" : "text-gray-600"
                  }`
                }
              >
                Reports
              </NavLink>
              <NavLink
                to="/settings"
                className={({ isActive }) =>
                  `hover:text-gray-900 ${
                    isActive ? "text-gray-900" : "text-gray-600"
                  }`
                }
              >
                Settings
              </NavLink>
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
            <button
              onClick={() => {
                logout();
                navigate("/");
              }}
              className="inline-flex items-center justify-center rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
