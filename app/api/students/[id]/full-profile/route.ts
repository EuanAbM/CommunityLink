import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

export async function GET(request: Request, context: { params: { id: string } }) {
  const studentId = context.params.id;

  try {
    const connection = await mysql.createConnection({
      host: "localhost",
      user: "cladmin",
      password: "cladmin",
      database: "communitylink",
    });

    const [students] = await connection.execute("SELECT * FROM students WHERE id = ?", [studentId]);
    const [contacts] = await connection.execute("SELECT * FROM student_emergency_contacts WHERE student_id = ?", [studentId]);
    const [registers] = await connection.execute("SELECT * FROM student_registers WHERE student_id = ? ORDER BY date DESC LIMIT 10", [studentId]);    
    const [attendance] = await connection.execute("SELECT * FROM student_attendance WHERE student_id = ?", [studentId]);
    const [progress] = await connection.execute("SELECT * FROM student_progress WHERE student_id = ?", [studentId]);
    const [achievements] = await connection.execute("SELECT * FROM student_achievements WHERE student_id = ?", [studentId]);
    const [extracurricular] = await connection.execute("SELECT * FROM student_extracurricular WHERE student_id = ?", [studentId]);
    const [agencies] = await connection.execute("SELECT * FROM student_agencies WHERE student_id = ?", [studentId]);
    const [documents] = await connection.execute("SELECT * FROM student_documents WHERE student_id = ?", [studentId]);

    await connection.end();

    if (!students || (students as any[]).length === 0) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    const fullProfile = {
      student: (students as any[])[0],
      emergencyContacts: contacts,
      attendanceSummary: attendance,
      registers,
      academicProgress: progress,
      achievements,
      extracurricular,
      agencies,
      documents,
    };

    return NextResponse.json(fullProfile);
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
