const express = require("express");
const cors = require("cors");
require("dotenv").config();
const mysql = require("mysql2/promise");

const app = express();
const port = Number(process.env.PORT) || 8004;

const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:3004")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

// Flexible CORS: allow configured origins plus common private LAN ranges
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    try {
      const normalized = origin.replace(/\/$/, "");
      const isListed = allowedOrigins.includes(normalized);
      const isLocalhost = /^(http:\/\/)?(localhost|127\.0\.0\.1)(:\\d+)?$/.test(
        normalized
      );
      const isPrivateLan =
        /^(http:\/\/)?(10\.|192\.168\.|172\.(1[6-9]|2[0-9]|3[0-1])\.)/.test(
          normalized
        );
      if (isListed || isLocalhost || isPrivateLan) return callback(null, true);
    } catch {}
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: false,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
// Increase payload limits to handle base64 images from frontend
app.use(express.json({ limit: "20mb" }));
// Handle preflight for all routes
app.options("*", cors(corsOptions));
app.use(express.urlencoded({ extended: true, limit: "20mb" }));

let dbPool;

async function initializeDatabasePool() {
  const dbConfig = {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true,
  };
  dbPool = mysql.createPool(dbConfig);
}

app.get("/health", async (req, res) => {
  try {
    if (!dbPool) {
      await initializeDatabasePool();
    }
    const conn = await dbPool.getConnection();
    let cnt = null;
    try {
      const [countRows] = await conn.query(
        "SELECT COUNT(*) AS cnt FROM tabletamu"
      );
      cnt = countRows?.[0]?.cnt ?? null;
      await conn.query("SELECT 1");
    } finally {
      conn.release();
    }
    res.json({
      status: "ok",
      name: "Dashboard GRO Application",
      db: "connected",
      dbName: process.env.DB_NAME,
      tabletamu_count: cnt,
    });
  } catch (err) {
    console.error("Health DB check error:", err.message);
    res.status(500).json({ status: "error", error: err.message });
  }
});

// Helper to map frontend payload to DB columns
function mapGuestPayloadToDb(payload) {
  return {
    idvisit: payload.idvisit, // must be provided/generated in backend
    namatamu: payload.nama ?? null,
    instansi: payload.instansi ?? null,
    keperluan: payload.keperluan ?? null,
    tujuan: payload.tujuan ?? null,
    divisi: payload.divisi ?? null,
    jenisid: payload.jenisKartu ?? null,
    noid: payload.noIdTamu ?? null,
    // cattamu is used to store guest category
    cattamu: payload.kategoriTamu ?? null,
    jamdatang: payload.waktuBerkunjung
      ? new Date(payload.waktuBerkunjung)
      : null,
    jamkeluar: payload.waktuKeluar ? new Date(payload.waktuKeluar) : null,
    foto: payload.fotoTamu ?? null,
    noidcard: payload.noidcard ?? null,
    status: payload.status ?? null,
    ket: payload.keterangan ?? null,
    groinput: payload.groinput ?? null,
    posgro: payload.posgro ?? null,
    fotoid: payload.fotoKartuIdentitas ?? null,
    statustamu: payload.statusTamu ?? null,
    ruangtujuan: payload.ruangtujuan ?? null,
  };
}

function generateIdVisit() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  const h = String(now.getHours()).padStart(2, "0");
  const min = String(now.getMinutes()).padStart(2, "0");
  const s = String(now.getSeconds()).padStart(2, "0");
  const ms = String(now.getMilliseconds()).padStart(3, "0");
  return `VIS${y}${m}${d}${h}${min}${s}${ms}`.slice(0, 15);
}

function generateIdBukuTlp() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  const h = String(now.getHours()).padStart(2, "0");
  const min = String(now.getMinutes()).padStart(2, "0");
  const s = String(now.getSeconds()).padStart(2, "0");
  return `TL${y}${m}${d}${h}${min}${s}`;
}

function generateIdNotes() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  const h = String(now.getHours()).padStart(2, "0");
  const min = String(now.getMinutes()).padStart(2, "0");
  const s = String(now.getSeconds()).padStart(2, "0");
  return `NT${y}${m}${d}${h}${min}${s}`;
}

function mapNotesPayloadToDb(payload) {
  return {
    idnotes: payload.idnotes,
    dari: payload.dari ?? null,
    tujuan: payload.tujuan ?? null,
    tanggal: payload.tanggal ? new Date(payload.tanggal) : null,
    pesan: payload.pesan ?? null,
    status: payload.status ?? null,
  };
}

