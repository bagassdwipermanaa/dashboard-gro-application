import { useAuth } from "../auth/AuthContext";
import { useUi } from "../contexts/UiContext";

function Settings() {
  const { user } = useAuth();
  const { theme, setTheme, lang, setLang, t } = useUi();
  return (
    <section className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">{t("settings")}</h1>
        <p className="text-gray-600">{t("app_prefs")}</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border divide-y">
        <div className="p-6">
          <h3 className="font-semibold mb-1">{t("account_info")}</h3>
          <p className="text-sm text-gray-600 mb-4">
            Ringkasan akun yang sedang login.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="text-xs uppercase text-gray-500">Username</div>
              <div className="font-medium">{user?.username || "-"}</div>
            </div>
            <div>
              <div className="text-xs uppercase text-gray-500">Nama</div>
              <div className="font-medium">{user?.name || "-"}</div>
            </div>
            <div>
              <div className="text-xs uppercase text-gray-500">
                Role/Jabatan
              </div>
              <div className="font-medium">{user?.role || "-"}</div>
            </div>
            <div>
              <div className="text-xs uppercase text-gray-500">Tipe User</div>
              <div className="font-medium">
                {(
                  user?.userType ||
                  (user?.username === "admin" ? "admin" : "gro")
                ).toUpperCase()}
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <h3 className="font-semibold mb-2">{t("theme")}</h3>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setTheme("light")}
                className={`px-3 py-1.5 rounded-md border ${
                  theme === "light"
                    ? "bg-gray-900 text-white border-gray-900"
                    : "bg-white"
                }`}
              >
                {t("light")}
              </button>
              <button
                type="button"
                onClick={() => setTheme("dark")}
                className={`px-3 py-1.5 rounded-md border ${
                  theme === "dark"
                    ? "bg-gray-900 text-white border-gray-900"
                    : "bg-white"
                }`}
              >
                {t("dark")}
              </button>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">{t("language")}</h3>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setLang("id")}
                className={`px-3 py-1.5 rounded-md border ${
                  lang === "id"
                    ? "bg-gray-900 text-white border-gray-900"
                    : "bg-white"
                }`}
              >
                {t("indonesian")}
              </button>
              <button
                type="button"
                onClick={() => setLang("en")}
                className={`px-3 py-1.5 rounded-md border ${
                  lang === "en"
                    ? "bg-gray-900 text-white border-gray-900"
                    : "bg-white"
                }`}
              >
                {t("english")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Settings;
