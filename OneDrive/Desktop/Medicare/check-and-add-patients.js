const mysql = require('mysql2/promise');

const dbConfig = {
    host: '127.0.0.1',
    port: 3306,
    user: 'root',
    password: '',
    database: 'hms'
};

async function checkPatientsData() {
    let connection;
    try {
        console.log('Connecting to MySQL database...');
        connection = await mysql.createConnection(dbConfig);
        console.log('Connected successfully!');
        
        // Check if patient_registration table exists
        const [tables] = await connection.execute("SHOW TABLES LIKE 'patient_registration'");
        if (tables.length === 0) {
            console.log('❌ patient_registration table does not exist!');
            return;
        }
        
        console.log('✅ patient_registration table exists');
        
        // Check number of patients
        const [rows] = await connection.execute("SELECT COUNT(*) as count FROM patient_registration");
        console.log(`📊 Number of patients: ${rows[0].count}`);
        
        // Show sample patient data if any exists
        if (rows[0].count > 0) {
            console.log('\n📋 Sample patient data:');
            const [sampleData] = await connection.execute("SELECT patient_id, patient_name, phone_number, email FROM patient_registration LIMIT 5");
            console.table(sampleData);
        } else {
            console.log('\n⚠️  No patients found in database!');
            console.log('Adding sample patients...');
            
            // Add sample patients
            const samplePatients = [
                ['John Doe', 'johndoe@email.com', '1234567890', '1985-03-15', 'Male', '123 Main St', 'New York', 'NY', '10001'],
                ['Jane Smith', 'janesmith@email.com', '0987654321', '1990-07-22', 'Female', '456 Oak Ave', 'Los Angeles', 'CA', '90001'],
                ['Mike Johnson', 'mikejohnson@email.com', '5555555555', '1978-11-30', 'Male', '789 Pine Rd', 'Chicago', 'IL', '60601']
            ];
            
            for (const patient of samplePatients) {
                await connection.execute(
                    'INSERT INTO patient_registration (patient_name, email, phone_number, date_of_birth, gender, address, city, state, pincode) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
                    patient
                );
            }
            
            console.log('✅ Sample patients added successfully!');
            
            // Show the added patients
            const [newPatients] = await connection.execute("SELECT patient_id, patient_name, phone_number, email FROM patient_registration");
            console.table(newPatients);
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

checkPatientsData();