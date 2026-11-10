-- Anonymous learning analytics (see docs/analytics.md)

CREATE TABLE anonymous_users (
  user_id UUID PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE learning_sessions (
  session_id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES anonymous_users (user_id) ON DELETE CASCADE,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_seen_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ended_at TIMESTAMPTZ
);

CREATE TABLE lesson_attempts (
  attempt_id UUID PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES learning_sessions (session_id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES anonymous_users (user_id) ON DELETE CASCADE,
  lesson_id TEXT NOT NULL,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_seen_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ,
  duration_seconds INTEGER,
  completion_status TEXT NOT NULL DEFAULT 'started'
    CHECK (completion_status IN ('started', 'completed', 'abandoned'))
);

CREATE TABLE question_answers (
  answer_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  attempt_id UUID NOT NULL REFERENCES lesson_attempts (attempt_id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES anonymous_users (user_id) ON DELETE CASCADE,
  lesson_id TEXT NOT NULL,
  question_id TEXT NOT NULL,
  selected_option_id TEXT NOT NULL,
  is_correct BOOLEAN,
  answered_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX learning_sessions_user_id_idx ON learning_sessions (user_id);
CREATE INDEX lesson_attempts_lesson_id_idx ON lesson_attempts (lesson_id);
CREATE INDEX lesson_attempts_user_id_idx ON lesson_attempts (user_id);
CREATE INDEX question_answers_question_id_idx ON question_answers (question_id);

CREATE OR REPLACE FUNCTION set_lesson_attempt_duration()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.completed_at IS NOT NULL AND NEW.started_at IS NOT NULL THEN
    NEW.duration_seconds := EXTRACT(EPOCH FROM (NEW.completed_at - NEW.started_at))::INTEGER;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER lesson_attempts_duration
  BEFORE INSERT OR UPDATE ON lesson_attempts
  FOR EACH ROW
  EXECUTE FUNCTION set_lesson_attempt_duration();

ALTER TABLE anonymous_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE question_answers ENABLE ROW LEVEL SECURITY;

-- Insert-only from browser. Open UPDATE policies below are dropped in 004
-- (replaced by id-scoped SECURITY DEFINER RPCs).
CREATE POLICY anon_insert_users ON anonymous_users
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY anon_insert_sessions ON learning_sessions
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY anon_insert_attempts ON lesson_attempts
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY anon_insert_answers ON question_answers
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY anon_update_sessions ON learning_sessions
  FOR UPDATE TO anon USING (true) WITH CHECK (true);

CREATE POLICY anon_update_attempts ON lesson_attempts
  FOR UPDATE TO anon USING (true) WITH CHECK (true);
