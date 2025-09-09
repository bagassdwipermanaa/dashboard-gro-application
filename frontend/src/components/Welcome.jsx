import { useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function Sparkles() {
  return (
    <svg
      className="absolute inset-0 w-full h-full"
      viewBox="0 0 600 300"
      preserveAspectRatio="none"
      aria-hidden
    >
      <defs>
        <radialGradient id="g" cx="50%" cy="50%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
      </defs>
      {Array.from({ length: 18 }).map((_, i) => (
        <circle
          key={i}
          cx={(i * 33) % 600}
          cy={(i * 71) % 300}
          r="22"
          fill="url(#g)"
          className="animate-pulse"
        />
      ))}
    </svg>
  );
}

function Welcome() {
  const navigate = useNavigate();
  const location = useLocation();
  const type = (location.state && location.state.type) || "first"; // 'first' | 'login' | 'logout'

  const config = useMemo(() => {
    if (type === "login") {
      return {
        title: "Selamat datang kembali",
        subtitle: "Login berhasil. Menyiapkan dashboard...",
        duration: 1400,
        accentClass: "from-emerald-400/40",
      };
    }
    if (type === "logout") {
      return {
        title: "Sampai jumpa",
        subtitle: "Anda telah logout. Mengarahkan ke beranda...",
        duration: 1200,
        accentClass: "from-sky-400/40",
      };
    }
    return {
      title: "Selamat datang di Dashboard GRO",
      subtitle: "Memuat pengalaman terbaik untukmu...",
      duration: 1800,
      accentClass: "from-fuchsia-400/40",
    };
  }, [type]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const redirect = (location.state && location.state.next) || "/";
      navigate(redirect, { replace: true });
    }, config.duration);
    return () => clearTimeout(timeout);
  }, [navigate, location.state, config.duration]);

  return (
    <div className="fixed inset-0 z-[120] text-white flex items-center justify-center overflow-hidden bg-gray-900">
      <div
        className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${config.accentClass} via-transparent to-transparent`}
      />
      <div className="absolute inset-0 opacity-20">
        <Sparkles />
      </div>
      <div className="relative text-center px-6">
        <div className="inline-flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-white/10 flex items-center justify-center animate-scale-in">
            <div className="h-5 w-5 rounded bg-white" />
          </div>
          <div className="text-left">
            <div className="text-xs uppercase tracking-widest text-gray-300">
              {type === "logout"
                ? "Logout"
                : type === "login"
                ? "Login"
                : "Welcome"}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              {config.title}
            </h1>
          </div>
        </div>
        <p className="mt-3 text-gray-300">{config.subtitle}</p>
        <div className="mt-6 h-1 w-64 mx-auto bg-white/20 rounded-full overflow-hidden">
          <div className="h-full w-2/3 bg-white rounded-full animate-progress" />
        </div>
      </div>
    </div>
  );
}

export default Welcome;
