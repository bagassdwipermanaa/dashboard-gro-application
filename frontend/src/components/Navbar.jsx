import { NavLink, Link } from "react-router-dom";

function Navbar() {
  return (
    <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b">
      <div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
        <Link to="/" className="inline-flex items-center gap-2">
          <div className="size-6 rounded bg-gray-900" />
          <span className="font-semibold">Dashboard GRO</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm">
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
        </nav>

        <div className="flex items-center gap-3">
          <NavLink
            to="/login"
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            Login
          </NavLink>
          <a
            className="inline-flex items-center justify-center rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white hover:bg-gray-800"
            href="#"
          >
            Get Started
          </a>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
