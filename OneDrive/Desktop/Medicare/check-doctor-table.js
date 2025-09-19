const mysql = require('mysql2/promise');

async function checkDoctorTable() {
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
        
        console.log('Checking doctor table structure...');
        const [columns] = await connection.query('DESCRIBE doctor');
        
        console.log('Available columns in doctor table:');
        columns.forEach((col, index) => {
            console.log(`${index + 1}. ${col.Field} (${col.Type}) - ${col.Null === 'YES' ? 'NULLABLE' : 'NOT NULL'}`);
        });
        
        console.log(`\nTotal columns: ${columns.length}`);
        
    } catch (error) {
        console.error('Error:', error);
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

checkDoctorTable();