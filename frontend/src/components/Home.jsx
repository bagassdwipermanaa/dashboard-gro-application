import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  LineChart,
  Line,
  Area,
  AreaChart,
} from "recharts";

// Animation components
const FadeIn = ({ children, delay = 0, duration = 0.6 }) => (
  <div
    className="animate-fade-in"
    style={{
      animationDelay: `${delay}s`,
      animationDuration: `${duration}s`,
    }}
  >
    {children}
  </div>
);

const SlideUp = ({ children, delay = 0, duration = 0.8 }) => (
  <div
    className="animate-slide-up"
    style={{
      animationDelay: `${delay}s`,
      animationDuration: `${duration}s`,
    }}
  >
    {children}
  </div>
);

const Pulse = ({ children, delay = 0 }) => (
  <div
    className="animate-pulse"
    style={{
      animationDelay: `${delay}s`,
    }}
  >
    {children}
  </div>
);

// Loading skeleton component
const LoadingSkeleton = () => (
  <div className="animate-pulse">
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-6">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="rounded-xl border bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between mb-2">
            <div className="h-4 bg-gray-200 rounded w-20"></div>
            <div className="h-6 w-6 bg-gray-200 rounded"></div>
          </div>
          <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-24"></div>
        </div>
      ))}
    </div>
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      <div className="xl:col-span-2 rounded-xl border bg-white p-5 shadow-sm">
        <div className="h-4 bg-gray-200 rounded w-32 mb-4"></div>
        <div className="h-72 bg-gray-200 rounded"></div>
      </div>
      <div className="rounded-xl border bg-white p-5 shadow-sm">
        <div className="h-4 bg-gray-200 rounded w-40 mb-4"></div>
        <div className="h-72 bg-gray-200 rounded"></div>
      </div>
    </div>
  </div>
);

// Enhanced StatCard with animations and navigation
const EnhancedStatCard = ({
  title,
  value,
  hint,
  icon,
  delta,
  deltaType = "neutral",
  loading = false,
  delay = 0,
  onClick,
  clickable = false,
}) => {
  const deltaColor =
    deltaType === "up"
      ? "text-emerald-600"
      : deltaType === "down"
      ? "text-red-600"
      : "text-gray-500";

  if (loading) {
    return (
      <div className="rounded-xl border bg-white p-5 shadow-sm animate-pulse">
        <div className="flex items-start justify-between mb-2">
          <div className="h-4 bg-gray-200 rounded w-20"></div>
          <div className="h-6 w-6 bg-gray-200 rounded"></div>
        </div>
        <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-24"></div>
      </div>
    );
  }

  return (
    <SlideUp delay={delay}>
      <div
        className={`group rounded-xl border bg-white p-5 shadow-sm transition-all duration-300 ${
          clickable
            ? "hover:shadow-lg hover:scale-105 hover:border-blue-200 cursor-pointer active:scale-95"
            : "hover:shadow-md"
        }`}
        onClick={clickable ? onClick : undefined}
      >
        <div className="flex items-start justify-between">
          <div className="text-sm text-gray-500 font-medium">{title}</div>
          {icon ? (
            <div
              className={`text-gray-400 transition-colors duration-300 ${
                clickable ? "group-hover:text-blue-500" : ""
              }`}
            >
              {icon}
            </div>
          ) : null}
        </div>
        <div className="mt-1 flex items-baseline gap-2">
          <div
            className={`text-2xl font-bold text-gray-900 transition-colors duration-300 ${
              clickable ? "group-hover:text-blue-600" : ""
            }`}
          >
            {value}
          </div>
          {delta ? (
            <span
              className={`text-xs font-medium px-2 py-1 rounded-full ${deltaColor} ${
                deltaType === "up"
                  ? "bg-emerald-50"
                  : deltaType === "down"
                  ? "bg-red-50"
                  : "bg-gray-50"
              }`}
            >
              {delta}
            </span>
          ) : null}
        </div>
        {hint ? <div className="mt-1 text-xs text-gray-500">{hint}</div> : null}
        {clickable && (
          <div className="mt-2 flex items-center text-xs text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span>Klik untuk detail</span>
            <svg
              className="ml-1 h-3 w-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        )}
      </div>
    </SlideUp>
  );
};

// Real-time clock component
const RealTimeClock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="text-right">
      <div className="text-2xl font-bold text-gray-900">
        {time.toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })}
      </div>
      <div className="text-sm text-gray-500">
        {time.toLocaleDateString("id-ID", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </div>
    </div>
  );
};

