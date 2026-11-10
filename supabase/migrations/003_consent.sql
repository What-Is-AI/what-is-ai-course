-- Cookie / analytics consent audit trail (GDPR Art. 7 accountability)

CREATE TABLE consent_events (
  event_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES anonymous_users (user_id) ON DELETE SET NULL,
  purpose TEXT NOT NULL CHECK (purpose IN ('google_analytics')),
  action TEXT NOT NULL CHECK (action IN ('grant', 'withdraw')),
  policy_version TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX consent_events_user_id_idx ON consent_events (user_id);
CREATE INDEX consent_events_created_at_idx ON consent_events (created_at DESC);

ALTER TABLE consent_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY anon_insert_consent_events ON consent_events
  FOR INSERT TO anon WITH CHECK (true);
