-- create_table.sql

CREATE TABLE IF NOT EXISTS dbConnections (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nickname TEXT,
  host TEXT,
  port INTEGER,
  database TEXT,
  user TEXT,
  password TEXT,
  connectSSH BOOLEAN,
  startupQuery BOOLEAN,
  preConnectScript BOOLEAN,
  serverCA BLOB,
  clientCert BLOB,
  clientKey BLOB
);
