const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3001;

const allowedOrigins = (process.env.CORS_ORIGIN || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);
const corsOptions = allowedOrigins.length ? { origin: allowedOrigins } : {};

app.use(cors(corsOptions));
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok", name: "Dashboard GRO Application" });
});

app.listen(port, () => {
  console.log(`Backend listening on http://localhost:${port}`);
});