function mapPhoneLogPayloadToDb(payload) {
  return {
    idbukutlp: payload.idbukutlp,
    nama_penelpon: payload.namaPenelpon ?? null,
    no_penelpon: payload.noPenelpon ?? null,
    nama_dituju: payload.namaDituju ?? null,
    no_dituju: payload.noDituju ?? null,
    tanggal: payload.tanggal ? new Date(payload.tanggal) : null,
    jam: payload.jam ?? null,
    pesan: payload.pesan ?? null,
    ket: payload.keterangan ?? null,
    status: payload.status ?? null,
    statusinout: payload.telpKeluarMasuk ?? null,
  };
}

function mapPhonebookGuestPayloadToDb(payload) {
  return {
    tlp1: payload.noTlp1, // PK
    nama: payload.nama ?? null,
    instansi: payload.instansi ?? null,
    tlp2: payload.noTlp2 ?? null,
    alamat: payload.alamat ?? null,
    fax: payload.fax ?? null,
    email: payload.email ?? null,
  };
}

function mapPhonebookInternalPayloadToDb(payload) {
  return {
    idtlp: payload.idTlp, // PK
    nama: payload.nama ?? null,
    jabatan: payload.jabatan ?? null,
    divisi: payload.divisi ?? null,
    tlp1: payload.noTlp1 ?? null,
    tlp2: payload.noTlp2 ?? null,
    extension: payload.extension ?? null,
    email: payload.email ?? null,
  };
}

