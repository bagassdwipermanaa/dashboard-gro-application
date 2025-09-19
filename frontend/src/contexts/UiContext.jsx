/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState } from "react";

const UiContext = createContext(null);

// Keep keys internal to avoid non-component exports that break fast refresh
const THEME_KEY = "ui.theme";
const LANG_KEY = "ui.lang";

export function UiProvider({ children }) {
  const [theme, setTheme] = useState(
    () => localStorage.getItem(THEME_KEY) || "light"
  );
  const [lang, setLang] = useState(
    () => localStorage.getItem(LANG_KEY) || "id"
  );

  useEffect(() => {
    localStorage.setItem(THEME_KEY, theme);
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  useEffect(() => {
    localStorage.setItem(LANG_KEY, lang);
  }, [lang]);

  const t = useMemo(() => {
    const dict = {
      id: {
        settings: "Pengaturan",
        app_prefs: "Preferensi dasar aplikasi Anda.",
        account_info: "Informasi Akun",
        theme: "Tema",
        language: "Bahasa",
        light: "Terang",
        dark: "Gelap",
        indonesian: "Indonesia",
        english: "Inggris",
        save: "Simpan",
      },
      en: {
        settings: "Settings",
        app_prefs: "Basic preferences for your app.",
        account_info: "Account Information",
        theme: "Theme",
        language: "Language",
        light: "Light",
        dark: "Dark",
        indonesian: "Indonesian",
        english: "English",
        save: "Save",
      },
    };
    return (key) => dict[lang]?.[key] ?? key;
  }, [lang]);

  const value = useMemo(
    () => ({ theme, setTheme, lang, setLang, t }),
    [theme, lang, t]
  );

  return <UiContext.Provider value={value}>{children}</UiContext.Provider>;
}

export function useUi() {
  const ctx = useContext(UiContext);
  if (!ctx) throw new Error("useUi must be used within UiProvider");
  return ctx;
}
