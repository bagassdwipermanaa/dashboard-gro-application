/* eslint-disable no-console */
const fs = require("fs");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "..", ".env") });
const mysql = require("mysql2/promise");

async function main() {
  const outputDir = path.resolve(__dirname, "..", "schema");
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  const config = {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  };

  if (!config.host || !config.user || !config.password || !config.database) {
    console.error(
      "Missing DB envs. Please set DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME"
    );
    process.exit(1);
  }

  const connection = await mysql.createConnection(config);

  const [tables] = await connection.query(
    "SELECT TABLE_NAME FROM information_schema.tables WHERE table_schema = ? ORDER BY TABLE_NAME",
    [config.database]
  );

  const schema = {};

  for (const row of tables) {
    const tableName = row.TABLE_NAME;
    const [columns] = await connection.query(
      "SELECT COLUMN_NAME, COLUMN_TYPE, IS_NULLABLE, COLUMN_DEFAULT, COLUMN_KEY, EXTRA FROM information_schema.columns WHERE table_schema = ? AND table_name = ? ORDER BY ORDINAL_POSITION",
      [config.database, tableName]
    );
    const [indexes] = await connection.query(
      "SHOW INDEX FROM `" + tableName + "`"
    );
    schema[tableName] = { columns, indexes };
  }

  await connection.end();

  const jsonPath = path.join(outputDir, "schema.json");
  fs.writeFileSync(jsonPath, JSON.stringify(schema, null, 2), "utf8");
  console.log("Schema exported to", jsonPath);
}

main().catch((err) => {
  console.error("Failed to export schema:", err);
  process.exit(1);
});
