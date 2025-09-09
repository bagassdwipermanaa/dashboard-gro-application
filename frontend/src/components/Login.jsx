import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

// Dummy users untuk demo login dengan username
const dummyUsers = [
  { username: "admin", password: "admin123" },
  { username: "johndoe", password: "password" },
  { username: "sarah", password: "qwerty" },
];

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!username || !password) {
      setError("Username dan kata sandi wajib diisi");
      return;
    }

    const matchedUser = dummyUsers.find(
      (u) => u.username === username && u.password === password
    );

    if (!matchedUser) {
      setError("Username atau kata sandi tidak valid");
      return;
    }

    // Set auth state dan redirect ke dashboard/home setelah login berhasil
    login({ username: matchedUser.username });
    navigate("/");
  }

  return (
    <div className="mx-auto max-w-md">
      <div className="card p-6 md:p-8 shadow-sm">
        <h2 className="text-xl font-semibold text-center">Login</h2>
        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Username</label>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="h-4 w-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 11c2.21 0 4-1.79 4-4S14.21 3 12 3 8 4.79 8 7s1.79 4 4 4zm0 2c-3.314 0-6 2.239-6 5v1h12v-1c0-2.761-2.686-5-6-5z"
                  />
                </svg>
              </span>
              <input
                type="text"
                className="w-full rounded-md border pl-9 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-300"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Masukkan Username"
                autoComplete="username"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Kata sandi
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className="w-full rounded-md border px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-gray-300"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
              />
              <button
                type="button"
                aria-label={
                  showPassword
                    ? "Sembunyikan kata sandi"
                    : "Tampilkan kata sandi"
                }
                onClick={() => setShowPassword((v) => !v)}
                className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 hover:text-gray-700"
              >
                {showPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="h-5 w-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 3l18 18M10.477 10.485A3 3 0 0012 15a3 3 0 002.121-.879M9.88 9.88A3 3 0 0115 12m6.588-.11C20.412 8.165 16.55 6 12 6c-1.42 0-2.777.247-4.03.701M6.474 7.53C4.33 8.62 2.62 10.227 1.5 11.89c1.597 2.36 4.55 5.11 8.65 5.93 1.28.25 2.62.28 3.95.11 1.01-.127 1.985-.36 2.91-.69"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="h-5 w-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.25 12C3.5 7.5 7.5 4.5 12 4.5S20.5 7.5 21.75 12C20.5 16.5 16.5 19.5 12 19.5S3.5 16.5 2.25 12z"
                    />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>
          {error ? (
            <div className="rounded-md border border-red-200 bg-red-50 p-2 text-sm text-red-700">
              {error}
            </div>
          ) : null}
          <button
            type="submit"
            className="w-full rounded-md bg-gray-900 text-white py-2.5 hover:bg-gray-800 shadow-sm"
          >
            Masuk
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
