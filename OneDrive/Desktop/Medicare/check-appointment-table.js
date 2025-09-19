const mysql = require('mysql2/promise');

const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'hms'
};

async function checkAppointmentTable() {
    let connection;
    try {
        console.log('Connecting to MySQL database...');
        connection = await mysql.createConnection(dbConfig);
        console.log('Connected successfully!');
        
        // Check if appointment table exists and get its structure
        const [tables] = await connection.execute("SHOW TABLES LIKE 'appointment'");
        if (tables.length === 0) {
            console.log('❌ Appointment table does not exist!');
            return;
        }
        
        console.log('✅ Appointment table exists');
        
        // Get table structure
        console.log('\n📋 Appointment table structure:');
        const [columns] = await connection.execute("DESCRIBE appointment");
        console.table(columns);
        
        // Check if there are any records
        const [rows] = await connection.execute("SELECT COUNT(*) as count FROM appointment");
        console.log(`\n📊 Number of appointment records: ${rows[0].count}`);
        
        // Show sample data if any exists
        if (rows[0].count > 0) {
            console.log('\n📋 Sample appointment data:');
            const [sampleData] = await connection.execute("SELECT * FROM appointment LIMIT 5");
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

checkAppointmentTable();