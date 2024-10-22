const fs = require("fs");
const path = require("path");
const { Client } = require("pg");

/**
 * @param {string} sql
 * @returns {number}
 */
function getQueryComplexity(sql) {
  let complexity = 1;

  // Normalize the SQL string to lowercase for easier analysis
  const lowerSql = sql.toLowerCase();

  // Increase complexity based on the presence of certain keywords/clauses
  if (lowerSql.includes("join")) complexity += 3;
  if (lowerSql.includes("subquery") || lowerSql.includes("select"))
    complexity += 2;
  if (lowerSql.includes("group by")) complexity += 2;
  if (lowerSql.includes("order by")) complexity += 1;
  if (lowerSql.includes("distinct")) complexity += 1;
  if (lowerSql.includes("union") || lowerSql.includes("intersect"))
    complexity += 2;
  if (lowerSql.includes("having")) complexity += 1;

  // Limit the complexity score to a maximum of 10
  return Math.min(complexity, 10);
}

/**
 * @typedef {Object} QueryInfo
 * @property {number} duration - Query duration in milliseconds
 * @property {number} rowCount - Number of rows returned
 * @property {string} status - Query status
 * @property {number} complexity - Query complexity score
 */

/**
 * @typedef {Object} QueryResult
 * @property {Object[]} rows - Array of result rows
 * @property {string[]} columns - Array of column names
 * @property {QueryInfo} info - Information about the query execution
 * @property {string[]} history - Array of recent queries
 */

/**
 * @param {number} clientId
 * @param {string} query
 * @param {Database} db
 * @returns {Promise<QueryResult>}
 */

async function useClientQuery(clientId, query, db) {
  const connection = db
    .prepare(`SELECT * FROM dbConnections WHERE id = ?`)
    .get(clientId);
  const client = new Client(connection);
  await client.connect();

  const startTime = Date.now(); // Start time
  let results, status;

  try {
    results = await client.query(query);
    status = "success"; // Query was successful
  } catch (error) {
    console.error("Query failed", error);
    status = "failed"; // Query failed
    results = { rows: [], rowCount: 0, fields: [] };
  } finally {
    await client.end();
  }

  const endTime = Date.now(); // End time
  const complexity = getQueryComplexity(query); // Get query complexity
  // attach last 10 queries to the results as history
  const lastQueries = db
    .prepare(
      `SELECT query FROM userQueries WHERE clientId = ? ORDER BY id DESC LIMIT 10`
    )
    .all(clientId);

  return {
    rows: results.rows,
    columns: results.fields.map((field) => field.name),
    info: {
      duration: endTime - startTime, // Query duration in milliseconds
      rowCount: results.rowCount, // Number of rows returned
      status: status, // Query status
      complexity: complexity, // Query complexity score
    },
    history: lastQueries.map((query) => query.query),
  };
}

/**
 * @returns {string[]} An array of SQL file names
 */
function getInitialSql() {
  // use fs to read all the sql files in the sql folder
  const sqlFiles = fs.readdirSync(path.join(__dirname, "sql"));
  const fileNames = sqlFiles.filter((file) => file.startsWith("init_"));
  return fileNames.map((file) => file.replace(".sql", ""));
}

/**
 * @param {string} fileName
 * @param {Object} params
 * @returns {string}
 */
function loadSQL(fileName, params = {}) {
  let sql = fs.readFileSync(
    path.join(__dirname, `sql/${fileName}.sql`),
    "utf8"
  );

  // Replace placeholders with actual parameters
  for (const [key, value] of Object.entries(params)) {
    const placeholder = `\\$\\$${key.toUpperCase()}\\$\\$`;

    // count instances of the placeholder
    const count = (sql.match(new RegExp(placeholder, "g")) || []).length;

    if (count < 1) {
      throw new Error(
        `Placeholder ${placeholder} is not found in ${fileName}.sql`
      );
    }
    sql = sql.replace(new RegExp(placeholder, "g"), value);
  }

  return sql;
}

function getActiveSessionId() {
  return db.prepare(`SELECT id FROM userQueries ORDER BY id DESC LIMIT 1`).get();
}

module.exports = {
  getQueryComplexity,
  useClientQuery,
  getInitialSql,
  getActiveSessionId,
  loadSQL,
};
