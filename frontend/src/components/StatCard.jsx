function StatCard({
  title,
  value,
  hint,
  icon,
  delta,
  deltaType = "neutral",
  loading = false,
  delay = 0,
}) {
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
    <div
      className="group rounded-xl border bg-white p-5 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-105 hover:border-blue-200"
      style={{
        animationDelay: `${delay}s`,
        animation: "slideUp 0.8s ease-out forwards",
        opacity: 0,
      }}
    >
      <div className="flex items-start justify-between">
        <div className="text-sm text-gray-500 font-medium">{title}</div>
        {icon ? (
          <div className="text-gray-400 group-hover:text-blue-500 transition-colors duration-300">
            {icon}
          </div>
        ) : null}
      </div>
      <div className="mt-1 flex items-baseline gap-2">
        <div className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
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
    </div>
  );
}

export default StatCard;
