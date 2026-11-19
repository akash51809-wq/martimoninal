-- ============================================================================
-- VIVAH KAR LO - PRODUCTION SUPABASE DATABASE SCHEMA
-- Author: Senior Systems Architect
-- Security Standard: OWASP Top 10 Compliant, Strict RLS, B-Tree Indexes
-- ============================================================================

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Clean Up Existing Tables (Drop in reverse dependency order for idempotency)
DROP TABLE IF EXISTS saved_searches CASCADE;
DROP TABLE IF EXISTS moderation_reports CASCADE;
DROP TABLE IF EXISTS payment_transactions CASCADE;
DROP TABLE IF EXISTS user_sessions CASCADE;
DROP TABLE IF EXISTS registration_progress CASCADE;
DROP TABLE IF EXISTS user_roles CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;
DROP TABLE IF EXISTS user_verifications CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- ============================================================================
-- 3. CORE IDENTITY TABLE: users
-- ============================================================================
CREATE TABLE users (
  id VARCHAR(64) PRIMARY KEY,
  full_name VARCHAR(120) NOT NULL,
  mobile VARCHAR(15) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  gender VARCHAR(20) NOT NULL CHECK (gender IN ('Male', 'Female', 'Other')),
  dob DATE NOT NULL,
  profile_created_by VARCHAR(50) NOT NULL DEFAULT 'Self',
  account_status VARCHAR(30) NOT NULL DEFAULT 'active' CHECK (account_status IN ('active', 'suspended', 'deleted', 'pending_verification')),
  suspension_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Fast B-Tree Indexes for Instant Lookups & Duplicate Checks
CREATE INDEX idx_users_mobile ON users(mobile);
CREATE INDEX idx_users_email ON users(LOWER(email));
CREATE INDEX idx_users_status ON users(account_status);
CREATE INDEX idx_users_created_at ON users(created_at DESC);

-- ============================================================================
-- 4. VERIFICATIONS TABLE: user_verifications
-- ============================================================================
CREATE TABLE user_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR(64) NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  mobile_verified BOOLEAN NOT NULL DEFAULT FALSE,
  email_verified BOOLEAN NOT NULL DEFAULT FALSE,
  mobile_otp VARCHAR(10),
  mobile_otp_expires_at TIMESTAMPTZ,
  mobile_otp_attempts INT NOT NULL DEFAULT 0,
  mobile_otp_lock_until TIMESTAMPTZ,
  email_otp VARCHAR(10),
  email_otp_expires_at TIMESTAMPTZ,
  email_otp_attempts INT NOT NULL DEFAULT 0,
  email_otp_lock_until TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_verifications_user_id ON user_verifications(user_id);

-- ============================================================================
-- 5. MATRIMONIAL PROFILES: user_profiles
-- ============================================================================
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR(64) NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  profile_status VARCHAR(30) NOT NULL DEFAULT 'incomplete' CHECK (profile_status IN ('incomplete', 'complete', 'under_review', 'verified')),
  profile_completion INT NOT NULL DEFAULT 0 CHECK (profile_completion >= 0 AND profile_completion <= 100),
  is_new_user BOOLEAN NOT NULL DEFAULT TRUE,
  marital_status VARCHAR(50) DEFAULT 'Never Married',
  mother_tongue VARCHAR(50) DEFAULT 'Hindi',
  religion VARCHAR(50) DEFAULT 'Hindu',
  caste VARCHAR(50),
  sub_caste VARCHAR(50),
  height_cm INT,
  education VARCHAR(120),
  employed_in VARCHAR(60),
  occupation VARCHAR(120),
  annual_income VARCHAR(60),
  city VARCHAR(100),
  state VARCHAR(100),
  country VARCHAR(100) DEFAULT 'India',
  bio TEXT,
  photos JSONB NOT NULL DEFAULT '[]'::jsonb,
  partner_preferences JSONB NOT NULL DEFAULT '{}'::jsonb,
  astro_details JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_profiles_user_id ON user_profiles(user_id);
CREATE INDEX idx_profiles_status ON user_profiles(profile_status);
CREATE INDEX idx_profiles_location ON user_profiles(state, city);

-- ============================================================================
-- 6. PERMISSIONS & ROLES: user_roles
-- ============================================================================
CREATE TABLE user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR(64) NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  role VARCHAR(30) NOT NULL DEFAULT 'free' CHECK (role IN ('free', 'gold', 'vip', 'moderator', 'admin', 'superadmin')),
  permissions JSONB NOT NULL DEFAULT '["browse", "send_interest"]'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_roles_user_id ON user_roles(user_id);
CREATE INDEX idx_roles_role ON user_roles(role);

-- ============================================================================
-- 7. ONBOARDING REGISTRATION PROGRESS: registration_progress
-- ============================================================================
CREATE TABLE registration_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR(64) NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  current_step VARCHAR(50) NOT NULL DEFAULT 'create_account',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_progress_user_id ON registration_progress(user_id);

-- ============================================================================
-- 8. ACTIVE USER SESSIONS: user_sessions
-- ============================================================================
CREATE TABLE user_sessions (
  id VARCHAR(64) PRIMARY KEY,
  user_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token TEXT NOT NULL,
  device_info VARCHAR(255) DEFAULT 'Web Browser',
  ip_address VARCHAR(45) DEFAULT '127.0.0.1',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_sessions_user_id ON user_sessions(user_id);
CREATE INDEX idx_sessions_token ON user_sessions(token);
CREATE INDEX idx_sessions_active ON user_sessions(is_active);

-- ============================================================================
-- 9. PAYMENTS & TRANSACTIONS: payment_transactions
-- ============================================================================
CREATE TABLE payment_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  txn_id VARCHAR(50) NOT NULL UNIQUE,
  user_id VARCHAR(64) REFERENCES users(id) ON DELETE SET NULL,
  user_name VARCHAR(120) NOT NULL,
  plan_name VARCHAR(60) NOT NULL,
  amount NUMERIC(10,2) NOT NULL,
  currency VARCHAR(10) NOT NULL DEFAULT 'INR',
  status VARCHAR(30) NOT NULL DEFAULT 'Success' CHECK (status IN ('Success', 'Pending', 'Failed', 'Refunded')),
  method VARCHAR(50) NOT NULL DEFAULT 'UPI / Card',
  invoice_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_transactions_txn_id ON payment_transactions(txn_id);
CREATE INDEX idx_transactions_user_id ON payment_transactions(user_id);

-- ============================================================================
-- 10. TRUST & MODERATION REPORTS: moderation_reports
-- ============================================================================
CREATE TABLE moderation_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id VARCHAR(50) NOT NULL UNIQUE,
  reporter_id VARCHAR(64) REFERENCES users(id) ON DELETE SET NULL,
  reported_user_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
  reported_user_name VARCHAR(120) NOT NULL,
  reason TEXT NOT NULL,
  severity VARCHAR(20) NOT NULL DEFAULT 'Medium' CHECK (severity IN ('Low', 'Medium', 'High', 'Critical')),
  status VARCHAR(30) NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Investigating', 'Resolved', 'Dismissed')),
  action_taken TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_reports_status ON moderation_reports(status);
CREATE INDEX idx_reports_reported_user ON moderation_reports(reported_user_id);

-- ============================================================================
-- 11. SAVED SEARCHES & ALERTS: saved_searches
-- ============================================================================
CREATE TABLE saved_searches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  search_name VARCHAR(120) NOT NULL,
  filters JSONB NOT NULL DEFAULT '{}'::jsonb,
  alerts_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  match_count INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_saved_searches_user_id ON saved_searches(user_id);
CREATE INDEX idx_saved_searches_alerts ON saved_searches(alerts_enabled);

-- ============================================================================
-- 12. AUTOMATIC UPDATED_AT TRIGGER FUNCTION
-- ============================================================================
CREATE OR REPLACE FUNCTION trigger_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE TRIGGER trg_user_verifications_updated_at
BEFORE UPDATE ON user_verifications
FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE TRIGGER trg_user_profiles_updated_at
BEFORE UPDATE ON user_profiles
FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE TRIGGER trg_saved_searches_updated_at
BEFORE UPDATE ON saved_searches
FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

-- ============================================================================
-- 13. ROW-LEVEL SECURITY (RLS) POLICIES
-- ============================================================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE registration_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE moderation_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_searches ENABLE ROW LEVEL SECURITY;

-- Allow public read of verified active profiles for matrimony discovery
CREATE POLICY "Public verified profiles discoverable" ON user_profiles
FOR SELECT USING (profile_status IN ('complete', 'verified'));

-- Users can view and manage their own record
CREATE POLICY "Users view self profile" ON user_profiles
FOR ALL USING (auth.uid()::text = user_id);

-- Service role / Admin bypass policy (applied by default on backend service key)
CREATE POLICY "Service role full access on users" ON users
FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Service role full access on verifications" ON user_verifications
FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Service role full access on profiles" ON user_profiles
FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Service role full access on roles" ON user_roles
FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Service role full access on progress" ON registration_progress
FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Service role full access on sessions" ON user_sessions
FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Service role full access on payments" ON payment_transactions
FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Service role full access on reports" ON moderation_reports
FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Users manage own saved searches" ON saved_searches
FOR ALL USING (auth.uid()::text = user_id);

CREATE POLICY "Service role full access on saved_searches" ON saved_searches
FOR ALL TO service_role USING (true) WITH CHECK (true);

-- ============================================================================
-- 14. SEED INITIAL VERIFIED ACCOUNTS & DEMO SCENARIOS
-- ============================================================================
-- Default bcrypt hash for password "Vivah@123"
-- $2a$10$wKkSvdjK.W3L0b3vU2b5mep4hR8a5j0r.Oqg4fD7wUeM4W.hRkW8i
INSERT INTO users (id, full_name, mobile, email, password_hash, gender, dob, profile_created_by, account_status)
VALUES
  ('usr-active-complete', 'Arjun Deshmukh', '9876543210', 'arjun@vivahkarlo.in', '$2a$10$wKkSvdjK.W3L0b3vU2b5mep4hR8a5j0r.Oqg4fD7wUeM4W.hRkW8i', 'Male', '1996-05-14', 'Self', 'active'),
  ('usr-active-incomplete', 'Priya Kulkarni', '9811122233', 'priya@vivahkarlo.in', '$2a$10$wKkSvdjK.W3L0b3vU2b5mep4hR8a5j0r.Oqg4fD7wUeM4W.hRkW8i', 'Female', '1999-08-22', 'Parents', 'active'),
  ('usr-verify-pending', 'Rohan Verma', '9822233344', 'rohan@vivahkarlo.in', '$2a$10$wKkSvdjK.W3L0b3vU2b5mep4hR8a5j0r.Oqg4fD7wUeM4W.hRkW8i', 'Male', '1995-11-03', 'Brother', 'pending_verification'),
  ('usr-suspended', 'Vikram Malhotra', '9833344455', 'suspended@vivahkarlo.in', '$2a$10$wKkSvdjK.W3L0b3vU2b5mep4hR8a5j0r.Oqg4fD7wUeM4W.hRkW8i', 'Male', '1992-02-18', 'Self', 'suspended'),
  ('usr-deleted', 'Ananya Sharma', '9844455566', 'deleted@vivahkarlo.in', '$2a$10$wKkSvdjK.W3L0b3vU2b5mep4hR8a5j0r.Oqg4fD7wUeM4W.hRkW8i', 'Female', '1998-12-09', 'Self', 'deleted');

INSERT INTO user_verifications (user_id, mobile_verified, email_verified)
VALUES
  ('usr-active-complete', TRUE, TRUE),
  ('usr-active-incomplete', TRUE, TRUE),
  ('usr-verify-pending', TRUE, FALSE),
  ('usr-suspended', TRUE, TRUE),
  ('usr-deleted', TRUE, TRUE);

INSERT INTO user_profiles (user_id, profile_status, profile_completion, is_new_user, marital_status, mother_tongue, religion, caste, education, occupation, annual_income, city, state, bio)
VALUES
  ('usr-active-complete', 'complete', 100, FALSE, 'Never Married', 'Marathi', 'Hindu', 'Maratha', 'B.Tech Computer Science (IIT Bombay)', 'VP of Engineering', '₹45,00,000 / yr', 'Mumbai', 'Maharashtra', 'Progressive yet family-oriented tech leader looking for a partner with shared cultural values and mutual respect.'),
  ('usr-active-incomplete', 'incomplete', 0, TRUE, 'Never Married', 'Marathi', 'Hindu', 'Brahmin', 'MBA Finance', 'Financial Analyst', '₹18,00,000 / yr', 'Pune', 'Maharashtra', 'Looking for an ambitious, kind and cultured partner.'),
  ('usr-verify-pending', 'incomplete', 0, TRUE, 'Never Married', 'Hindi', 'Hindu', 'Kshatriya', 'B.Tech IT', 'Software Engineer', '₹15,00,000 / yr', 'Delhi NCR', 'Delhi', 'Verification pending demo user.'),
  ('usr-suspended', 'incomplete', 0, FALSE, 'Divorced', 'Punjabi', 'Hindu', 'Khatri', 'B.Com', 'Business Owner', '₹25,00,000 / yr', 'Chandigarh', 'Punjab', 'Account under safety review.'),
  ('usr-deleted', 'incomplete', 0, FALSE, 'Never Married', 'Hindi', 'Hindu', 'Brahmin', 'BA Arts', 'Content Creator', '₹10,00,000 / yr', 'Jaipur', 'Rajasthan', 'Account marked deleted.');

INSERT INTO user_roles (user_id, role, permissions)
VALUES
  ('usr-active-complete', 'vip', '["browse", "send_interest", "chat", "view_contacts", "priority_search"]'::jsonb),
  ('usr-active-incomplete', 'free', '["browse", "send_interest"]'::jsonb),
  ('usr-verify-pending', 'free', '["browse"]'::jsonb),
  ('usr-suspended', 'free', '[]'::jsonb),
  ('usr-deleted', 'free', '[]'::jsonb);

INSERT INTO registration_progress (user_id, current_step)
VALUES
  ('usr-active-complete', 'completed'),
  ('usr-active-incomplete', 'create_account'),
  ('usr-verify-pending', 'verify_email'),
  ('usr-suspended', 'suspended'),
  ('usr-deleted', 'deleted');

INSERT INTO payment_transactions (txn_id, user_id, user_name, plan_name, amount, status, method)
VALUES
  ('TXN-884210', 'usr-active-complete', 'Arjun Deshmukh', 'Royal VIP 12 Months', 14999.00, 'Success', 'UPI (Google Pay)'),
  ('TXN-884211', 'usr-active-incomplete', 'Priya Kulkarni', 'Gold Connect 3 Months', 4999.00, 'Success', 'HDFC Credit Card'),
  ('TXN-884212', 'usr-verify-pending', 'Rohan Verma', 'Silver Match 1 Month', 1999.00, 'Pending', 'Net Banking');

INSERT INTO moderation_reports (report_id, reporter_id, reported_user_id, reported_user_name, reason, severity, status)
VALUES
  ('REP-10492', 'usr-active-complete', 'usr-suspended', 'Vikram Malhotra', 'Repeated unsolicited contact without mutual interest acceptance', 'Medium', 'Pending');