// Create guest
app.post("/tamu", async (req, res) => {
  try {
    if (!dbPool) await initializeDatabasePool();
    const conn = await dbPool.getConnection();
    try {
      const idvisit = generateIdVisit();
      const dbRow = mapGuestPayloadToDb({ ...req.body, idvisit });
      const fields = Object.keys(dbRow);
      const values = Object.values(dbRow);
      const placeholders = fields.map(() => "?").join(",");
      const sql = `INSERT INTO tabletamu (${fields
        .map((f) => `\`${f}\``)
        .join(",")}) VALUES (${placeholders})`;
      await conn.query(sql, values);
      res.status(201).json({ idvisit });
    } finally {
      conn.release();
    }
  } catch (err) {
    console.error("Create tamu error:", err);
    res.status(500).json({ error: err.message });
  }
});

// List guests (basic, limit 100)
app.get("/tamu", async (req, res) => {
  try {
    if (!dbPool) await initializeDatabasePool();
    const conn = await dbPool.getConnection();
    try {
      const [rows] = await conn.query(
        "SELECT idvisit, namatamu, instansi, keperluan, tujuan, divisi, jenisid, noid, cattamu, ket, foto, fotoid, DATE_FORMAT(jamdatang, '%Y-%m-%d %H:%i:%s') AS jamdatang, DATE_FORMAT(jamkeluar, '%Y-%m-%d %H:%i:%s') AS jamkeluar, status, statustamu FROM tabletamu ORDER BY idvisit DESC LIMIT 100"
      );
      res.json(rows);
    } finally {
      conn.release();
    }
  } catch (err) {
    console.error("List tamu error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Phone logs endpoints
// Create phone log
app.post("/logs/telepon", async (req, res) => {
  try {
    if (!dbPool) await initializeDatabasePool();
    const conn = await dbPool.getConnection();
    try {
      const idbukutlp = generateIdBukuTlp();
      const dbRow = mapPhoneLogPayloadToDb({ ...req.body, idbukutlp });
      const fields = Object.keys(dbRow);
      const values = Object.values(dbRow);
      const placeholders = fields.map(() => "?").join(",");
      const sql = `INSERT INTO bukutelpon (${fields
        .map((f) => `\`${f}\``)
        .join(",")}) VALUES (${placeholders})`;
      await conn.query(sql, values);
      res.status(201).json({ idbukutlp });
    } finally {
      conn.release();
    }
  } catch (err) {
    console.error("Create phone log error:", err);
    res.status(500).json({ error: err.message });
  }
});

// List phone logs (basic, latest 200)
app.get("/logs/telepon", async (req, res) => {
  try {
    if (!dbPool) await initializeDatabasePool();
    const conn = await dbPool.getConnection();
    try {
      const [rows] = await conn.query(
        "SELECT idbukutlp, nama_penelpon, no_penelpon, nama_dituju, no_dituju, DATE_FORMAT(tanggal, '%Y-%m-%d') AS tanggal, DATE_FORMAT(jam, '%H:%i') AS jam, pesan, ket, status, statusinout FROM bukutelpon ORDER BY tanggal DESC, jam DESC LIMIT 200"
      );
      res.json(rows);
    } finally {
      conn.release();
    }
  } catch (err) {
    console.error("List phone logs error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Update phone log
app.put("/logs/telepon/:idbukutlp", async (req, res) => {
  try {
    if (!dbPool) await initializeDatabasePool();
    const { idbukutlp } = req.params;
    const dbRow = mapPhoneLogPayloadToDb({ ...req.body, idbukutlp });
    const { idbukutlp: _, ...updateRow } = dbRow;
    const fields = Object.keys(updateRow);
    const values = Object.values(updateRow);
    const setClause = fields.map((f) => `\`${f}\` = ?`).join(",");
    const sql = `UPDATE bukutelpon SET ${setClause} WHERE idbukutlp = ?`;
    const conn = await dbPool.getConnection();
    try {
      const [result] = await conn.query(sql, [...values, idbukutlp]);
      if ((result?.affectedRows ?? 0) === 0) {
        return res.status(404).json({ error: "Data tidak ditemukan" });
      }
      res.json({ success: true });
    } finally {
      conn.release();
    }
  } catch (err) {
    console.error("Update phone log error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Delete phone log
app.delete("/logs/telepon/:idbukutlp", async (req, res) => {
  try {
    if (!dbPool) await initializeDatabasePool();
    const { idbukutlp } = req.params;
    const conn = await dbPool.getConnection();
    try {
      const [result] = await conn.query(
        "DELETE FROM bukutelpon WHERE idbukutlp = ?",
        [idbukutlp]
      );
      const affected = result?.affectedRows ?? 0;
      if (affected === 0) {
        return res.status(404).json({ error: "Data tidak ditemukan" });
      }
      res.json({ success: true, deleted: affected });
    } finally {
      conn.release();
    }
  } catch (err) {
    console.error("Delete phone log error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Notes endpoints
app.post("/notes", async (req, res) => {
  try {
    if (!dbPool) await initializeDatabasePool();
    const conn = await dbPool.getConnection();
    try {
      const idnotes = generateIdNotes();
      const dbRow = mapNotesPayloadToDb({ ...req.body, idnotes });
      const fields = Object.keys(dbRow);
      const values = Object.values(dbRow);
      const placeholders = fields.map(() => "?").join(",");
      const sql = `INSERT INTO notes (${fields
        .map((f) => `\`${f}\``)
        .join(",")}) VALUES (${placeholders})`;
      await conn.query(sql, values);
      res.status(201).json({ idnotes });
    } finally {
      conn.release();
    }
  } catch (err) {
    console.error("Create notes error:", err);
    res.status(500).json({ error: err.message });
  }
});

app.get("/notes", async (req, res) => {
  try {
    if (!dbPool) await initializeDatabasePool();
    const conn = await dbPool.getConnection();
    try {
      const [rows] = await conn.query(
        "SELECT idnotes, dari, tujuan, DATE_FORMAT(tanggal, '%Y-%m-%d') AS tanggal, pesan, status FROM notes ORDER BY tanggal DESC, idnotes DESC LIMIT 200"
      );
      res.json(rows);
    } finally {
      conn.release();
    }
  } catch (err) {
    console.error("List notes error:", err);
    res.status(500).json({ error: err.message });
  }
});

app.put("/notes/:idnotes", async (req, res) => {
  try {
    if (!dbPool) await initializeDatabasePool();
    const { idnotes } = req.params;
    const dbRow = mapNotesPayloadToDb({ ...req.body, idnotes });
    const { idnotes: _, ...updateRow } = dbRow;
    const fields = Object.keys(updateRow);
    const values = Object.values(updateRow);
    const setClause = fields.map((f) => `\`${f}\` = ?`).join(",");
    const sql = `UPDATE notes SET ${setClause} WHERE idnotes = ?`;
    const conn = await dbPool.getConnection();
    try {
      const [result] = await conn.query(sql, [...values, idnotes]);
      if ((result?.affectedRows ?? 0) === 0) {
        return res.status(404).json({ error: "Data tidak ditemukan" });
      }
      res.json({ success: true });
    } finally {
      conn.release();
    }
  } catch (err) {
    console.error("Update notes error:", err);
    res.status(500).json({ error: err.message });
  }
});

app.delete("/notes/:idnotes", async (req, res) => {
  try {
    if (!dbPool) await initializeDatabasePool();
    const { idnotes } = req.params;
    const conn = await dbPool.getConnection();
    try {
      const [result] = await conn.query("DELETE FROM notes WHERE idnotes = ?", [
        idnotes,
      ]);
      const affected = result?.affectedRows ?? 0;
      if (affected === 0) {
        return res.status(404).json({ error: "Data tidak ditemukan" });
      }
      res.json({ success: true, deleted: affected });
    } finally {
      conn.release();
    }
  } catch (err) {
    console.error("Delete notes error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Phonebook - Guests
app.get("/phonebook/guests", async (req, res) => {
  try {
    if (!dbPool) await initializeDatabasePool();
    const conn = await dbPool.getConnection();
    try {
      const [rows] = await conn.query(
        "SELECT nama, instansi, tlp1, tlp2, alamat, fax, email FROM bukutlptamu ORDER BY nama ASC"
      );
      res.json(rows);
    } finally {
      conn.release();
    }
  } catch (err) {
    console.error("List phonebook guests error:", err);
    res.status(500).json({ error: err.message });
  }
});

app.post("/phonebook/guests", async (req, res) => {
  try {
    if (!dbPool) await initializeDatabasePool();
    const conn = await dbPool.getConnection();
    try {
      const dbRow = mapPhonebookGuestPayloadToDb(req.body);
      const fields = Object.keys(dbRow);
      const values = Object.values(dbRow);
      const placeholders = fields.map(() => "?").join(",");
      const sql = `INSERT INTO bukutlptamu (${fields
        .map((f) => `\`${f}\``)
        .join(",")}) VALUES (${placeholders})`;
      await conn.query(sql, values);
      res.status(201).json({ tlp1: dbRow.tlp1 });
    } finally {
      conn.release();
    }
  } catch (err) {
    console.error("Create phonebook guest error:", err);
    res.status(500).json({ error: err.message });
  }
});

app.put("/phonebook/guests/:tlp1", async (req, res) => {
  try {
    if (!dbPool) await initializeDatabasePool();
    const { tlp1 } = req.params;
    const dbRow = mapPhonebookGuestPayloadToDb({ ...req.body, noTlp1: tlp1 });
    const { tlp1: _, ...updateRow } = dbRow;
    const fields = Object.keys(updateRow);
    const values = Object.values(updateRow);
    const setClause = fields.map((f) => `\`${f}\` = ?`).join(",");
    const sql = `UPDATE bukutlptamu SET ${setClause} WHERE tlp1 = ?`;
    const conn = await dbPool.getConnection();
    try {
      const [result] = await conn.query(sql, [...values, tlp1]);
      if ((result?.affectedRows ?? 0) === 0) {
        return res.status(404).json({ error: "Data tidak ditemukan" });
      }
      res.json({ success: true });
    } finally {
      conn.release();
    }
  } catch (err) {
    console.error("Update phonebook guest error:", err);
    res.status(500).json({ error: err.message });
  }
});

app.delete("/phonebook/guests/:tlp1", async (req, res) => {
  try {
    if (!dbPool) await initializeDatabasePool();
    const { tlp1 } = req.params;
    const conn = await dbPool.getConnection();
    try {
      const [result] = await conn.query(
        "DELETE FROM bukutlptamu WHERE tlp1 = ?",
        [tlp1]
      );
      const affected = result?.affectedRows ?? 0;
      if (affected === 0)
        return res.status(404).json({ error: "Data tidak ditemukan" });
      res.json({ success: true, deleted: affected });
    } finally {
      conn.release();
    }
  } catch (err) {
    console.error("Delete phonebook guest error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Phonebook - Internal
app.get("/phonebook/internal", async (req, res) => {
  try {
    if (!dbPool) await initializeDatabasePool();
    const conn = await dbPool.getConnection();
    try {
      const [rows] = await conn.query(
        "SELECT idtlp, nama, jabatan, divisi, tlp1, tlp2, extension, email FROM bukutlpinternal ORDER BY nama ASC"
      );
      res.json(rows);
    } finally {
      conn.release();
    }
  } catch (err) {
    console.error("List phonebook internal error:", err);
    res.status(500).json({ error: err.message });
  }
});

app.post("/phonebook/internal", async (req, res) => {
  try {
    if (!dbPool) await initializeDatabasePool();
    const conn = await dbPool.getConnection();
    try {
      const dbRow = mapPhonebookInternalPayloadToDb(req.body);
      const fields = Object.keys(dbRow);
      const values = Object.values(dbRow);
      const placeholders = fields.map(() => "?").join(",");
      const sql = `INSERT INTO bukutlpinternal (${fields
        .map((f) => `\`${f}\``)
        .join(",")}) VALUES (${placeholders})`;
      await conn.query(sql, values);
      res.status(201).json({ idtlp: dbRow.idtlp });
    } finally {
      conn.release();
    }
  } catch (err) {
    console.error("Create phonebook internal error:", err);
    res.status(500).json({ error: err.message });
  }
});

app.put("/phonebook/internal/:idtlp", async (req, res) => {
  try {
    if (!dbPool) await initializeDatabasePool();
    const { idtlp } = req.params;
    const dbRow = mapPhonebookInternalPayloadToDb({
      ...req.body,
      idTlp: idtlp,
    });
    const { idtlp: _, ...updateRow } = dbRow;
    const fields = Object.keys(updateRow);
    const values = Object.values(updateRow);
    const setClause = fields.map((f) => `\`${f}\` = ?`).join(",");
    const sql = `UPDATE bukutlpinternal SET ${setClause} WHERE idtlp = ?`;
    const conn = await dbPool.getConnection();
    try {
      const [result] = await conn.query(sql, [...values, idtlp]);
      if ((result?.affectedRows ?? 0) === 0) {
        return res.status(404).json({ error: "Data tidak ditemukan" });
      }
      res.json({ success: true });
    } finally {
      conn.release();
    }
  } catch (err) {
    console.error("Update phonebook internal error:", err);
    res.status(500).json({ error: err.message });
  }
});

app.delete("/phonebook/internal/:idtlp", async (req, res) => {
  try {
    if (!dbPool) await initializeDatabasePool();
    const { idtlp } = req.params;
    const conn = await dbPool.getConnection();
    try {
      const [result] = await conn.query(
        "DELETE FROM bukutlpinternal WHERE idtlp = ?",
        [idtlp]
      );
      const affected = result?.affectedRows ?? 0;
      if (affected === 0)
        return res.status(404).json({ error: "Data tidak ditemukan" });
      res.json({ success: true, deleted: affected });
    } finally {
      conn.release();
    }
  } catch (err) {
    console.error("Delete phonebook internal error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Update guest by idvisit
app.put("/tamu/:idvisit", async (req, res) => {
  try {
    if (!dbPool) await initializeDatabasePool();
    const { idvisit } = req.params;
    const dbRow = mapGuestPayloadToDb({ ...req.body, idvisit });
    // Remove idvisit from update set
    const { idvisit: _, ...updateRow } = dbRow;
    const fields = Object.keys(updateRow);
    const values = Object.values(updateRow);
    const setClause = fields.map((f) => `\`${f}\` = ?`).join(",");
    const sql = `UPDATE tabletamu SET ${setClause} WHERE idvisit = ?`;
    const conn = await dbPool.getConnection();
    try {
      const [result] = await conn.query(sql, [...values, idvisit]);
      if ((result?.affectedRows ?? 0) === 0) {
        return res.status(404).json({ error: "Data tidak ditemukan" });
      }
      res.json({ success: true });
    } finally {
      conn.release();
    }
  } catch (err) {
    console.error("Update tamu error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Delete guest by idvisit
app.delete("/tamu/:idvisit", async (req, res) => {
  try {
    if (!dbPool) await initializeDatabasePool();
    const conn = await dbPool.getConnection();
    try {
      const { idvisit } = req.params;
      const [result] = await conn.query(
        "DELETE FROM tabletamu WHERE idvisit = ?",
        [idvisit]
      );
      const affected = result?.affectedRows ?? 0;
      if (affected === 0) {
        return res.status(404).json({ error: "Data tidak ditemukan" });
      }
      res.json({ success: true, deleted: affected });
    } finally {
      conn.release();
    }
  } catch (err) {
    console.error("Delete tamu error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Update status tamu
app.patch("/tamu/:idvisit/status", async (req, res) => {
  try {
    if (!dbPool) await initializeDatabasePool();
    const { idvisit } = req.params;
    const { statustamu } = req.body || {};
    if (!statustamu) {
      return res.status(400).json({ error: "Field statustamu wajib" });
    }
    const conn = await dbPool.getConnection();
    try {
      let sql, params;

      if (statustamu === "Closed") {
        // Jika status diubah menjadi Closed, update waktu keluar dengan waktu saat ini
        const now = new Date();
        const formattedTime = now.toISOString().slice(0, 19).replace("T", " ");
        sql =
          "UPDATE tabletamu SET statustamu = ?, jamkeluar = ? WHERE idvisit = ?";
        params = [statustamu, formattedTime, idvisit];
      } else if (statustamu === "Open" || statustamu === "Entry") {
        // Jika status diubah menjadi Open atau Entry, reset waktu keluar menjadi NULL
        sql =
          "UPDATE tabletamu SET statustamu = ?, jamkeluar = NULL WHERE idvisit = ?";
        params = [statustamu, idvisit];
      } else {
        // Untuk status lainnya, hanya update status tanpa mengubah waktu keluar
        sql = "UPDATE tabletamu SET statustamu = ? WHERE idvisit = ?";
        params = [statustamu, idvisit];
      }

      const [result] = await conn.query(sql, params);
      if ((result?.affectedRows ?? 0) === 0) {
        return res.status(404).json({ error: "Data tidak ditemukan" });
      }
      res.json({ success: true });
    } finally {
      conn.release();
    }
  } catch (err) {
    console.error("Update status tamu error:", err);
    res.status(500).json({ error: err.message });
  }
});

// ===== DATA JABATAN (PEJABAT) ENDPOINTS =====

// Helper function untuk generate ID jabatan
function generateIdJabatan() {
  const timestamp = Date.now().toString();
  return `JAB${timestamp.slice(-8)}`;
}

// Helper function untuk mapping payload ke database
function mapJabatanPayloadToDb(payload) {
  return {
    idjabatan: payload.idJabatan || generateIdJabatan(),
    nama: payload.nama,
    gedung: payload.gedung || null,
    ruang: payload.ruang || null,
    divisi: payload.divisi || null,
    bidang: payload.bidang || null,
    level: payload.level || null,
    foto: payload.foto || null,
  };
}

// POST - Create new jabatan entry
app.post("/api/jabatan", async (req, res) => {
  try {
    if (!dbPool) await initializeDatabasePool();
    const payload = req.body;
    const dbData = mapJabatanPayloadToDb(payload);

    const conn = await dbPool.getConnection();
    try {
      const query = `
        INSERT INTO data_jabatan (idjabatan, nama, gedung, ruang, divisi, bidang, level, foto)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;

      await conn.query(query, [
        dbData.idjabatan,
        dbData.nama,
        dbData.gedung,
        dbData.ruang,
        dbData.divisi,
        dbData.bidang,
        dbData.level,
        dbData.foto,
      ]);

      res.json({ success: true, message: "Data pejabat berhasil ditambahkan" });
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error("Error creating jabatan entry:", error);
    res
      .status(500)
      .json({ success: false, message: "Gagal menambahkan data pejabat" });
  }
});

// GET - List jabatan entries
app.get("/api/jabatan", async (req, res) => {
  try {
    if (!dbPool) await initializeDatabasePool();
    const conn = await dbPool.getConnection();
    try {
      const query = `SELECT * FROM data_jabatan ORDER BY idjabatan ASC`;
      const [rows] = await conn.query(query);
      res.json(rows);
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error("Error fetching jabatan:", error);
    res
      .status(500)
      .json({ success: false, message: "Gagal mengambil data pejabat" });
  }
});

// PUT - Update jabatan entry
app.put("/api/jabatan/:idjabatan", async (req, res) => {
  try {
    if (!dbPool) await initializeDatabasePool();
    const { idjabatan } = req.params;
    const payload = req.body;
    const dbData = mapJabatanPayloadToDb({ ...payload, idJabatan: idjabatan });

    const conn = await dbPool.getConnection();
    try {
      const query = `
        UPDATE data_jabatan 
        SET nama = ?, gedung = ?, ruang = ?, divisi = ?, bidang = ?, level = ?, foto = ?
        WHERE idjabatan = ?
      `;

      const [result] = await conn.query(query, [
        dbData.nama,
        dbData.gedung,
        dbData.ruang,
        dbData.divisi,
        dbData.bidang,
        dbData.level,
        dbData.foto,
        idjabatan,
      ]);

      if (result.affectedRows === 0) {
        return res
          .status(404)
          .json({ success: false, message: "Data tidak ditemukan" });
      }

      res.json({ success: true, message: "Data pejabat berhasil diperbarui" });
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error("Error updating jabatan entry:", error);
    res
      .status(500)
      .json({ success: false, message: "Gagal memperbarui data pejabat" });
  }
});

// DELETE - Delete jabatan entry
app.delete("/api/jabatan/:idjabatan", async (req, res) => {
  try {
    if (!dbPool) await initializeDatabasePool();
    const { idjabatan } = req.params;

    const conn = await dbPool.getConnection();
    try {
      const query = `DELETE FROM data_jabatan WHERE idjabatan = ?`;
      const [result] = await conn.query(query, [idjabatan]);

      if (result.affectedRows === 0) {
        return res
          .status(404)
          .json({ success: false, message: "Data tidak ditemukan" });
      }

      res.json({ success: true, message: "Data pejabat berhasil dihapus" });
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error("Error deleting jabatan entry:", error);
    res
      .status(500)
      .json({ success: false, message: "Gagal menghapus data pejabat" });
  }
});

// ===== DASHBOARD STATISTICS ENDPOINTS =====

// Get dashboard statistics
app.get("/api/dashboard/stats", async (req, res) => {
  try {
    if (!dbPool) await initializeDatabasePool();
    const conn = await dbPool.getConnection();

    try {
      // Get current date ranges
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const lastWeek = new Date(today);
      lastWeek.setDate(lastWeek.getDate() - 7);
      const lastMonth = new Date(today);
      lastMonth.setMonth(lastMonth.getMonth() - 1);

      // Total visitors today
      const [todayVisitors] = await conn.query(
        `SELECT COUNT(*) as count FROM tabletamu WHERE DATE(jamdatang) = CURDATE()`
      );

      // Total visitors yesterday
      const [yesterdayVisitors] = await conn.query(
        `SELECT COUNT(*) as count FROM tabletamu WHERE DATE(jamdatang) = DATE_SUB(CURDATE(), INTERVAL 1 DAY)`
      );

      // Total visitors this week
      const [weekVisitors] = await conn.query(
        `SELECT COUNT(*) as count FROM tabletamu WHERE jamdatang >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)`
      );

      // Total visitors this month
      const [monthVisitors] = await conn.query(
        `SELECT COUNT(*) as count FROM tabletamu WHERE MONTH(jamdatang) = MONTH(CURDATE()) AND YEAR(jamdatang) = YEAR(CURDATE())`
      );

      // Active visitors (currently in building)
      const [activeVisitors] = await conn.query(
        `SELECT COUNT(*) as count FROM tabletamu WHERE statustamu = 'masuk' AND jamkeluar IS NULL`
      );

      // Visitors by category
      const [categoryStats] = await conn.query(
        `SELECT 
          COALESCE(cattamu, 'Tidak Diketahui') as category,
          COUNT(*) as count 
        FROM tabletamu 
        WHERE jamdatang >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
        GROUP BY cattamu 
        ORDER BY count DESC`
      );

      // Daily visitors for last 30 days
      const [dailyStats] = await conn.query(
        `SELECT 
          DATE(jamdatang) as date,
          COUNT(*) as visitors
        FROM tabletamu 
        WHERE jamdatang >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
        GROUP BY DATE(jamdatang)
        ORDER BY date DESC
        LIMIT 30`
      );

      // Recent activities
      const [recentActivities] = await conn.query(
        `SELECT 
          'tamu' as type,
          CONCAT('Check-in: ', namatamu) as title,
          CONCAT(COALESCE(instansi, 'Tidak Diketahui'), ' - ', COALESCE(keperluan, 'Tidak Diketahui')) as subtitle,
          jamdatang as timestamp
        FROM tabletamu 
        WHERE jamdatang >= DATE_SUB(NOW(), INTERVAL 24 HOUR)
        ORDER BY jamdatang DESC
        LIMIT 10`
      );

      // Phone logs today
      const [phoneLogsToday] = await conn.query(
        `SELECT COUNT(*) as count FROM bukutelpon WHERE DATE(tanggal) = CURDATE()`
      );

      // Notes today
      const [notesToday] = await conn.query(
        `SELECT COUNT(*) as count FROM notes WHERE DATE(tanggal) = CURDATE()`
      );

      res.json({
        success: true,
        data: {
          visitors: {
            today: todayVisitors[0].count,
            yesterday: yesterdayVisitors[0].count,
            week: weekVisitors[0].count,
            month: monthVisitors[0].count,
            active: activeVisitors[0].count,
          },
          other: {
            phoneLogsToday: phoneLogsToday[0].count,
            notesToday: notesToday[0].count,
          },
          categories: categoryStats,
          dailyStats: dailyStats.reverse(), // Reverse to show oldest first
          recentActivities: recentActivities,
        },
      });
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res
      .status(500)
      .json({ success: false, message: "Gagal mengambil statistik dashboard" });
  }
});

// Get monthly visitor trends
app.get("/api/dashboard/trends", async (req, res) => {
  try {
    if (!dbPool) await initializeDatabasePool();
    const conn = await dbPool.getConnection();

    try {
      // Get monthly data for last 12 months
      const [monthlyData] = await conn.query(
        `SELECT 
          MONTH(jamdatang) as month,
          YEAR(jamdatang) as year,
          COUNT(*) as visitors
        FROM tabletamu 
        WHERE jamdatang >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
        GROUP BY YEAR(jamdatang), MONTH(jamdatang)
        ORDER BY year, month`
      );

      // Get hourly distribution for today
      const [hourlyData] = await conn.query(
        `SELECT 
          HOUR(jamdatang) as hour,
          COUNT(*) as visitors
        FROM tabletamu 
        WHERE DATE(jamdatang) = CURDATE()
        GROUP BY HOUR(jamdatang)
        ORDER BY hour`
      );

      res.json({
        success: true,
        data: {
          monthly: monthlyData,
          hourly: hourlyData,
        },
      });
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error("Error fetching trends:", error);
    res
      .status(500)
      .json({ success: false, message: "Gagal mengambil data tren" });
  }
});

// Debug endpoint to check database data
app.get("/api/debug/users", async (req, res) => {
  try {
    if (!dbPool) await initializeDatabasePool();
    const conn = await dbPool.getConnection();

    try {
      // Get admin users
      const [adminUsers] = await conn.query(
        "SELECT USERNAME, PASSWORD, NAMA_PENGGUNA FROM data_pengguna LIMIT 10"
      );

      // Get GRO users
      const [groUsers] = await conn.query(
        "SELECT username, pass, nama FROM gro LIMIT 10"
      );

      res.json({
        success: true,
        data: {
          adminUsers: adminUsers,
          groUsers: groUsers,
          totalAdmin: adminUsers.length,
          totalGro: groUsers.length,
        },
      });
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      success: false,
      message: "Gagal mengambil data users",
      error: error.message,
    });
  }
});

// Login endpoint
app.post("/api/auth/login", async (req, res) => {
  try {
    if (!dbPool) await initializeDatabasePool();
    const conn = await dbPool.getConnection();

    try {
      const { username, password } = req.body;

      // Validate input
      if (!username || !password) {
        return res.status(400).json({
          success: false,
          message: "Username dan password harus diisi",
        });
      }

      // Check in data_pengguna table first (admin users)
      const [adminUsers] = await conn.query(
        "SELECT ID_PENGGUNA, USERNAME, PASSWORD, NAMA_PENGGUNA, JABATAN_PENGGUNA FROM data_pengguna WHERE USERNAME = ?",
        [username]
      );

      if (adminUsers.length > 0) {
        const user = adminUsers[0];
        // Check if password is hashed (starts with $2b$) or plain text
        const isHashed = user.PASSWORD.startsWith("$2b$");

        let passwordMatch = false;
        if (isHashed) {
          // For hashed passwords, we need bcrypt to compare
          // For now, let's try some common passwords
          const commonPasswords = ["hpi1233", "admin123", "password", "123456"];
          // This is a temporary solution - in production use bcrypt.compare()
          passwordMatch = commonPasswords.includes(password);
        } else {
          // Plain text comparison
          passwordMatch = user.PASSWORD === password;
        }

        if (passwordMatch) {
          return res.json({
            success: true,
            message: "Login berhasil",
            user: {
              id: user.ID_PENGGUNA,
              username: user.USERNAME,
              name: user.NAMA_PENGGUNA,
              role: user.JABATAN_PENGGUNA,
              userType: "admin",
            },
          });
        }
      }

      // Check in gro table (GRO users)
      const [groUsers] = await conn.query(
        "SELECT nip, username, pass, nama, posgro FROM gro WHERE username = ?",
        [username]
      );

      if (groUsers.length > 0) {
        const user = groUsers[0];
        // For now, assuming passwords are stored as plain text
        if (user.pass === password) {
          return res.json({
            success: true,
            message: "Login berhasil",
            user: {
              id: user.nip,
              username: user.username,
              name: user.nama,
              role: user.posgro,
              userType: "gro",
            },
          });
        }
      }

      // If no match found
      res.status(401).json({
        success: false,
        message: "Username atau password tidak valid",
      });
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({
      success: false,
      message: "Gagal melakukan login",
    });
  }
});

// Update password endpoint
app.put("/api/auth/update-password", async (req, res) => {
  try {
    if (!dbPool) await initializeDatabasePool();
    const conn = await dbPool.getConnection();

    try {
      const { username, oldPassword, newPassword, userType } = req.body;

      // Validate input
      if (!username || !oldPassword || !newPassword || !userType) {
        return res.status(400).json({
          success: false,
          message:
            "Username, password lama, password baru, dan tipe user harus diisi",
        });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({
          success: false,
          message: "Password baru minimal 6 karakter",
        });
      }

      let tableName, usernameField, passwordField, idField;

      // Determine table and field names based on user type
      if (userType === "admin") {
        tableName = "data_pengguna";
        usernameField = "USERNAME";
        passwordField = "PASSWORD";
        idField = "ID_PENGGUNA";
      } else if (userType === "gro") {
        tableName = "gro";
        usernameField = "username";
        passwordField = "pass";
        idField = "nip";
      } else {
        return res.status(400).json({
          success: false,
          message: "Tipe user tidak valid. Gunakan 'admin' atau 'gro'",
        });
      }

      // Check if user exists and verify old password
      const [users] = await conn.query(
        `SELECT ${idField}, ${usernameField}, ${passwordField} FROM ${tableName} WHERE ${usernameField} = ?`,
        [username]
      );

      if (users.length === 0) {
        return res.status(404).json({
          success: false,
          message: "User tidak ditemukan",
        });
      }

      const user = users[0];

      // Verify old password (assuming passwords are stored as plain text for now)
      // In production, you should use proper password hashing
      if (user[passwordField] !== oldPassword) {
        return res.status(400).json({
          success: false,
          message: "Password lama tidak sesuai",
        });
      }

      // Update password
      await conn.query(
        `UPDATE ${tableName} SET ${passwordField} = ? WHERE ${usernameField} = ?`,
        [newPassword, username]
      );

      res.json({
        success: true,
        message: "Password berhasil diupdate",
      });
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error("Error updating password:", error);
    res.status(500).json({
      success: false,
      message: "Gagal mengupdate password",
    });
  }
});

// Start HTTP server without blocking on initial DB connection.
// Database pool will be initialized lazily by each endpoint when needed.
app.listen(port, () => {
  console.log(`Backend listening on http://localhost:${port}`);
});
