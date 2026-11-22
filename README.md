# BM Solicitor Store

## Architecture

- `src/` — customer-facing React/Vite storefront.
- `api/assistant.ts` — deployed assistant handler.
- `supabase/migrations/` — PostgreSQL schema, RLS policies, storage policies, and COD order functions.
- `scripts/seed-supabase.mjs` — seeds the existing validated local catalog into Supabase.
- `admin/` — separate React/Vite admin application.

The storefront remains functional with the existing local catalog if Supabase is not configured. Once
`VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are configured, published products are loaded from Supabase.

## Supabase setup

1. Create a Supabase project.
2. In the SQL Editor, run migrations in filename order:
   - `supabase/migrations/202611220001_initial_schema.sql`
   - `supabase/migrations/202611220002_rls_and_rpcs.sql`
   - `supabase/migrations/202611220003_cod_order_rpc.sql`
3. In Authentication → URL Configuration, add:
   - Customer site URL: `https://www.mydomain.com`
   - Admin site URL: `https://admin.mydomain.com`
   - Redirect URLs for password recovery and both domains.
4. Create the first admin through Supabase Authentication.
5. Insert the new auth user's UUID into `admin_users` using the SQL Editor:

```sql
insert into public.admin_users (user_id, role)
values ('REPLACE-WITH-AUTH-USERS-UUID', 'super_admin');
```

Do not create public registration for administrators. `admin_users` is protected by RLS.

## Customer environment

Copy `.env.example` to `.env.local` and set:

```text
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-publishable-or-anon-key
```

Never add `SUPABASE_SERVICE_ROLE_KEY` or any service-role credential to a `VITE_` variable.

## Seed the existing catalog

Set server-only credentials in the shell, then run:

```powershell
$env:SUPABASE_URL="https://your-project.supabase.co"
$env:SUPABASE_SERVICE_ROLE_KEY="your-server-only-service-role-key"
npm run seed:supabase
Remove-Item Env:\SUPABASE_SERVICE_ROLE_KEY
```

The seed script creates/upserts the existing three categories and 33 validated products, variants,
inventory rows, and image records. It requires `SUPABASE_SERVICE_ROLE_KEY`; this key must never be
committed or placed in browser environment variables.

## Build and test

```powershell
npm run validate:catalog
npm run build
cd admin
npm install
npm run build
```

## Hostinger deployment

Build both applications locally:

- Customer: `npm run build`, upload `dist/` to the Hostinger web root for `www.mydomain.com`.
- Admin: `cd admin`, `npm run build`, upload `admin/dist/` to the Hostinger subdomain document root for
  `admin.mydomain.com`.

Both deployments are static Vite applications. Privileged operations use Supabase RLS and the secure
`create_cod_order` / `update_order_status` functions. Configure CORS only in Supabase if a browser
origin is blocked; Supabase normally handles the configured project origin through its APIs.

Create DNS records for the customer domain and `admin` subdomain, enable HTTPS, and configure each
Hostinger subdomain document root separately.

Supabase redirect URLs must include both production origins.
