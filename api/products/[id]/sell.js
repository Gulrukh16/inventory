const { sql } = require("../../../lib/db");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const id = Number(req.query.id);
  if (!Number.isInteger(id)) {
    return res.status(400).json({ error: "Invalid product id" });
  }

  try {
    // One statement: lowers stock, raises sold/revenue, and logs the sale -
    // all atomic, so a crash mid-way can never leave half-updated data.
    const { rows } = await sql`
      WITH updated AS (
        UPDATE products
           SET remaining = remaining - 1,
               sold = sold + 1,
               revenue = ROUND((revenue + price)::numeric, 2)
         WHERE id = ${id} AND remaining > 0
        RETURNING *
      ), logged AS (
        INSERT INTO sales (product_id, product_name, price)
        SELECT id, name, price FROM updated
        RETURNING *
      )
      SELECT * FROM updated`;

    if (rows.length === 0) {
      return res.status(400).json({ error: "Out of stock or product not found" });
    }
    return res.status(200).json(rows[0]);
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
};
