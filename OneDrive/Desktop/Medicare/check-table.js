const mysql = require('mysql2/promise');

async function checkTableStructure() {
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
        
        console.log('Checking patient_registration table structure...');
        const [columns] = await connection.query('DESCRIBE patient_registration');
        
        console.log('Available columns:');
        columns.forEach(col => {
            console.log(`- ${col.Field} (${col.Type})`);
        });
        
        console.log('\nTesting query without email column...');
        const [patients] = await connection.query(
            'SELECT * FROM patient_registration LIMIT 1'
        );
        
        console.log('\nSample patient record:');
        console.log(JSON.stringify(patients[0], null, 2));
        
    } catch (error) {
        console.error('Error:', error);
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

checkTableStructure();