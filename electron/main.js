const { app, BrowserWindow, ipcMain, Menu, Tray } = require("electron");
const { nativeTheme } = require("electron/main");
const path = require("path");
const dotenv = require("dotenv");
const sqlite3 = require("better-sqlite3");
const { Client } = require("pg");
const { useClientQuery, getInitialSql, loadSQL } = require("./lib");
dotenv.config({ path: path.resolve(__dirname, "../.env") });

ipcMain.on("invokeEnv", (event) => {
  event.sender.send("envReply", process.env);
});

let mainWindow;
let db;

const server = require('./server');


function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
    },
  });

  nativeTheme.themeSource = "system";

  mainWindow.on("closed", () => {
    db.close();
    mainWindow = null;
  });

  ipcMain.handle("newClient", async (event, config, test = false) => {
    // Validate required fields in config
    const requiredFields = ["host", "port", "user", "database", "password"];
    for (const field of requiredFields) {
      if (!config[field]) {
        return {
          success: false,
          message: `Missing required field: ${field}`,
          error: `Missing required field: ${field}`,
        };
      }
    }
    const client = new Client(config);

    try {
      // Await the connection to handle errors
      await client.connect();
      await client.query("SELECT 1"); // Simple query to test the connection
      await client.end();

      // save the connection to the database
      if (!test) {
        db.prepare(
          `INSERT INTO dbConnections (nickname, host, port, database, user, password, connectSSH, startupQuery, preConnectScript, serverCA, clientCert, clientKey) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
        ).run(
          config.nickname,
          config.host,
          config.port,
          config.database,
          config.user,
          config.password,
          config.connectSSH ? 1 : 0,
          config.startupQuery ? 1 : 0,
          config.preConnectScript ? 1 : 0,
          config.serverCA || null,
          config.clientCert || null,
          config.clientKey || null
        );
      }

      return { success: true, message: "Database connection successful" };
    } catch (error) {
      return {
        success: false,
        message: "Database connection failed",
        error: error.message,
      };
    }
  });

  ipcMain.handle("getTableNames", async (event, clientId) => {
    if (!clientId) {
      return [];
    }
    const connection = db
      .prepare(`SELECT * FROM dbConnections WHERE id = ?`)
      .get(clientId);
    delete connection.id;
    const client = new Client(connection);
    await client.connect();
    const tableNames = await client.query(
      "SELECT table_name FROM information_schema.tables WHERE table_schema='public'"
    );
    return tableNames.rows.map((row) => row.table_name);
  });

  ipcMain.handle("getConnection", async (event, clientId) => {
    const connection = db.prepare(`SELECT * FROM dbConnections WHERE id = ?`).get(clientId);
    return connection
  });

  ipcMain.handle("getConnections", async (event) => {
    const connections = db.prepare(`SELECT * FROM dbConnections`).all();
    return connections;
  });

  ipcMain.handle("executeQuery", async (event, clientId, query) => {
    // Add the query to the userQueries table
    db.prepare(`INSERT INTO userQueries (clientId, query, timestamp) VALUES (?, ?, ?)`).run(
      clientId,
      query,
      new Date().toISOString()
    );
    return await useClientQuery(clientId, query, db);
  });

  ipcMain.handle("getSessions", async (event) => {
    const sessions = await db.prepare(`SELECT * FROM userSessions`).all();
    if (sessions.length === 0) {
      const clientId = await db.prepare(`SELECT id FROM dbConnections ORDER BY id DESC LIMIT 1`).get();
      console.log('clientId', clientId);
      await db.prepare(`INSERT INTO userSessions (name, clientId, active, query, queryResultsb64, tableDDL, isDDLViewOpen) VALUES ('New Session', ?, 1, '', '', '', 0)`).run(clientId.id);
    }
    return sessions;
  });

  ipcMain.handle("setActiveSession", async (event, sessionId) => {
   const sql = loadSQL("set_active_session", { sessionId });
   await db.prepare(sql).run();
  });

  ipcMain.handle("getTableDDL", async (event, clientId, tableName) => {
    const sql = loadSQL("get_table_ddl", { table: tableName });
    const result = await useClientQuery(clientId, sql, db);
    return result.rows[0].ddl;
  });

  const iconPath = path.join(__dirname, "../public/logoTemplate.png");
  const tray = new Tray(iconPath);

  tray.setTitle("Electron DBC");
  const tooltip = "Welcome to Electron DBC";
  tray.setToolTip(tooltip);

  if (process.platform === "darwin") {
    app.setAppUserModelId("com.example.app");
  }

  if (process.env.NODE_ENV === "development") {
    mainWindow.loadURL("http://localhost:3030");
  } else {
    mainWindow.loadFile(path.join(__dirname, "../out/index.html"));
  }
}

// Initialize SQLite DB
db = new sqlite3(path.join(app.getPath("userData"), "database.db"));
// initial migrations
const initialSql = getInitialSql();
for (const sql of initialSql) {
  db.prepare(loadSQL(sql)).run();
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
