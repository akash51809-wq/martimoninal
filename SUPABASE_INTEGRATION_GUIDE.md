# Vivah Kar Lo - Supabase Database Architecture & Developer Guide

> **Target Audience:** Next Engineers & Full-Stack Developers  
> **Security Standards:** OWASP Top 10, Strict RLS (Row-Level Security), Bcrypt Hashing, Parameterized Queries, Rate-Limiting

---

## 1. Executive Architecture Overview

Vivah Kar Lo uses **Supabase (PostgreSQL)** as its foundational relational database with a resilient, high-speed **Data Access Layer (DAL)** on the backend.

### Key Architecture Components:
1. **Supabase Schema Definition:** [`supabase/schema.sql`](file:///d:/projects/Matrimonial/supabase/schema.sql) contains the complete PostgreSQL DDL including all 8 core relational tables, foreign key constraints (`ON DELETE CASCADE`), B-tree indexes, automatic `updated_at` triggers, and Row-Level Security (RLS) policies.
2. **Backend Supabase Client:** [`server/supabase.ts`](file:///d:/projects/Matrimonial/server/supabase.ts) exports `supabase` (public client respecting RLS) and `supabaseAdmin` (service role client for trusted server-side execution).
3. **Database Service (Repository Pattern):** [`server/databaseService.ts`](file:///d:/projects/Matrimonial/server/databaseService.ts) provides typed, atomic CRUD methods, password hashing via `bcryptjs`, and disk-backed persistence snapshotting to prevent zero-loss during restarts.
4. **REST API Routing:** [`server/routes.ts`](file:///d:/projects/Matrimonial/server/routes.ts) exposes standardized endpoints under `/api/v1/auth/...` and `/api/v1/admin/...` with Zod validation and rate limiting.
5. **Client Database Synchronization:** [`client/src/context/AuthAccountContext.tsx`](file:///d:/projects/Matrimonial/client/src/context/AuthAccountContext.tsx) synchronizes UI state with the database endpoints, offering 0ms instant UI responsiveness alongside guaranteed network database persistence.
6. **Frontend Supabase Client:** [`client/src/lib/supabaseClient.ts`](file:///d:/projects/Matrimonial/client/src/lib/supabaseClient.ts) provides typed client-side access when using real-time listeners or Supabase Storage for photos.

---

## 2. Core Relational Tables

| Table Name | Primary Key | Description | Key Security / Indexes |
|---|---|---|---|
| `users` | `id` (VARCHAR) | Core authentication and personal identification | Indexed `mobile` (UNIQUE), `email` (UNIQUE), `account_status`, Bcrypt hashed passwords |
| `user_verifications` | `id` (UUID) | Dual-channel OTP verification state (Mobile & Email) | 60s security lockouts after 3 invalid attempts, TTL expiry |
| `user_profiles` | `id` (UUID) | Matrimonial attributes, bio, photos, religion, horoscope | RLS policy: only completed/verified profiles are discoverable |
| `user_roles` | `id` (UUID) | Role-based Access Control (`free`, `vip`, `admin`, etc.) | Permission matrix stored as structured JSONB |
| `registration_progress` | `id` (UUID) | Onboarding stepper state (Step 1 -> 4) | Enables seamless onboarding resumption upon re-login |
| `user_sessions` | `id` (VARCHAR) | Active device sessions and access tokens | Device fingerprinting, IP address, active session status |
| `payment_transactions` | `id` (UUID) | Invoices, VIP subscription payments, refunds | Indexed `txn_id` (UNIQUE), currency, plan name |
| `moderation_reports` | `id` (UUID) | Trust & safety incident triage queue | Severity ratings, status tracking, reporter & reported user links |

---

## 3. How to Connect Future Modules to Supabase

Every new module (e.g., Profile Wizard, Horoscope/Kundli, Matchmaking, Real-time Chat) **MUST** follow this exact pattern:

### Step 1: Add or Update Table in `supabase/schema.sql`
Add the table with explicit foreign keys, indexes, and RLS policies:
```sql
CREATE TABLE user_astro_horoscopes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR(64) NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  birth_time TIME NOT NULL,
  birth_place VARCHAR(120) NOT NULL,
  rashi VARCHAR(50),
  nakshatra VARCHAR(50),
  manglik_status VARCHAR(20) DEFAULT 'Non-Manglik',
  guna_score INT DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_horoscopes_user_id ON user_astro_horoscopes(user_id);
```

### Step 2: Implement Typed Methods in `server/databaseService.ts`
Add the TypeScript interface and service methods:
```typescript
public async updateHoroscope(userId: string, data: Partial<HoroscopeRow>): Promise<HoroscopeRow> {
  if (isSupabaseConfigured() && supabaseAdmin) {
    const { data: updated, error } = await supabaseAdmin
      .from('user_astro_horoscopes')
      .upsert({ user_id: userId, ...data })
      .select()
      .single();
    if (error) throw error;
    return updated;
  }
  // Local persistence update
  ...
}
```

### Step 3: Expose Protected API Endpoints in `server/routes.ts`
Always validate request payloads with Zod schemas:
```typescript
const horoscopeInputSchema = z.object({
  birthTime: z.string(),
  birthPlace: z.string().min(2),
  rashi: z.string().optional(),
});

app.post('/api/v1/horoscope', async (req, res) => {
  const parsed = horoscopeInputSchema.parse(req.body);
  const result = await dbService.updateHoroscope(req.body.userId, parsed);
  res.json({ success: true, data: result });
});
```

---

## 4. Security & Anti-Hacking Guardrails

1. **Password Storage:** NEVER store plaintext passwords or MD5/SHA1 hashes. Always use `bcryptjs` with salt rounds = 10 (`hashPassword(plain)`).
2. **SQL Injection Defense:** All queries to Supabase use PostgREST parameterized query builders. Raw string concatenation in SQL queries is strictly prohibited.
3. **OWASP Input Sanitization:** All incoming requests are parsed through `zod` schemas. Malformed inputs are rejected immediately with 400 Bad Request.
4. **Brute-Force & Rate Limiting:** All endpoints under `/api/v1/auth` are gated by `express-rate-limit` (120 requests per 15 minutes per IP).
5. **Session Invalidation:** When an account is suspended or deleted by Admin, active sessions are immediately invalidated both locally and in `user_sessions`.
6. **No Hindi in Code:** Maintain 100% English across all variable names, comments, API paths, and database columns.

---

## 5. Environment Variables Configuration

Copy `.env.example` to `.env` and configure with your Supabase credentials:
```env
PORT=3001
NODE_ENV=development
SESSION_SECRET=vivah_kar_lo_session_secret_super_secure_key_2026
JWT_SECRET=vivah_kar_lo_jwt_secret_token_auth_key_2026_super_secure

SUPABASE_URL=https://<your-project-id>.supabase.co
SUPABASE_ANON_KEY=<your-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>

VITE_SUPABASE_URL=https://<your-project-id>.supabase.co
VITE_SUPABASE_ANON_KEY=<your-anon-key>
```
Once entered, the system automatically detects valid credentials and routes queries directly to your Supabase PostgreSQL cloud instance with zero configuration code changes.
