import { NextResponse } from "next/server"
import mysql from "mysql2/promise"
import { useEffect, useState } from "react"

export async function POST(req: Request) {
  const body = await req.json()

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  })

  try {
    const [result] = await connection.execute(
      `INSERT INTO students (id, first_name, last_name, year_group, tutor, date_of_birth, safeguarding_status, sen_status, has_confidential_information)
       VALUES (UUID(), ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        body.first_name,
        body.last_name,
        body.year_group,
        body.tutor,
        body.date_of_birth,
        body.safeguarding_status || null,
        body.sen_status || null,
        body.has_confidential_information ? 1 : 0,
      ]
    )

    return NextResponse.json({ message: "Student created successfully" }, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: "Error creating student", error }, { status: 500 })
  } finally {
    await connection.end()
  }
}
