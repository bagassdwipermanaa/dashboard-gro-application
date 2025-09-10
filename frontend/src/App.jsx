import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./components/Home";
import Reports from "./components/Reports";
import Settings from "./components/Settings";
import Login from "./components/Login";
import { AuthProvider } from "./auth/AuthContext";
import BukuTamu from "./components/BukuTamu";
import HistoryTamu from "./components/HistoryTamu";
import TambahTamu from "./components/TambahTamu";
import EditTamu from "./components/EditTamu";
import LogTelepon from "./components/LogTelepon";
import TambahLogTelepon from "./components/TambahLogTelepon";
import EditLogTelepon from "./components/EditLogTelepon";
import Notes from "./components/Notes";
import TambahNotes from "./components/TambahNotes";
import EditNotes from "./components/EditNotes";
import List from "./components/List";
import TambahBukuTeleponTamu from "./components/TambahBukuTeleponTamu";
import TambahBukuTeleponInternal from "./components/TambahBukuTeleponInternal";
import EditBukuTeleponTamu from "./components/EditBukuTeleponTamu";
import EditBukuTeleponInternal from "./components/EditBukuTeleponInternal";
import Welcome from "./components/Welcome";
import DaftarPejabat from "./components/DaftarPejabat";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route path="welcome" element={<Welcome />} />
            <Route index element={<Home />} />
            <Route path="buku-tamu" element={<BukuTamu />} />
            <Route path="buku-tamu/tambah" element={<TambahTamu />} />
            <Route path="buku-tamu/edit/:id" element={<EditTamu />} />
            <Route path="history-tamu" element={<HistoryTamu />} />
            <Route path="log-telepon" element={<LogTelepon />} />
            <Route path="log-telepon/tambah" element={<TambahLogTelepon />} />
            <Route path="log-telepon/edit/:id" element={<EditLogTelepon />} />
            <Route path="notes" element={<Notes />} />
            <Route path="notes/tambah" element={<TambahNotes />} />
            <Route path="notes/edit/:id" element={<EditNotes />} />
            <Route path="list" element={<List />} />
            <Route
              path="list/tamu/tambah"
              element={<TambahBukuTeleponTamu />}
            />
            <Route
              path="list/internal/tambah"
              element={<TambahBukuTeleponInternal />}
            />
            <Route
              path="list/tamu/edit/:id"
              element={<EditBukuTeleponTamu />}
            />
            <Route
              path="list/internal/edit/:id"
              element={<EditBukuTeleponInternal />}
            />
            <Route path="reports" element={<Reports />} />
            <Route path="master/pejabat" element={<DaftarPejabat />} />
            <Route path="settings" element={<Settings />} />
            <Route path="login" element={<Login />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
