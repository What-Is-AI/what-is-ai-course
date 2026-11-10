-- Replace open anon UPDATE policies (USING true) with id-scoped RPCs.
-- Previously anon could PATCH every session/attempt row via PostgREST.

DROP POLICY IF EXISTS anon_update_sessions ON learning_sessions;
DROP POLICY IF EXISTS anon_update_attempts ON lesson_attempts;

CREATE OR REPLACE FUNCTION touch_learning_session(p_session_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE learning_sessions
  SET last_seen_at = now()
  WHERE session_id = p_session_id
    AND ended_at IS NULL;
END;
$$;

CREATE OR REPLACE FUNCTION end_learning_session(p_session_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE learning_sessions
  SET ended_at = now(), last_seen_at = now()
  WHERE session_id = p_session_id
    AND ended_at IS NULL;
END;
$$;

CREATE OR REPLACE FUNCTION touch_lesson_attempt(p_attempt_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE lesson_attempts
  SET last_seen_at = now()
  WHERE attempt_id = p_attempt_id
    AND completion_status = 'started';
END;
$$;

CREATE OR REPLACE FUNCTION complete_lesson_attempt(p_attempt_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE lesson_attempts
  SET
    completed_at = now(),
    last_seen_at = now(),
    completion_status = 'completed'
  WHERE attempt_id = p_attempt_id
    AND completion_status = 'started';
END;
$$;

CREATE OR REPLACE FUNCTION abandon_lesson_attempt(p_attempt_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE lesson_attempts
  SET
    last_seen_at = now(),
    completion_status = 'abandoned'
  WHERE attempt_id = p_attempt_id
    AND completion_status = 'started';
END;
$$;

REVOKE ALL ON FUNCTION touch_learning_session(uuid) FROM PUBLIC;
REVOKE ALL ON FUNCTION end_learning_session(uuid) FROM PUBLIC;
REVOKE ALL ON FUNCTION touch_lesson_attempt(uuid) FROM PUBLIC;
REVOKE ALL ON FUNCTION complete_lesson_attempt(uuid) FROM PUBLIC;
REVOKE ALL ON FUNCTION abandon_lesson_attempt(uuid) FROM PUBLIC;

GRANT EXECUTE ON FUNCTION touch_learning_session(uuid) TO anon;
GRANT EXECUTE ON FUNCTION end_learning_session(uuid) TO anon;
GRANT EXECUTE ON FUNCTION touch_lesson_attempt(uuid) TO anon;
GRANT EXECUTE ON FUNCTION complete_lesson_attempt(uuid) TO anon;
GRANT EXECUTE ON FUNCTION abandon_lesson_attempt(uuid) TO anon;
