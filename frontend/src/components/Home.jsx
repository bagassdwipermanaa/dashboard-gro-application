import Hero from "./Hero";
import StatCard from "./StatCard";

function Home() {
  return (
    <div>
      <Hero />
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Active Users" value="1,245" hint="Today" />
        <StatCard title="Open Tickets" value="32" hint="Across teams" />
        <StatCard title="Conversion" value="4.8%" hint="Last 24h" />
        <StatCard title="Revenue" value="$12,430" hint="MTD" />
      </div>
    </div>
  );
}

export default Home;
