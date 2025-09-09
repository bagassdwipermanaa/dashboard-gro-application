import Hero from "./Hero";
import StatCard from "./StatCard";
import { useAuth } from "../auth/AuthContext";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// Demo data — replace with real API data when available
const monthlyData = [
  { month: "Jan", visitors: 62 },
  { month: "Feb", visitors: 78 },
  { month: "Mar", visitors: 58 },
  { month: "Apr", visitors: 54 },
  { month: "Mei", visitors: 49 },
  { month: "Jun", visitors: 59 },
  { month: "Jul", visitors: 57 },
  { month: "Agu", visitors: 55 },
  { month: "Sep", visitors: 16 },
  { month: "Okt", visitors: 22 },
  { month: "Nov", visitors: 35 },
  { month: "Des", visitors: 44 },
];

const categoryData = [
  { name: "Tamu Umum", value: 45 },
  { name: "Vendor", value: 25 },
  { name: "Internal", value: 18 },
  { name: "Lainnya", value: 12 },
];

const PIE_COLORS = ["#6366f1", "#22c55e", "#f59e0b", "#ef4444", "#14b8a6"];

const recentActivity = [
  {
    id: 1,
    title: "Check-in tamu vendor",
    subtitle: "PT Sumber Daya",
    time: "2m lalu",
  },
  {
    id: 2,
    title: "Penjadwalan meeting",
    subtitle: "Ruang Rapat Utama",
    time: "15m lalu",
  },
  { id: 3, title: "Check-out tamu", subtitle: "Gedung A", time: "1h lalu" },
  { id: 4, title: "Catatan keamanan", subtitle: "Pos 1A", time: "2h lalu" },
];

const progressData = [
  { label: "SLA Layanan", value: 86 },
  { label: "Keamanan", value: 72 },
  { label: "Kepuasan Tamu", value: 91 },
  { label: "Kerapihan Data", value: 64 },
];

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
          <section className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold">Dashboard Overview</h2>
              <p className="text-sm text-gray-600">
                Ringkasan performa dan statistik terbaru
              </p>
            </div>
            <div className="text-xs text-gray-500">
              Data fiktif untuk demo UI
            </div>
          </section>

          <div className="mt-4 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Active Users"
              value="1,245"
              hint="Today"
              delta="+3.2%"
              deltaType="up"
              icon={
                <span className="inline-block size-6 rounded bg-gray-100" />
              }
            />
            <StatCard
              title="Open Tickets"
              value="32"
              hint="Across teams"
              delta="-6"
              deltaType="down"
              icon={
                <span className="inline-block size-6 rounded bg-gray-100" />
              }
            />
            <StatCard
              title="Conversion"
              value="4.8%"
              hint="Last 24h"
              delta="+0.4%"
              deltaType="up"
              icon={
                <span className="inline-block size-6 rounded bg-gray-100" />
              }
            />
            <StatCard
              title="Revenue"
              value="$12,430"
              hint="MTD"
              delta="+12%"
              deltaType="up"
              icon={
                <span className="inline-block size-6 rounded bg-gray-100" />
              }
            />
          </div>

          <div className="mt-6 grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2 rounded-xl border bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Kunjungan per Bulan</h3>
                <div className="text-xs text-gray-500">2025</div>
              </div>
              <div className="mt-3 h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={monthlyData}
                    margin={{ left: 8, right: 8, top: 8, bottom: 8 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Legend />
                    <Bar
                      dataKey="visitors"
                      name="Jumlah Tamu"
                      radius={[6, 6, 0, 0]}
                      fill="#60a5fa"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="rounded-xl border bg-white p-5 shadow-sm">
              <h3 className="font-semibold">Breakdown Kategori Tamu</h3>
              <div className="mt-3 h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={55}
                      outerRadius={80}
                      paddingAngle={3}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={PIE_COLORS[index % PIE_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Legend verticalAlign="bottom" height={24} />
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 rounded-xl border bg-white p-5 shadow-sm">
              <h3 className="font-semibold">Aktivitas Terbaru</h3>
              <ul className="mt-3 divide-y">
                {recentActivity.map((item) => (
                  <li
                    key={item.id}
                    className="py-3 flex items-center justify-between gap-4"
                  >
                    <div>
                      <p className="text-sm font-medium">{item.title}</p>
                      <p className="text-xs text-gray-500">{item.subtitle}</p>
                    </div>
                    <span className="text-xs text-gray-500">{item.time}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border bg-white p-5 shadow-sm">
              <h3 className="font-semibold">Target vs Realisasi</h3>
              <div className="mt-3 space-y-4">
                {progressData.map((row) => (
                  <div key={row.label}>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-600">{row.label}</span>
                      <span className="font-medium">{row.value}%</span>
                    </div>
                    <div className="mt-1 h-2 w-full rounded bg-gray-100">
                      <div
                        className="h-2 rounded bg-gray-900"
                        style={{ width: `${row.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
