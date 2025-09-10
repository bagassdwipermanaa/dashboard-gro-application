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
const corsOptions = allowedOrigins.length ? { origin: allowedOrigins } : {};

app.use(cors(corsOptions));
app.use(express.json());

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
    cattamu: payload.keterangan ?? null,
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
        "SELECT idvisit, namatamu, instansi, keperluan, tujuan, divisi, jenisid, noid, DATE_FORMAT(jamdatang, '%Y-%m-%d %H:%i:%s') AS jamdatang, DATE_FORMAT(jamkeluar, '%Y-%m-%d %H:%i:%s') AS jamkeluar, status, statustamu FROM tabletamu ORDER BY jamdatang DESC LIMIT 100"
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

initializeDatabasePool()
  .then(() => {
    app.listen(port, () => {
      console.log(`Backend listening on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error("Failed to initialize DB pool:", err);
    process.exit(1);
  });
