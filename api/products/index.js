const { sql } = require("../../lib/db");

module.exports = async function handler(req, res) {
  if (req.method === "GET") {
    const { rows } = await sql`SELECT * FROM products ORDER BY id`;
    return res.status(200).json(rows);
  }

  if (req.method === "POST") {
    try {
      const body = typeof req.body === "string" ? JSON.parse(req.body) : (req.body || {});
      const name = String(body.name || "").trim();
      const qty = Number.parseInt(body.qty, 10);
      const price = Number.parseFloat(body.price);
      if (!name || !Number.isInteger(qty) || qty < 0 || !Number.isFinite(price) || price < 0) {
        return res.status(400).json({ error: "Enter a name, a quantity of 0 or more, and a price of 0 or more." });
      }
      const { rows } = await sql`
        INSERT INTO products (name, total, remaining, price)
        VALUES (${name}, ${qty}, ${qty}, ${price})
        RETURNING *`;
      return res.status(201).json(rows[0]);
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }
  }

  res.setHeader("Allow", "GET, POST");
  res.status(405).json({ error: "Method not allowed" });
};
