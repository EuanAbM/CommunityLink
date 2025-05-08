import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

// This function handles POST requests to create new incidents
export async function POST(request: Request) {
  let connection;
  try {
    // Parse the JSON body from the request
    const body = await request.json();
    
    console.log("Received form submission data:", body);
    
    // Create database connection (using the same credentials as your GET route)
    connection = await mysql.createConnection({
      host: "localhost",
      user: "cladmin",
      password: "cladmin", 
      database: "communitylink"
    });
    
    // Start a transaction - this ensures all data is saved together or not at all
    await connection.beginTransaction();
    
    try {
      // STEP 1: Insert the main incident record
      console.log("Inserting main incident record...");
      
      const {
        id,
        details,
        incident_date,
        incident_time,
        actions_taken,
        requires_follow_up,
        is_confidential,
        urgent,
        status_id,
        created_by,
        student_id,
        role
      } = body;

      await connection.execute(
        `INSERT INTO report_incidents (
          id, category_id, location_id, incident_date, incident_time, 
          details, witness_user_id, actions_taken, 
          requires_follow_up, is_confidential, urgent, 
          created_by, status_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,

        [
          id,
          body.categoryId || 1,             // Default to category 1 if missing
          body.locationId || 1,             // Default to location 1 if missing
          body.incidentDate || new Date(),  // Default to today if missing
          body.incidentTime || '12:00:00',  // Default time if missing
          body.details || '',               // Description of the incident
          body.witnessUserId || null,       // Can be null if no witness
          body.actionsTaken || '',          // Actions already taken
          body.requiresFollowUp ? 1 : 0,    // Boolean to int conversion
          body.isConfidential ? 1 : 0,      // Boolean to int conversion
          body.urgent ? 1 : 0,              // Boolean to int conversion
          body.createdBy || 1,              // Default to user 1 if missing
          1                                 // Default status (new/open)
        ]
      );
      
      // @ts-ignore - Extract the auto-generated ID for the new incident
      const reportId = id;
      console.log("Created incident with ID:", reportId);

      // Insert into report_incident_students
      await connection.execute(
        `INSERT INTO report_incident_students (report_id, student_id, role)
         VALUES (?, ?, ?)`,
        [id, student_id, "involved"]
      );
      
      // STEP 2: Link the primary student to the incident
      if (body.primaryStudent) {
        console.log("Linking primary student:", body.primaryStudent);
        
        await connection.execute(
          `INSERT INTO report_incident_students (report_id, student_id, role) 
           VALUES (?, ?, ?)`,
          [reportId, body.primaryStudent, 'primary']
        );
      }
      
      // STEP 3: Link any additional students
      if (body.linkedStudents && body.linkedStudents.length > 0) {
        console.log("Linking additional students:", body.linkedStudents);
        
        // Create array of values for bulk insert
        const linkedStudentValues = body.linkedStudents.map((studentId: string) => 
          [reportId, studentId, 'involved']
        );
        
        // Bulk insert all linked students
        await connection.query(
          `INSERT INTO report_incident_students (report_id, student_id, role) VALUES ?`, 
          [linkedStudentValues]
        );
      }
      
      // STEP 4: Save any body map markers
      if (body.bodyMapMarkers && body.bodyMapMarkers.length > 0) {
        console.log("Saving body map markers:", body.bodyMapMarkers.length);
        
        const markerValues = body.bodyMapMarkers.map((marker: any) => [
          reportId,                  // The incident ID
          marker.view || "front",    // Default to "front" view
          marker.x,                  // X coordinate
          marker.y,                  // Y coordinate
          marker.note || ""          // Marker note (if any)
        ]);
        
        await connection.query(
          `INSERT INTO report_body_maps (report_id, body_map_id, x_coord, y_coord, details) VALUES ?`, 
          [markerValues]
        );
      }
      
      // STEP 5: Create notification records for staff
      if (body.notifyStaff && body.notifyStaff.length > 0) {
        console.log("Creating staff notifications for:", body.notifyStaff);
        
        const notificationValues = body.notifyStaff.map((userId: number) => 
          [reportId, userId]
        );
        
        await connection.query(
          `INSERT INTO report_notifications (report_id, user_id) VALUES ?`, 
          [notificationValues]
        );
      }
      
      // STEP 6: Commit all changes to the database
      console.log("Committing transaction...");
      await connection.commit();
      
      // Close the database connection
      await connection.end();
      
      // Return success response with the new incident ID
      return NextResponse.json({ 
        success: true, 
        reportId: reportId,
        message: "Incident report created successfully"
      }, { status: 201 }); // 201 = Created
      
    } catch (error) {
      // If any error occurs during the transaction, roll back all changes
      console.error("Transaction error:", error);
      await connection.rollback();
      await connection.end();
      throw error; // Re-throw to be caught by the outer catch
    }
    
  } catch (error) {
    // Handle any errors during the API execution
    console.error("Error creating incident:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to create incident report",
        details: error instanceof Error ? error.message : "Unknown error"
      }, 
      { status: 500 }
    );
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}