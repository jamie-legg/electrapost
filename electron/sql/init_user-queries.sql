CREATE TABLE IF NOT EXISTS userQueries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    clientId INTEGER,
    query TEXT,
    timestamp TEXT,
    FOREIGN KEY (clientId) REFERENCES dbConnections(id)
);