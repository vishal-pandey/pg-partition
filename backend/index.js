const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.static(path.join(__dirname, "public"))); // Serve static files

const pool = new Pool({
  user: "admin",
  host: "postgres",
  database: "itsm_db",
  password: "admin",
  port: 5432,
});

// Fetch incidents from last 3 months with pagination
app.get("/incidents", async (req, res) => {
  const { page = 1, pageSize = 400 } = req.query;
  const offset = (page - 1) * pageSize;
  const start = Date.now();
  try {
    const result = await pool.query(
      "SELECT * FROM incidents WHERE created_at >= NOW() - INTERVAL '3 months' ORDER BY created_at DESC LIMIT $1 OFFSET $2",
      [pageSize, offset]
    );
    const totalResult = await pool.query(
      "SELECT COUNT(*) FROM incidents WHERE created_at >= NOW() - INTERVAL '3 months'"
    );
    const totalPages = Math.ceil(totalResult.rows[0].count / pageSize);
    const duration = Date.now() - start;
    res.json({ data: result.rows, totalPages, duration });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching incidents");
  }
});

// Fetch open incidents from last 3 months with pagination
app.get("/open-incidents", async (req, res) => {
  const { page = 1, pageSize = 400 } = req.query;
  const offset = (page - 1) * pageSize;
  const start = Date.now();
  try {
    const result = await pool.query(
      "SELECT * FROM incidents WHERE status = 'Open' AND created_at >= NOW() - INTERVAL '3 months' ORDER BY created_at DESC LIMIT $1 OFFSET $2",
      [pageSize, offset]
    );
    const totalResult = await pool.query(
      "SELECT COUNT(*) FROM incidents WHERE status = 'Open' AND created_at >= NOW() - INTERVAL '3 months'"
    );
    const totalPages = Math.ceil(totalResult.rows[0].count / pageSize);
    const duration = Date.now() - start;
    res.json({ data: result.rows, totalPages, duration });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching open incidents");
  }
});

// Fetch incidents from incident_og table from last 3 months with pagination
app.get("/incidents-og", async (req, res) => {
  const { page = 1, pageSize = 400 } = req.query;
  const offset = (page - 1) * pageSize;
  const start = Date.now();
  try {
    const result = await pool.query(
      "SELECT * FROM incident_og WHERE created_at >= NOW() - INTERVAL '3 months' ORDER BY created_at DESC LIMIT $1 OFFSET $2",
      [pageSize, offset]
    );
    const totalResult = await pool.query(
      "SELECT COUNT(*) FROM incident_og WHERE created_at >= NOW() - INTERVAL '3 months'"
    );
    const totalPages = Math.ceil(totalResult.rows[0].count / pageSize);
    const duration = Date.now() - start;
    res.json({ data: result.rows, totalPages, duration });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching incidents from incident_og");
  }
});

// Fetch open incidents from incident_og table from last 3 months with pagination
app.get("/open-incidents-og", async (req, res) => {
  const { page = 1, pageSize = 400 } = req.query;
  const offset = (page - 1) * pageSize;
  const start = Date.now();
  try {
    const result = await pool.query(
      "SELECT * FROM incident_og WHERE status = 'Open' AND created_at >= NOW() - INTERVAL '3 months' ORDER BY created_at DESC LIMIT $1 OFFSET $2",
      [pageSize, offset]
    );
    const totalResult = await pool.query(
      "SELECT COUNT(*) FROM incident_og WHERE status = 'Open' AND created_at >= NOW() - INTERVAL '3 months'"
    );
    const totalPages = Math.ceil(totalResult.rows[0].count / pageSize);
    const duration = Date.now() - start;
    res.json({ data: result.rows, totalPages, duration });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching open incidents from incident_og");
  }
});

// Serve index.html by default
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(5000, () => console.log("Backend running on port 5000"));
