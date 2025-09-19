const mysql = require('mysql2/promise');

const dbConfig = {
    host: '127.0.0.1',
    port: 3306,
    user: 'root',
    password: '',
    database: 'hms'
};

async function checkPatients() {
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        console.log('Connected to database');
        
        // Check if patient_registration table exists
        const [tables] = await connection.query("SHOW TABLES LIKE 'patient_registration'");
        console.log('Patient table exists:', tables.length > 0);
        
        if (tables.length > 0) {
            // Get patient count
            const [count] = await connection.query('SELECT COUNT(*) as count FROM patient_registration');
            console.log(`Found ${count[0].count} patients in the database`);
            
            // Show first few patients
            const [patients] = await connection.query('SELECT * FROM patient_registration LIMIT 3');
            console.log('Sample patients:', JSON.stringify(patients, null, 2));
        }
        
    } catch (error) {
        console.error('Error:', error);
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

checkPatients();