const { sql } = require("../../lib/db");

module.exports = async function handler(req, res) {
  const id = Number(req.query.id);
  if (!Number.isInteger(id)) {
    return res.status(400).json({ error: "Invalid product id" });
  }

  if (req.method === "DELETE") {
    const result = await sql`DELETE FROM products WHERE id = ${id}`;
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Product not found" });
    }
    return res.status(200).json({ ok: true });
  }

  res.setHeader("Allow", "DELETE");
  res.status(405).json({ error: "Method not allowed" });
};
