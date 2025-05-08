import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

export async function GET(request: Request, context: { params: { id: string } }) {
  const reportId = context.params.id;

  // Validate reportId
  if (!reportId || isNaN(Number(reportId))) {
    return NextResponse.json({ error: "Invalid report ID" }, { status: 400 });
  }

  let connection;
  try {
    connection = await mysql.createConnection({
      host: "localhost",
      user: "cladmin",
      password: "cladmin",
      database: "communitylink"
    });

    // Get base incident details
    const [incidents] = await connection.execute(
      `SELECT ri.*, 
              rc.parent_category, rc.subcategory_name,
              rl.name AS location_name, rl.description AS location_description,
              ru.first_name AS witness_first_name, ru.last_name AS witness_last_name,
              cu.first_name AS created_by_first_name, cu.last_name AS created_by_last_name,
              rs.name AS status_name
       FROM report_incidents ri
       LEFT JOIN reporting_categories rc ON ri.category_id = rc.id
       LEFT JOIN report_locations rl ON ri.location_id = rl.id
       LEFT JOIN user_accounts ru ON ri.witness_user_id = ru.id
       LEFT JOIN user_accounts cu ON ri.created_by = cu.id
       LEFT JOIN report_statuses rs ON ri.status_id = rs.id
       WHERE ri.id = ?`,
      [reportId]
    );

    if (!Array.isArray(incidents) || incidents.length === 0) {
      return NextResponse.json({ error: "Incident not found" }, { status: 404 });
    }

    const incident = incidents[0];

    // Linked students
    const [linkedStudents] = await connection.execute(
      `SELECT ris.*, s.first_name, s.last_name, s.year_group, s.tutor, s.date_of_birth, 
              s.safeguarding_status, s.sen_status, s.has_confidential_information
       FROM report_incident_students ris
       LEFT JOIN students s ON ris.student_id = s.id
       WHERE ris.report_id = ?`,
      [reportId]
    );

    // Emergency contacts for all linked students
    const studentIds = (linkedStudents as any[]).map((s) => s.student_id);
    let emergencyContacts: any[] = [];
    if (studentIds.length > 0) {
      try {
        console.log("Fetching emergency contacts for student IDs:", studentIds); // Debugging log

        // Use query with proper array handling
        const [contacts] = await connection.query(
          `SELECT * FROM student_emergency_contacts WHERE student_id IN (?)`,
          [studentIds]
        );

        emergencyContacts = contacts as any[];
        console.log("Fetched emergency contacts:", emergencyContacts); // Debugging log
      } catch (error) {
        console.error("Error fetching emergency contacts:", error);
        emergencyContacts = []; // Ensure consistent response
      }
    } else {
      console.warn("No linked students found, skipping emergency contacts query.");
    }

    // Attachments
    const [attachments] = await connection.execute(
      `SELECT ra.*, ua.first_name AS uploaded_by_first_name, ua.last_name AS uploaded_by_last_name
       FROM report_attachments ra
       LEFT JOIN user_accounts ua ON ra.uploaded_by = ua.id
       WHERE ra.report_id = ?`,
      [reportId]
    );

    // Body map markers
    const [bodyMapMarks] = await connection.execute(
      `SELECT * FROM report_body_maps WHERE report_id = ?`,
      [reportId]
    );

    // Notification staff
    const [notifications] = await connection.execute(
      `SELECT rn.*, ua.first_name, ua.last_name, ua.job_title
       FROM report_notifications rn
       LEFT JOIN user_accounts ua ON rn.user_id = ua.id
       WHERE rn.report_id = ?`,
      [reportId]
    );

    return NextResponse.json({
      incident,
      linkedStudents: linkedStudents || [],
      emergencyContacts: emergencyContacts || [],
      attachments: attachments || [],
      bodyMapMarks: bodyMapMarks || [],
      notifications: notifications || []
    });
  } catch (error) {
    console.error("Error in GET /api/incidents/[id]:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}
