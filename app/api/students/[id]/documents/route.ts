import { NextRequest, NextResponse } from "next/server";
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { writeFile, mkdir } from 'fs/promises';
import mysql from "mysql2/promise";

// Define upload directory path 
const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads', 'documents');

// Ensure the directory exists
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await getServerSession();
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Ensure upload directory exists
    await mkdir(UPLOADS_DIR, { recursive: true });
    
    // Parse form data from request
    const formData = await request.formData();
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }
    
    // Generate unique filename
    const uniqueId = uuidv4();
    const fileExtension = path.extname(file.name);
    const sanitizedFileName = `${uniqueId}${fileExtension}`;
    const filePath = path.join(UPLOADS_DIR, sanitizedFileName);
    
    // Convert file to buffer and save to disk
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(filePath, buffer);
    
    // Save file metadata to database
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "cladmin",
      password: process.env.DB_PASSWORD || "cladmin",
      database: process.env.DB_NAME || "communitylink",
    });
    
    // Get current date in MySQL format
    const uploadDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
    
    // Insert document record
    const [result] = await connection.execute(
      `INSERT INTO documents (student_id, file_name, file_path, description, uploaded_at, uploaded_by, file_type) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        params.id,
        title || file.name,
        `/uploads/documents/${sanitizedFileName}`, // URL path to file
        description || "",
        uploadDate,
        "System", // Replace with actual user info when auth is implemented
        file.type
      ]
    );
    
    await connection.end();
    
    // Get the inserted ID
    const documentId = (result as any).insertId;
    
    // Return the new document data
    return NextResponse.json({
      id: documentId,
      student_id: params.id,
      file_name: title || file.name,
      file_path: `/uploads/documents/${sanitizedFileName}`,
      description: description || "",
      uploaded_at: uploadDate,
      uploaded_by: "System",
      file_type: file.type
    }, { status: 201 });
    
  } catch (error: any) {
    console.error("Error uploading document:", error);
    return NextResponse.json(
      { error: error.message || "Failed to upload document" },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest, 
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await getServerSession();
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    
    const studentId = params.id;
    
    // Fetch all documents for this student
    const documents = await db.document.findMany({
      where: { student_id: studentId },
      orderBy: { uploaded_at: 'desc' },
    });
    
    return NextResponse.json(documents);
  } catch (error) {
    console.error('[DOCUMENT_GET]', error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
