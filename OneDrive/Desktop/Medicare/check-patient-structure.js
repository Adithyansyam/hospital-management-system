const mysql = require('mysql2/promise');

const dbConfig = {
    host: '127.0.0.1',
    port: 3306,
    user: 'root',
    password: '',
    database: 'hms'
};

async function checkPatientTableStructure() {
    let connection;
    try {
        console.log('Connecting to MySQL database...');
        connection = await mysql.createConnection(dbConfig);
        console.log('Connected successfully!');
        
        // Get table structure
        console.log('\n📋 patient_registration table structure:');
        const [columns] = await connection.execute("DESCRIBE patient_registration");
        console.table(columns);
        
        // Check existing data with correct columns
        const [rows] = await connection.execute("SELECT COUNT(*) as count FROM patient_registration");
        console.log(`\n📊 Number of patients: ${rows[0].count}`);
        
        if (rows[0].count > 0) {
            console.log('\n📋 Sample patient data:');
            const [sampleData] = await connection.execute("SELECT * FROM patient_registration LIMIT 3");
            console.table(sampleData);
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

checkPatientTableStructure();