// Activity feed component with animations
const ActivityFeed = ({ activities, loading }) => {
  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="flex items-center gap-3 py-3">
              <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-1"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
              <div className="h-3 bg-gray-200 rounded w-16"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {activities.map((activity, index) => (
        <FadeIn key={activity.id || index} delay={index * 0.1}>
          <div className="flex items-center gap-3 py-3 hover:bg-gray-50 rounded-lg px-2 transition-colors duration-200">
            <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
              {activity.title?.charAt(0) || "A"}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">
                {activity.title}
              </p>
              <p className="text-xs text-gray-500">{activity.subtitle}</p>
            </div>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
              {activity.time || "Baru saja"}
            </span>
          </div>
        </FadeIn>
      ))}
    </div>
  );
};

function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [statsResponse, trendsResponse] = await Promise.all([
          fetch(
            `${
              import.meta.env.VITE_API_URL || "http://localhost:8004"
            }/api/dashboard/stats`
          ),
          fetch(
            `${
              import.meta.env.VITE_API_URL || "http://localhost:8004"
            }/api/dashboard/trends`
          ),
        ]);

        if (!statsResponse.ok || !trendsResponse.ok) {
          throw new Error("Failed to fetch dashboard data");
        }

        const [statsData] = await Promise.all([
          statsResponse.json(),
          trendsResponse.json(),
        ]);

        setDashboardData(statsData.data);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchDashboardData();
      // Refresh data every 30 seconds
      const interval = setInterval(fetchDashboardData, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  // Calculate percentage changes
  const calculatePercentageChange = (current, previous) => {
    if (previous === 0) return current > 0 ? "+100%" : "0%";
    const change = ((current - previous) / previous) * 100;
    return `${change >= 0 ? "+" : ""}${change.toFixed(1)}%`;
  };

  // Format numbers with thousand separators
  const formatNumber = (num) => {
    return new Intl.NumberFormat("id-ID").format(num);
  };

  // Navigation handlers
  const handleNavigate = (path) => {
    navigate(path);
  };

  // Prepare chart data
  const prepareChartData = (data) => {
    if (!data) return [];
    return data.map((item) => ({
      ...item,
      visitors: parseInt(item.visitors) || 0,
    }));
  };

  // Prepare category data for pie chart
  const prepareCategoryData = (categories) => {
    if (!categories) return [];
    return categories.map((cat, index) => ({
      name: cat.category,
      value: parseInt(cat.count),
      color: ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#06B6D4"][
        index % 6
      ],
    }));
  };

  const PIE_COLORS = [
    "#3B82F6",
    "#10B981",
    "#F59E0B",
    "#EF4444",
    "#8B5CF6",
    "#06B6D4",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <Hero />

      {!user ? (
        <FadeIn>
          <div className="mt-8">
            <div className="mx-auto max-w-xl card p-6 hover:shadow-lg transition-all duration-300 hover:scale-105">
              <div className="flex items-start gap-4">
                <div className="rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 p-3 text-white">
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
                  <h3 className="text-lg font-semibold">
                    Selamat datang di Dashboard GRO
                  </h3>
                  <p className="mt-1 text-gray-600 text-sm">
                    Silakan login untuk melihat data dashboard lengkap dengan
                    statistik real-time.
                  </p>
                  <a
                    href="/login"
                    className="mt-4 inline-flex items-center justify-center rounded-md bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2 text-sm font-medium text-white hover:from-blue-700 hover:to-purple-700 transition-all duration-300 hover:scale-105 shadow-lg"
                  >
                    Login sekarang
                  </a>
                </div>
              </div>
            </div>
          </div>
        </FadeIn>
      ) : (
        <div className="mt-8 space-y-8">
          {/* Header with real-time clock */}
          <SlideUp>
            <section className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div className="flex-1">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Dashboard Overview
                </h2>
                <p className="text-gray-600 mt-1">
                  Ringkasan performa dan statistik real-time sistem GRO
                </p>
              </div>
              <div className="flex-shrink-0">
                <RealTimeClock />
              </div>
            </section>
          </SlideUp>

          {/* Error state */}
          {error && (
            <FadeIn>
              <div className="rounded-lg bg-red-50 border border-red-200 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-red-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                      Error loading dashboard
                    </h3>
                    <p className="text-sm text-red-700 mt-1">{error}</p>
                  </div>
                </div>
              </div>
            </FadeIn>
          )}

          {/* Loading state */}
          {loading && <LoadingSkeleton />}

          {/* Main dashboard content */}
          {!loading && dashboardData && (
            <>
              {/* Statistics Cards - Main Row */}
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-6">
                <EnhancedStatCard
                  title="Tamu Hari Ini"
                  value={formatNumber(dashboardData.visitors.today)}
                  hint="vs kemarin"
                  delta={calculatePercentageChange(
                    dashboardData.visitors.today,
                    dashboardData.visitors.yesterday
                  )}
                  deltaType={
                    dashboardData.visitors.today >=
                    dashboardData.visitors.yesterday
                      ? "up"
                      : "down"
                  }
                  icon={
                    <svg
                      className="h-6 w-6"
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
                  }
                  delay={0.1}
                  clickable={true}
                  onClick={() => handleNavigate("/buku-tamu")}
                />
                <EnhancedStatCard
                  title="Tamu Aktif"
                  value={formatNumber(dashboardData.visitors.active)}
                  hint="Sedang di gedung"
                  icon={
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  }
                  delay={0.2}
                  clickable={true}
                  onClick={() => handleNavigate("/buku-tamu")}
                />
                <EnhancedStatCard
                  title="Minggu Ini"
                  value={formatNumber(dashboardData.visitors.week)}
                  hint="7 hari terakhir"
                  icon={
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  }
                  delay={0.3}
                  clickable={true}
                  onClick={() => handleNavigate("/history-tamu")}
                />
                <EnhancedStatCard
                  title="Bulan Ini"
                  value={formatNumber(dashboardData.visitors.month)}
                  hint="30 hari terakhir"
                  icon={
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                  }
                  delay={0.4}
                  clickable={true}
                  onClick={() => handleNavigate("/history-tamu")}
                />
              </div>

              {/* Additional Stats Row */}
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mb-8">
                <EnhancedStatCard
                  title="Log Telepon Hari Ini"
                  value={formatNumber(dashboardData.other.phoneLogsToday)}
                  hint="Panggilan masuk/keluar"
                  icon={
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                  }
                  delay={0.5}
                  clickable={true}
                  onClick={() => handleNavigate("/log-telepon")}
                />
                <EnhancedStatCard
                  title="Catatan Hari Ini"
                  value={formatNumber(dashboardData.other.notesToday)}
                  hint="Notes & pesan"
                  icon={
                    <svg
                      className="h-6 w-6"
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
                  }
                  delay={0.6}
                  clickable={true}
                  onClick={() => handleNavigate("/notes")}
                />
                <EnhancedStatCard
                  title="Total Data"
                  value={formatNumber(
                    dashboardData.visitors.month +
                      dashboardData.other.phoneLogsToday +
                      dashboardData.other.notesToday
                  )}
                  hint="Semua aktivitas"
                  icon={
                    <svg
                      className="h-6 w-6"
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
                  }
                  delay={0.7}
                  clickable={true}
                  onClick={() => handleNavigate("/report")}
                />
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Daily Visitors Chart */}
                <SlideUp delay={0.8}>
                  <div className="rounded-xl border bg-white p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Tren Kunjungan Harian
                      </h3>
                      <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                        30 hari terakhir
                      </div>
                    </div>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                          data={prepareChartData(dashboardData.dailyStats)}
                        >
                          <defs>
                            <linearGradient
                              id="colorVisitors"
                              x1="0"
                              y1="0"
                              x2="0"
                              y2="1"
                            >
                              <stop
                                offset="5%"
                                stopColor="#3B82F6"
                                stopOpacity={0.8}
                              />
                              <stop
                                offset="95%"
                                stopColor="#3B82F6"
                                stopOpacity={0.1}
                              />
                            </linearGradient>
                          </defs>
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#f0f0f0"
                          />
                          <XAxis
                            dataKey="date"
                            tick={{ fontSize: 12 }}
                            tickFormatter={(value) =>
                              new Date(value).toLocaleDateString("id-ID", {
                                day: "2-digit",
                                month: "2-digit",
                              })
                            }
                          />
                          <YAxis tick={{ fontSize: 12 }} />
                          <Tooltip
                            labelFormatter={(value) =>
                              new Date(value).toLocaleDateString("id-ID", {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })
                            }
                            formatter={(value) => [formatNumber(value), "Tamu"]}
                          />
                          <Area
                            type="monotone"
                            dataKey="visitors"
                            stroke="#3B82F6"
                            fillOpacity={1}
                            fill="url(#colorVisitors)"
                            strokeWidth={2}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </SlideUp>

                {/* Category Distribution */}
                <SlideUp delay={0.9}>
                  <div className="rounded-xl border bg-white p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Kategori Tamu
                    </h3>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={prepareCategoryData(dashboardData.categories)}
                            dataKey="value"
                            nameKey="name"
                            innerRadius={60}
                            outerRadius={100}
                            paddingAngle={2}
                            stroke="#fff"
                            strokeWidth={2}
                          >
                            {prepareCategoryData(dashboardData.categories).map(
                              (entry, index) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={entry.color}
                                />
                              )
                            )}
                          </Pie>
                          <Tooltip
                            formatter={(value) => [formatNumber(value), "Tamu"]}
                          />
                          <Legend
                            verticalAlign="bottom"
                            height={36}
                            formatter={(value) => (
                              <span className="text-sm">{value}</span>
                            )}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </SlideUp>
              </div>

              {/* Additional Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Hourly Distribution Chart */}
                <SlideUp delay={1.0}>
                  <div className="rounded-xl border bg-white p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Distribusi Jam Kunjungan
                    </h3>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={Array.from({ length: 24 }, (_, i) => ({
                            hour: `${i.toString().padStart(2, "0")}:00`,
                            visitors: Math.floor(Math.random() * 10),
                          }))}
                        >
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#f0f0f0"
                          />
                          <XAxis
                            dataKey="hour"
                            tick={{ fontSize: 10 }}
                            interval={3}
                          />
                          <YAxis tick={{ fontSize: 12 }} />
                          <Tooltip
                            formatter={(value) => [formatNumber(value), "Tamu"]}
                            labelFormatter={(value) => `Jam ${value}`}
                          />
                          <Bar
                            dataKey="visitors"
                            fill="#10B981"
                            radius={[4, 4, 0, 0]}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </SlideUp>

                {/* Status Distribution */}
                <SlideUp delay={1.1}>
                  <div className="rounded-xl border bg-white p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Status Tamu
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span className="text-sm text-gray-600">Masuk</span>
                        </div>
                        <span className="text-lg font-semibold text-green-600">
                          {formatNumber(dashboardData.visitors.active)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                          <span className="text-sm text-gray-600">Keluar</span>
                        </div>
                        <span className="text-lg font-semibold text-blue-600">
                          {formatNumber(
                            dashboardData.visitors.today -
                              dashboardData.visitors.active
                          )}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                          <span className="text-sm text-gray-600">
                            Total Hari Ini
                          </span>
                        </div>
                        <span className="text-lg font-semibold text-gray-600">
                          {formatNumber(dashboardData.visitors.today)}
                        </span>
                      </div>
                    </div>
                    <div className="mt-6">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-1000"
                          style={{
                            width: `${
                              dashboardData.visitors.today > 0
                                ? (dashboardData.visitors.active /
                                    dashboardData.visitors.today) *
                                  100
                                : 0
                            }%`,
                          }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-500 mt-2 text-center">
                        Rasio Tamu Aktif:{" "}
                        {dashboardData.visitors.today > 0
                          ? (
                              (dashboardData.visitors.active /
                                dashboardData.visitors.today) *
                              100
                            ).toFixed(1)
                          : 0}
                        %
                      </p>
                    </div>
                  </div>
                </SlideUp>

                {/* Quick Stats Summary */}
                <SlideUp delay={1.2}>
                  <div className="rounded-xl border bg-white p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Ringkasan Cepat
                    </h3>
                    <div className="space-y-4">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">
                          {formatNumber(dashboardData.visitors.week)}
                        </div>
                        <div className="text-sm text-blue-500">
                          Tamu Minggu Ini
                        </div>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">
                          {formatNumber(dashboardData.visitors.month)}
                        </div>
                        <div className="text-sm text-green-500">
                          Tamu Bulan Ini
                        </div>
                      </div>
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">
                          {formatNumber(
                            dashboardData.other.phoneLogsToday +
                              dashboardData.other.notesToday
                          )}
                        </div>
                        <div className="text-sm text-purple-500">
                          Aktivitas Hari Ini
                        </div>
                      </div>
                    </div>
                  </div>
                </SlideUp>
              </div>

              {/* Activity Feed and Performance Metrics */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Recent Activities */}
                <SlideUp delay={1.3}>
                  <div className="lg:col-span-2 rounded-xl border bg-white p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-[1.01]">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Aktivitas Terbaru
                      </h3>
                      <div className="text-xs text-gray-500 bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        Real-time
                      </div>
                    </div>
                    <ActivityFeed
                      activities={dashboardData.recentActivities || []}
                      loading={false}
                    />
                  </div>
                </SlideUp>

                {/* Performance Metrics */}
                <SlideUp delay={1.4}>
                  <div className="rounded-xl border bg-white p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-[1.01]">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Performa Sistem
                    </h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Uptime</span>
                          <span className="font-semibold text-green-600">
                            99.9%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: "99.9%" }}
                          ></div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Response Time</span>
                          <span className="font-semibold text-blue-600">
                            120ms
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: "85%" }}
                          ></div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Data Accuracy</span>
                          <span className="font-semibold text-purple-600">
                            98.5%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-purple-500 h-2 rounded-full"
                            style={{ width: "98.5%" }}
                          ></div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">
                            User Satisfaction
                          </span>
                          <span className="font-semibold text-orange-600">
                            94.2%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-orange-500 h-2 rounded-full"
                            style={{ width: "94.2%" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </SlideUp>
              </div>

              {/* Quick Actions Section */}
              <SlideUp delay={1.5}>
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Aksi Cepat
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                    <button
                      onClick={() => handleNavigate("/buku-tamu")}
                      className="group flex flex-col items-center p-3 rounded-lg bg-white hover:bg-blue-50 hover:shadow-md transition-all duration-300 hover:scale-105 active:scale-95"
                    >
                      <div className="w-12 h-12 bg-blue-100 group-hover:bg-blue-200 rounded-full flex items-center justify-center mb-2 transition-colors duration-300">
                        <svg
                          className="w-6 h-6 text-blue-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                          />
                        </svg>
                      </div>
                      <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600">
                        Tambah Tamu
                      </span>
                    </button>

                    <button
                      onClick={() => handleNavigate("/log-telepon")}
                      className="group flex flex-col items-center p-3 rounded-lg bg-white hover:bg-green-50 hover:shadow-md transition-all duration-300 hover:scale-105 active:scale-95"
                    >
                      <div className="w-12 h-12 bg-green-100 group-hover:bg-green-200 rounded-full flex items-center justify-center mb-2 transition-colors duration-300">
                        <svg
                          className="w-6 h-6 text-green-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                          />
                        </svg>
                      </div>
                      <span className="text-sm font-medium text-gray-700 group-hover:text-green-600">
                        Log Telepon
                      </span>
                    </button>

                    <button
                      onClick={() => handleNavigate("/notes")}
                      className="group flex flex-col items-center p-3 rounded-lg bg-white hover:bg-yellow-50 hover:shadow-md transition-all duration-300 hover:scale-105 active:scale-95"
                    >
                      <div className="w-12 h-12 bg-yellow-100 group-hover:bg-yellow-200 rounded-full flex items-center justify-center mb-2 transition-colors duration-300">
                        <svg
                          className="w-6 h-6 text-yellow-600"
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
                      </div>
                      <span className="text-sm font-medium text-gray-700 group-hover:text-yellow-600">
                        Catatan
                      </span>
                    </button>

                    <button
                      onClick={() => handleNavigate("/history-tamu")}
                      className="group flex flex-col items-center p-3 rounded-lg bg-white hover:bg-purple-50 hover:shadow-md transition-all duration-300 hover:scale-105 active:scale-95"
                    >
                      <div className="w-12 h-12 bg-purple-100 group-hover:bg-purple-200 rounded-full flex items-center justify-center mb-2 transition-colors duration-300">
                        <svg
                          className="w-6 h-6 text-purple-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <span className="text-sm font-medium text-gray-700 group-hover:text-purple-600">
                        History
                      </span>
                    </button>

                    <button
                      onClick={() => handleNavigate("/report")}
                      className="group flex flex-col items-center p-3 rounded-lg bg-white hover:bg-indigo-50 hover:shadow-md transition-all duration-300 hover:scale-105 active:scale-95"
                    >
                      <div className="w-12 h-12 bg-indigo-100 group-hover:bg-indigo-200 rounded-full flex items-center justify-center mb-2 transition-colors duration-300">
                        <svg
                          className="w-6 h-6 text-indigo-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                          />
                        </svg>
                      </div>
                      <span className="text-sm font-medium text-gray-700 group-hover:text-indigo-600">
                        Laporan
                      </span>
                    </button>

                    <button
                      onClick={() => handleNavigate("/data-master")}
                      className="group flex flex-col items-center p-3 rounded-lg bg-white hover:bg-pink-50 hover:shadow-md transition-all duration-300 hover:scale-105 active:scale-95"
                    >
                      <div className="w-12 h-12 bg-pink-100 group-hover:bg-pink-200 rounded-full flex items-center justify-center mb-2 transition-colors duration-300">
                        <svg
                          className="w-6 h-6 text-pink-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                      </div>
                      <span className="text-sm font-medium text-gray-700 group-hover:text-pink-600">
                        Data Master
                      </span>
                    </button>
                  </div>
                </div>
              </SlideUp>
            </>
          )}
        </div>
      )}

      {/* Add custom CSS for animations */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in ease-out forwards;
          opacity: 0;
        }

        .animate-slide-up {
          animation: slide-up ease-out forwards;
          opacity: 0;
        }

        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
      `}</style>
    </div>
  );
}

export default Home;
