CREATE TABLE IF NOT EXISTS userSessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    clientId INTEGER,
    active INTEGER DEFAULT 0,
    query TEXT,
    queryResultsb64 TEXT,
    tableDDL TEXT,
    isDDLViewOpen INTEGER DEFAULT 0,
    FOREIGN KEY (clientId) REFERENCES dbConnections(id)
);