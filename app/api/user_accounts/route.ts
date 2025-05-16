import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const role = searchParams.get("role");

  let connection;
  try {
    connection = await mysql.createConnection({
      host: "localhost",
      user: "cladmin",
      password: "cladmin",
      database: "communitylink"
    });

    let query = `SELECT id, first_name, last_name, job_title, role FROM user_accounts`;
    let params: any[] = [];
    if (role) {
      query += ` WHERE role = ?`;
      params.push(role);
    }
    query += ` ORDER BY first_name, last_name`;

    const [rows] = await connection.execute(query, params);
    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  } finally {
    if (connection) await connection.end();
  }
}
