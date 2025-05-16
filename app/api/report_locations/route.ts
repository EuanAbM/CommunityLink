import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

export async function GET() {
  let connection;
  try {
    connection = await mysql.createConnection({
      host: "localhost",
      user: "cladmin",
      password: "cladmin",
      database: "communitylink"
    });

    const [rows] = await connection.execute(
      `SELECT id, name, description FROM report_locations ORDER BY name`
    );
    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch locations" }, { status: 500 });
  } finally {
    if (connection) await connection.end();
  }
}
