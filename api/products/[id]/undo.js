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
    const { rows } = await sql`
      WITH removed AS (
        DELETE FROM sales
         WHERE id = (
           SELECT id FROM sales
            WHERE product_id = ${id}
            ORDER BY sold_at DESC
            LIMIT 1
         )
        RETURNING *
      ), updated AS (
        UPDATE products p
           SET remaining = p.remaining + 1,
               sold = GREATEST(p.sold - 1, 0),
               revenue = ROUND((p.revenue - removed.price)::numeric, 2)
          FROM removed
         WHERE p.id = removed.product_id
        RETURNING p.*
      )
      SELECT * FROM updated`;

    if (rows.length === 0) {
      return res.status(400).json({ error: "No sale to undo for this product" });
    }
    return res.status(200).json(rows[0]);
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
};
