import mysql from "mysql2/promise";

// Create a connection pool that can be reused
export async function db() {
  return await mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "cladmin", 
    password: process.env.DB_PASSWORD || "cladmin",
    database: process.env.DB_NAME || "communitylink",
  });
}

// Helper function for executing queries
export async function executeQuery(query: string, values: any[] = []) {
  const connection = await db();
  try {
    const [results] = await connection.execute(query, values);
    return results;
  } finally {
    await connection.end();
  }
}
