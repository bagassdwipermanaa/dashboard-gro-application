import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./components/Home";
import Reports from "./components/Reports";
import Settings from "./components/Settings";
import Login from "./components/Login";
import { AuthProvider } from "./auth/AuthContext";
import BukuTamu from "./components/BukuTamu";
import Welcome from "./components/Welcome";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route path="welcome" element={<Welcome />} />
            <Route index element={<Home />} />
            <Route path="buku-tamu" element={<BukuTamu />} />
            <Route path="reports" element={<Reports />} />
            <Route path="settings" element={<Settings />} />
            <Route path="login" element={<Login />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
