# Inventory Manager — Vercel + Postgres version

Same app as before (Add Product, Sold 1 Unit, Delete, Save as CSV, Sales history,
PKR formatting) but backed by a real online database, so it works correctly once
deployed to Vercel.

## Deploy steps

1. **Push this folder to GitHub.**
   Create a new repository and upload all these files (keep the folder structure
   exactly as-is, including the `[id]` folder names).

2. **Import into Vercel.**
   Go to vercel.com → Add New → Project → import that GitHub repo → Deploy.
   The first deploy will work for the page, but the API calls will fail until
   step 3 is done (no database connected yet).

3. **Add a Neon (Postgres) database.**
   In your Vercel project, go to the **Storage** tab → **Create Database** →
   choose **Neon** → create it → when asked, **connect it to this project**.
   This automatically sets the `DATABASE_URL` environment variable that the
   app needs — you don't type it in yourself.
   (Vercel used to offer its own "Postgres" option; that's been replaced by
   this Neon integration, which works the same way.)

4. **Create the tables.**
   Still in the Storage tab, open the **Query** editor for your new database,
   paste the contents of `schema.sql`, and run it. This creates the `products`
   and `sales` tables.

5. **Redeploy.**
   Go to the project's **Deployments** tab → click the three dots on the latest
   deployment → **Redeploy**. This makes sure the app picks up the database
   connection.

6. **Open your site.**
   Visit the `.vercel.app` URL Vercel gives you. The table should start empty,
   ready for your own products — and data now persists properly, visible from
   any device.

## Notes

- Anyone with the link can add, sell, or delete products — there's no login.
  If this matters to you (recommended for real shop use), the next step is
  adding simple password protection.
- `schema.sql` only needs to be run once, the first time you set up the
  database.
