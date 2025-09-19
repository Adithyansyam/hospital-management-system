const mysql = require('mysql2/promise');

async function testPatientQuery() {
    const dbConfig = {
        host: '127.0.0.1',
        port: 3306,
        user: 'root',
        password: '',
        database: 'hms'
    };
    
    let connection;
    try {
        console.log('Connecting to database...');
        connection = await mysql.createConnection(dbConfig);
        
        console.log('Testing patient query...');
        const [patients] = await connection.query(
            'SELECT patient_id, patient_name, gender, date_of_birth, blood_group, phone_number, address, previous_medical_history FROM patient_registration ORDER BY patient_name'
        );
        
        console.log(`Found ${patients.length} patients:`);
        console.log(JSON.stringify(patients, null, 2));
        
        // Test the formatting logic
        const formattedPatients = patients.map(patient => ({
            id: patient.patient_id,
            patientNumber: `P${patient.patient_id}`,
            name: patient.patient_name,
            gender: patient.gender,
            dateOfBirth: patient.date_of_birth,
            bloodGroup: patient.blood_group,
            phone: patient.phone_number,
            email: null, // Email column doesn't exist in current table
            address: patient.address,
            medicalHistory: patient.previous_medical_history
        }));
        
        console.log('\nFormatted patients:');
        console.log(JSON.stringify(formattedPatients, null, 2));
        
    } catch (error) {
        console.error('Error:', error);
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

testPatientQuery();