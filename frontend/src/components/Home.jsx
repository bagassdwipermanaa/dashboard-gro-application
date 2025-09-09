import Hero from "./Hero";
import StatCard from "./StatCard";
import { useAuth } from "../auth/AuthContext";

function Home() {
  const { user } = useAuth();
  return (
    <div>
      <Hero />
      {!user ? (
        <div className="mt-8">
          <div className="mx-auto max-w-xl card p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4">
              <div className="rounded-lg bg-gray-100 p-3 text-gray-700">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 11c2.21 0 4-1.79 4-4S14.21 3 12 3 8 4.79 8 7s1.79 4 4 4zm0 2c-3.314 0-6 2.239-6 5v1h12v-1c0-2.761-2.686-5-6-5z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold">Selamat datang</h3>
                <p className="mt-1 text-gray-600 text-sm">
                  Silakan login untuk melihat data dashboard.
                </p>
                <a
                  href="/login"
                  className="mt-4 inline-flex items-center justify-center rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white hover:bg-gray-800"
                >
                  Login sekarang
                </a>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-8">
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard title="Active Users" value="1,245" hint="Today" />
            <StatCard title="Open Tickets" value="32" hint="Across teams" />
            <StatCard title="Conversion" value="4.8%" hint="Last 24h" />
            <StatCard title="Revenue" value="$12,430" hint="MTD" />
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
