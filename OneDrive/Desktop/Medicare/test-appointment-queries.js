const mysql = require('mysql2/promise');

const dbConfig = {
    host: '127.0.0.1',
    port: 3306,
    user: 'root',
    password: '',
    database: 'hms'
};

async function testAppointmentQueries() {
    let connection;
    try {
        console.log('🔌 Connecting to MySQL database...');
        connection = await mysql.createConnection(dbConfig);
        console.log('✅ Connected successfully!');
        
        // 1. Check if appointment table exists
        console.log('\n📋 Checking appointment table structure...');
        const [tables] = await connection.execute("SHOW TABLES LIKE 'appointment'");
        if (tables.length === 0) {
            console.log('❌ Appointment table does not exist!');
            return;
        }
        console.log('✅ Appointment table exists');
        
        // 2. Get table structure
        const [structure] = await connection.execute("DESCRIBE appointment");
        console.log('\n📊 Appointment table structure:');
        structure.forEach(field => {
            console.log(`  ${field.Field}: ${field.Type} (${field.Null === 'YES' ? 'NULL' : 'NOT NULL'})`);
        });
        
        // 3. Check existing appointments
        const [appointments] = await connection.execute('SELECT COUNT(*) as count FROM appointment');
        console.log(`\n📈 Current appointments: ${appointments[0].count}`);
        
        if (appointments[0].count > 0) {
            console.log('\n📋 Sample appointments:');
            const [sampleAppointments] = await connection.execute('SELECT * FROM appointment LIMIT 3');
            console.table(sampleAppointments);
        }
        
        // 4. Test the JOIN query used in GET /api/appointments
        console.log('\n🔍 Testing JOIN query...');
        try {
            const [joinResult] = await connection.query(`
                SELECT 
                    a.appointment_id,
                    a.patient_id,
                    p.patient_name,
                    a.doctor_id,
                    d.name as doctor_name,
                    a.appointment_date,
                    a.appointment_time,
                    a.reason_for_visit,
                    a.status,
                    a.created_at
                FROM 
                    appointment a
                JOIN 
                    patient_registration p ON a.patient_id = p.patient_id
                JOIN 
                    doctor d ON a.doctor_id = d.doctor_id
                ORDER BY 
                    a.appointment_date DESC, a.appointment_time DESC
                LIMIT 5
            `);
            console.log('✅ JOIN query successful');
            if (joinResult.length > 0) {
                console.log('📋 Sample joined data:');
                console.table(joinResult);
            } else {
                console.log('ℹ️  No appointments found with JOIN');
            }
        } catch (joinError) {
            console.error('❌ JOIN query failed:', joinError.message);
        }
        
        // 5. Check referenced tables
        console.log('\n🔍 Checking referenced tables...');
        
        // Check patients
        const [patientCount] = await connection.execute('SELECT COUNT(*) as count FROM patient_registration');
        console.log(`📊 Patients available: ${patientCount[0].count}`);
        
        // Check doctors
        const [doctorCount] = await connection.execute('SELECT COUNT(*) as count FROM doctor');
        console.log(`📊 Doctors available: ${doctorCount[0].count}`);
        
        // 6. Test a sample appointment insertion
        console.log('\n🧪 Testing appointment insertion...');
        
        // Get a sample patient and doctor
        const [samplePatients] = await connection.execute('SELECT patient_id FROM patient_registration LIMIT 1');
        const [sampleDoctors] = await connection.execute('SELECT doctor_id FROM doctor LIMIT 1');
        
        if (samplePatients.length > 0 && sampleDoctors.length > 0) {
            const testData = {
                patient_id: samplePatients[0].patient_id,
                doctor_id: sampleDoctors[0].doctor_id,
                appointment_date: '2025-09-25',
                appointment_time: '10:00:00',
                reason_for_visit: 'Test appointment',
                status: 'Scheduled'
            };
            
            try {
                // Check if this appointment already exists
                const [existing] = await connection.execute(
                    'SELECT appointment_id FROM appointment WHERE patient_id = ? AND doctor_id = ? AND appointment_date = ? AND appointment_time = ?',
                    [testData.patient_id, testData.doctor_id, testData.appointment_date, testData.appointment_time]
                );
                
                if (existing.length === 0) {
                    const [insertResult] = await connection.execute(
                        'INSERT INTO appointment (patient_id, doctor_id, appointment_date, appointment_time, reason_for_visit, status) VALUES (?, ?, ?, ?, ?, ?)',
                        [testData.patient_id, testData.doctor_id, testData.appointment_date, testData.appointment_time, testData.reason_for_visit, testData.status]
                    );
                    
                    console.log('✅ Test appointment inserted successfully!');
                    console.log(`📝 Appointment ID: ${insertResult.insertId}`);
                    
                    // Verify the insertion with JOIN
                    const [verifyResult] = await connection.query(`
                        SELECT 
                            a.appointment_id,
                            a.patient_id,
                            p.patient_name,
                            a.doctor_id,
                            d.name as doctor_name,
                            a.appointment_date,
                            a.appointment_time,
                            a.reason_for_visit,
                            a.status
                        FROM 
                            appointment a
                        JOIN 
                            patient_registration p ON a.patient_id = p.patient_id
                        JOIN 
                            doctor d ON a.doctor_id = d.doctor_id
                        WHERE a.appointment_id = ?
                    `, [insertResult.insertId]);
                    
                    console.log('✅ Verification with JOIN successful:');
                    console.table(verifyResult);
                } else {
                    console.log('ℹ️  Test appointment already exists, skipping insertion');
                }
            } catch (insertError) {
                console.error('❌ Test insertion failed:', insertError.message);
            }
        } else {
            console.log('❌ No sample patients or doctors found for testing');
        }
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        if (connection) {
            await connection.end();
            console.log('\n🔌 Database connection closed');
        }
    }
}

testAppointmentQueries();