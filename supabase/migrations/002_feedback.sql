-- Anonymous feedback and requests (see docs/analytics.md)

CREATE TABLE user_feedback (
  feedback_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES anonymous_users (user_id) ON DELETE CASCADE,
  kind TEXT NOT NULL CHECK (kind IN ('feedback', 'request')),
  message TEXT NOT NULL CHECK (
    char_length(trim(message)) >= 3 AND char_length(message) <= 2000
  ),
  page_path TEXT,
  lesson_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX user_feedback_created_at_idx ON user_feedback (created_at DESC);

ALTER TABLE user_feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY anon_insert_feedback ON user_feedback
  FOR INSERT TO anon WITH CHECK (true);
