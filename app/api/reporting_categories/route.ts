import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    console.log("API: Fetching reporting categories from database");
    
    // Query all categories from the database
    const [rows] = await db.query(`
      SELECT 
        id, 
        name, 
        parent_id, 
        description,
        is_active
      FROM 
        reporting_categories
      WHERE 
        is_active = 1
      ORDER BY 
        CASE WHEN parent_id IS NULL THEN 0 ELSE 1 END, 
        parent_id, 
        name
    `);
    
    console.log(`API: Retrieved ${rows?.length || 0} reporting categories`);
    
    // Return the data as JSON
    return NextResponse.json(rows || [], {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error("API Error in reporting_categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch reporting categories" },
      { status: 500 }
    );
  }
}
