import { useMemo } from "react";
import { useAuth } from "../auth/AuthContext";

function Profile() {
  const { user } = useAuth();

  const items = useMemo(
    () => [
      { label: "Username", value: user?.username ?? "-" },
      { label: "Nama", value: user?.name ?? "-" },
      { label: "Role/Jabatan", value: user?.role ?? "-" },
      {
        label: "Tipe User",
        value: (
          user?.userType || (user?.username === "admin" ? "admin" : "gro")
        ).toUpperCase(),
      },
    ],
    [user]
  );

  return (
    <section className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Profil</h1>
        <p className="text-gray-600">Detail akun yang sedang login.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {items.map((it) => (
            <div key={it.label} className="space-y-1">
              <div className="text-xs uppercase tracking-wide text-gray-500">
                {it.label}
              </div>
              <div className="text-gray-900 font-medium break-words">
                {it.value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Profile;
