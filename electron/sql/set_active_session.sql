-- set_active_session.sql
UPDATE userSessions SET active = 1 WHERE id = ?;