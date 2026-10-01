const { neon } = require("@neondatabase/serverless");

// DATABASE_URL is set automatically once you connect a Neon database
// to this project in Vercel's Storage tab.
// fullResults:true makes every query return { rows, rowCount }, matching
// how the rest of this project's code reads query results.
const sql = neon(process.env.DATABASE_URL, { fullResults: true });

module.exports = { sql };
