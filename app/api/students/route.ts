// app/api/students/route.ts
import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

export async function GET() {
  const connection = await mysql.createConnection({
    host: "localhost",
    user: "cladmin", 
    password: "cladmin",
    database: "communitylink",
  });

  const [rows] = await connection.execute("SELECT * FROM students");
  await connection.end();

  return NextResponse.json(rows);
}


