const mysql = require('mysql2/promise');

// Database configuration
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '', // Default XAMPP password is empty
    multipleStatements: true
};

async function setupDatabase() {
    let connection;
    try {
        console.log('Connecting to MySQL server...');
        connection = await mysql.createConnection(dbConfig);
        
        // Check if database exists
        console.log('Checking if database exists...');
        const [databases] = await connection.query("SHOW DATABASES LIKE 'hospital_management_system'");
        
        if (databases.length === 0) {
            console.log('Database does not exist. Creating database...');
            await connection.query('CREATE DATABASE hospital_management_system');
            console.log('Database created successfully!');
        } else {
            console.log('Database already exists.');
        }
        
        // Switch to the database
        await connection.query('USE hospital_management_system');
        
        // Check if tables exist
        console.log('Checking tables...');
        const [tables] = await connection.query("SHOW TABLES");
        console.log('Existing tables:', tables.map(t => Object.values(t)[0]));
        
        // Check if patient_registration table has data
        try {
            const [patientCount] = await connection.query('SELECT COUNT(*) as count FROM patient_registration');
            console.log(`Found ${patientCount[0].count} patients in the database`);
            
            if (patientCount[0].count > 0) {
                const [samplePatients] = await connection.query('SELECT patient_id, patient_name, phone_number, email FROM patient_registration LIMIT 3');
                console.log('Sample patients:', samplePatients);
            }
        } catch (error) {
            console.log('Patient table might not exist or have issues:', error.message);
        }
        
        console.log('\nDatabase setup complete!');
        console.log('You can now start the server with: node server.js');
        
    } catch (error) {
        console.error('Error setting up database:', error);
        console.error('\nTroubleshooting steps:');
        console.error('1. Make sure XAMPP is running');
        console.error('2. Make sure MySQL service is started in XAMPP');
        console.error('3. Check if you have the correct MySQL credentials');
        console.error('4. Run the hospital_db.sql file in phpMyAdmin or MySQL Workbench');
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

setupDatabase();