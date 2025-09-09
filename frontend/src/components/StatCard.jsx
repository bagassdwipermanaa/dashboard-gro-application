function StatCard({ title, value, hint }) {
  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm hover:shadow transition-shadow">
      <div className="text-sm text-gray-500">{title}</div>
      <div className="mt-1 text-2xl font-semibold">{value}</div>
      {hint ? <div className="mt-1 text-xs text-gray-500">{hint}</div> : null}
    </div>
  );
}

export default StatCard;
