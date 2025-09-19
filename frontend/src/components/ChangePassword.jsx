import { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { useToast } from "./Toast";

function ChangePassword() {
  const { user } = useAuth();
  const { show: showToast } = useToast();
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validasi form
      if (
        !formData.oldPassword ||
        !formData.newPassword ||
        !formData.confirmPassword
      ) {
        showToast("Semua field harus diisi", "error");
        return;
      }

      if (formData.newPassword !== formData.confirmPassword) {
        showToast("Password baru dan konfirmasi password tidak sama", "error");
        return;
      }

      if (formData.newPassword.length < 6) {
        showToast("Password baru minimal 6 karakter", "error");
        return;
      }

      // Use userType from database login response
      const userType =
        user.userType || (user.username === "admin" ? "admin" : "gro");

      const response = await fetch(
        "http://localhost:8004/api/auth/update-password",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: user.username,
            oldPassword: formData.oldPassword,
            newPassword: formData.newPassword,
            userType: userType,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        showToast("Password berhasil diupdate", "success");
        setFormData({
          oldPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        showToast(data.message || "Gagal mengupdate password", "error");
      }
    } catch (error) {
      console.error("Error updating password:", error);
      showToast("Terjadi kesalahan saat mengupdate password", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Rubah Password</h1>
        <p className="text-gray-600">
          Perbarui kata sandi akun Anda dengan aman.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Username
              </label>
              <input
                type="text"
                value={user?.username || ""}
                disabled
                className="w-full rounded-md border bg-gray-50 text-gray-500 px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Tipe User
              </label>
              <input
                type="text"
                value={(
                  user?.userType ||
                  (user?.username === "admin" ? "admin" : "gro")
                ).toUpperCase()}
                disabled
                className="w-full rounded-md border bg-gray-50 text-gray-500 px-3 py-2"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Password Lama
              </label>
              <div className="relative">
                <input
                  type="password"
                  name="oldPassword"
                  value={formData.oldPassword}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-md border px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-gray-300"
                  placeholder="Masukkan password lama"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Password Baru
              </label>
              <div className="relative">
                <input
                  type="password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-md border px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-gray-300"
                  placeholder="Minimal 6 karakter"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Gunakan kombinasi huruf dan angka untuk keamanan lebih baik.
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Ulangi Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
              className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-300"
              placeholder="Ulangi password baru"
            />
          </div>

          <div className="pt-2 flex items-center justify-between">
            <span className="text-xs text-gray-500">
              Perubahan akan berlaku saat tombol Update ditekan.
            </span>
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center gap-2 rounded-md bg-gray-900 text-white px-4 py-2 hover:bg-gray-800 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Mengupdate..." : "Update"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

export default ChangePassword;
