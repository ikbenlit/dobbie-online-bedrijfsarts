-- Migration: Extend trial period to 30 days and add subscription status tracking
-- Date: 2025-06-22
-- Purpose: Implement 30-day trial with manual conversion workflow

-- 1. Extend trial period from 7 to 30 days for new users
ALTER TABLE profiles ALTER COLUMN trial_end_date 
SET DEFAULT (NOW() + INTERVAL '30 days');

-- 2. Add subscription status tracking
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_subscription_status_check;
ALTER TABLE profiles ADD CONSTRAINT profiles_subscription_status_check 
CHECK (subscription_status IN (
  'trial',          -- 0-30 dagen gratis toegang
  'expired',        -- Trial verlopen, geen toegang
  'manual_active',  -- Handmatig geactiveerd door Talar
  'blocked'         -- Admin blocked
));

-- 3. Add contact tracking columns
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS contacted_for_conversion BOOLEAN DEFAULT false;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS conversion_notes TEXT;

-- 4. Function to manually activate users (for Talar)
CREATE OR REPLACE FUNCTION manually_activate_user(
  profile_id UUID,
  notes TEXT DEFAULT NULL
)
RETURNS void AS $$
BEGIN
  UPDATE profiles SET
    subscription_status = 'manual_active',
    conversion_notes = notes,
    updated_at = NOW()
  WHERE id = profile_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Function to check trial expiry status
CREATE OR REPLACE FUNCTION check_trial_expiry()
RETURNS TABLE(
  profile_id UUID,
  email TEXT,
  full_name TEXT,
  days_remaining INTEGER,
  last_activity TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.email,
    p.full_name,
    EXTRACT(days FROM p.trial_end_date - NOW())::INTEGER,
    p.updated_at
  FROM profiles p
  WHERE p.subscription_status = 'trial'
  ORDER BY p.trial_end_date ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Function to auto-expire trial users
CREATE OR REPLACE FUNCTION auto_expire_trials()
RETURNS void AS $$
BEGIN
  UPDATE profiles 
  SET subscription_status = 'expired'
  WHERE subscription_status = 'trial' 
    AND trial_end_date < NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions for admin functions
GRANT EXECUTE ON FUNCTION manually_activate_user(UUID, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION check_trial_expiry() TO authenticated;
GRANT EXECUTE ON FUNCTION auto_expire_trials() TO authenticated;

-- Add index for performance on trial_end_date queries
CREATE INDEX IF NOT EXISTS idx_profiles_trial_end_date ON profiles(trial_end_date) 
WHERE subscription_status = 'trial';

-- Add index for subscription status queries
CREATE INDEX IF NOT EXISTS idx_profiles_subscription_status ON profiles(subscription_status);

-- Comment explaining the migration
COMMENT ON COLUMN profiles.trial_end_date IS 'Trial expiry date - new users get 30 days from registration';
COMMENT ON COLUMN profiles.contacted_for_conversion IS 'Flag to track if user has been contacted for conversion';
COMMENT ON COLUMN profiles.conversion_notes IS 'Admin notes about conversion attempts or status';