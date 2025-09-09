import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import { ToastProvider } from "./Toast";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Footer from "./Footer";

function WithWelcome() {
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    const isFirstVisit = !sessionStorage.getItem("firstVisitShown");
    const onWelcomePage = location.pathname === "/welcome";
    if (isFirstVisit && !onWelcomePage) {
      sessionStorage.setItem("firstVisitShown", "1");
      navigate("/welcome", {
        state: { type: "first", next: location.pathname || "/" },
      });
    }
  }, [location, navigate]);
  return (
    <div className="min-h-dvh flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-8">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
}

function Layout() {
  return (
    <ToastProvider>
      <WithWelcome />
    </ToastProvider>
  );
}

export default Layout;
