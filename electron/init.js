function createNewSession(db, clientId) {
  const sql = loadSQL("init_user-sessions", { clientId });
  db.prepare(sql).run();
}