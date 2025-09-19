const mysql = require('mysql2/promise');

async function testMySQLConnection() {
    console.log('Testing MySQL connection...');
    
    // Test different connection configurations
    const configs = [
        {
            name: 'IPv4 Localhost',
            config: {
                host: '127.0.0.1',
                port: 3306,
                user: 'root',
                password: ''
            }
        },
        {
            name: 'IPv6 Localhost',
            config: {
                host: 'localhost',
                port: 3306,
                user: 'root',
                password: ''
            }
        }
    ];
    
    for (const { name, config } of configs) {
        console.log(`\n--- Testing ${name} ---`);
        let connection;
        try {
            connection = await mysql.createConnection({
                ...config,
                connectTimeout: 5000
            });
            
            console.log(`✅ ${name}: Connection successful!`);
            
            // Test if we can query databases
            const [databases] = await connection.query('SHOW DATABASES');
            console.log(`   Found ${databases.length} databases`);
            
            // Check for our specific database
            const hospitalDb = databases.find(db => Object.values(db)[0] === 'hms');
            if (hospitalDb) {
                console.log('   ✅ hms database found');
                
                // Test connection to our database
                await connection.query('USE hms');
                const [tables] = await connection.query('SHOW TABLES');
                console.log(`   Found ${tables.length} tables:`, tables.map(t => Object.values(t)[0]));
                
                // Check for patient data
                try {
                    const [patientCount] = await connection.query('SELECT COUNT(*) as count FROM patient_registration');
                    console.log(`   Found ${patientCount[0].count} patients`);
                } catch (e) {
                    console.log('   ⚠️  patient_registration table not found or empty');
                }
            } else {
                console.log('   ⚠️  hms database NOT found');
            }
            
        } catch (error) {
            console.log(`❌ ${name}: Connection failed`);
            console.log(`   Error: ${error.code} - ${error.message}`);
            
            if (error.code === 'ECONNREFUSED') {
                console.log('   💡 This usually means MySQL server is not running');
            }
        } finally {
            if (connection) {
                await connection.end();
            }
        }
    }
    
    console.log('\n--- Troubleshooting Steps ---');
    console.log('1. Make sure XAMPP is installed and running');
    console.log('2. Open XAMPP Control Panel');
    console.log('3. Start MySQL service (click Start button next to MySQL)');
    console.log('4. Green "Running" status should appear next to MySQL');
    console.log('5. Try running this script again');
    console.log('6. If still failing, check if another MySQL service is running on port 3306');
}

testMySQLConnection().catch(console.error);