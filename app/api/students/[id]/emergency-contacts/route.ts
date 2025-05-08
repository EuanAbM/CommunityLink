import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const studentId = params.id;

  try {
    const connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "password", // Replace with your database password
      database: "communitylink", // Replace with your database name
    });

    const [contacts] = await connection.query(
      `SELECT * FROM student_emergency_contacts WHERE student_id = ?`,
      [studentId]
    );

    await connection.end();

    return NextResponse.json(contacts);
  } catch (error) {
    console.error("Error fetching emergency contacts:", error);
    return NextResponse.json({ error: "Failed to fetch emergency contacts" }, { status: 500 });
  }
}