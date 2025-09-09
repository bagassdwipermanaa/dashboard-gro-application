function StatCard({ title, value, hint, icon, delta, deltaType = "neutral" }) {
  const deltaColor =
    deltaType === "up"
      ? "text-emerald-600"
      : deltaType === "down"
      ? "text-red-600"
      : "text-gray-500";

  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="text-sm text-gray-500">{title}</div>
        {icon ? <div className="text-gray-400">{icon}</div> : null}
      </div>
      <div className="mt-1 flex items-baseline gap-2">
        <div className="text-2xl font-semibold">{value}</div>
        {delta ? (
          <span className={`text-xs font-medium ${deltaColor}`}>{delta}</span>
        ) : null}
      </div>
      {hint ? <div className="mt-1 text-xs text-gray-500">{hint}</div> : null}
    </div>
  );
}

export default StatCard;
