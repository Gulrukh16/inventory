const { sql } = require("../lib/db");

module.exports = async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }
  const { rows } = await sql`SELECT * FROM sales ORDER BY id DESC LIMIT 50`;
  res.status(200).json(rows);
};
