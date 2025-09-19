const express = require('express');
const path = require('path');
const cors = require('cors');
const mysql = require('mysql2/promise'); // Using promise-based MySQL
const app = express();
const PORT = process.env.PORT || 5000;

// MySQL database configuration
const dbConfig = {
    host: '127.0.0.1',   // Use IPv4 instead of localhost to avoid IPv6 issues
    port: 3306,          // Explicitly specify MySQL port
    user: 'root',        // default XAMPP MySQL username
    password: '',        // default XAMPP MySQL password is empty
    database: 'hms',     // Using correct database name
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

// Create a connection pool
const pool = mysql.createPool(dbConfig);

// Test the database connection and verify tables
async function testConnection() {
    let connection;
    try {
        // Get a connection from the pool
        connection = await pool.getConnection();
        console.log('Successfully connected to MySQL database');
        
        // Verify the doctor table exists and has data
        try {
            // Check if the doctor table exists
            const [tables] = await connection.query("SHOW TABLES LIKE 'doctor'");
            
            if (tables.length === 0) {
                console.warn('Warning: The doctor table does not exist in the database');
            } else {
                console.log('Doctor table exists');
                
                // Check if there are any doctors in the table
                const [doctors] = await connection.query('SELECT COUNT(*) as count FROM doctor');
                console.log(`Found ${doctors[0].count} doctors in the database`);
                
                // Show the first few doctors for verification
                const [sampleDoctors] = await connection.query('SELECT * FROM doctor LIMIT 3');
                console.log('Sample doctors:', JSON.stringify(sampleDoctors, null, 2));
            }
        } catch (tableError) {
            console.error('Error checking doctor table:', tableError);
        }
        
    } catch (error) {
        console.error('Error connecting to MySQL database:', {
            code: error.code,
            errno: error.errno,
            sqlState: error.sqlState,
            sqlMessage: error.sqlMessage,
            message: error.message
        });
        
        // Provide helpful troubleshooting steps
        if (error.code === 'ER_BAD_DB_ERROR') {
            console.error('\nTroubleshooting:');
            console.error('1. Make sure MySQL server is running in XAMPP');
            console.error('2. Verify the database name is correct');
            console.error('3. Check if the database exists by running: SHOW DATABASES;');
            console.error('4. If the database does not exist, create it with: CREATE DATABASE hms;');
        }
    } finally {
        if (connection) {
            await connection.release();
        }
    }
}

// Function to generate a unique 4-digit ID
async function generateUniqueId(table, idField) {
    let connection;
    let attempts = 0;
    const maxAttempts = 10;
    
    try {
        connection = await pool.getConnection();
        
        while (attempts < maxAttempts) {
            // Generate a random 4-digit number (1000-9999)
            const id = Math.floor(1000 + Math.random() * 9000);
            
            // Check if ID already exists
            const [existing] = await connection.query(
                `SELECT ${idField} FROM ${table} WHERE ${idField} = ?`,
                [id]
            );
            
            if (existing.length === 0) {
                return id; // Return the unique ID
            }
            
            attempts++;
        }
        
        throw new Error('Could not generate a unique ID after multiple attempts');
    } finally {
        if (connection) await connection.release();
    }
}

// Call the test connection function
testConnection();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the current directory
app.use(express.static(__dirname));

// Basic route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Route for doctor registration
app.get('/doctor-registration', (req, res) => {
    res.sendFile(path.join(__dirname, 'doctor-registration.html'));
});

// Route for appointment
app.get('/appointment', (req, res) => {
    res.sendFile(path.join(__dirname, 'appointment.html'));
});

// Route for patient registration
app.get('/patient-registration', (req, res) => {
    res.sendFile(path.join(__dirname, 'patient-registration.html'));
});

// API endpoint to get all patients
app.get('/api/patients', async (req, res) => {
    let connection;
    try {
        connection = await pool.getConnection();
        const [patients] = await connection.query(
            'SELECT patient_id, patient_name, gender, date_of_birth, blood_group, phone_number, address, previous_medical_history FROM patient_registration ORDER BY patient_name'
        );
        
        // Format patient data
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
        
        res.json({
            success: true,
            data: formattedPatients
        });
        
    } catch (error) {
        console.error('Error fetching patients:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch patients',
            error: error.message
        });
    } finally {
        if (connection) await connection.release();
    }
});

// API endpoint to get all doctors
app.get('/api/doctors', async (req, res) => {
    let connection;
    try {
        connection = await pool.getConnection();
        const [doctors] = await connection.query(
            'SELECT * FROM doctor ORDER BY name'
        );
        
        // Format doctor data
        const formattedDoctors = doctors.map(doctor => ({
            id: doctor.doctor_id,
            doctorNumber: `D${doctor.doctor_id}`,
            name: doctor.name,
            email: doctor.email,
            phone: doctor.phone_number,
            department: doctor.department,
            specialization: doctor.specialization,
            qualification: doctor.qualification,
            experienceYears: doctor.experience_years,
            consultationFee: doctor.consultation_fee,
            bio: doctor.bio,
            address: `${doctor.address}, ${doctor.city}, ${doctor.state} ${doctor.pincode}`,
            availableDays: doctor.available_days,
            availableTimeSlot: doctor.available_time_slot
        }));
        
        res.json({
            success: true,
            data: formattedDoctors
        });
        
    } catch (error) {
        console.error('Error fetching doctors:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch doctors',
            error: error.message
        });
    } finally {
        if (connection) await connection.release();
    }
});

// API endpoint to get all appointments
app.get('/api/appointments', async (req, res) => {
    let connection;
    try {
        connection = await pool.getConnection();
        
        // Get all appointments with patient and doctor details
        const [appointments] = await connection.query(`
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
        `);
        
        // Format appointment data
        const formattedAppointments = appointments.map(appt => ({
            id: appt.appointment_id,
            patient: {
                id: appt.patient_id,
                name: appt.patient_name
            },
            doctor: {
                id: appt.doctor_id,
                name: appt.doctor_name
            },
            date: appt.appointment_date,
            time: appt.appointment_time,
            reason: appt.reason_for_visit,
            status: appt.status,
            createdAt: appt.created_at
        }));
        
        res.json({
            success: true,
            data: formattedAppointments
        });
        
    } catch (error) {
        console.error('Error fetching appointments:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch appointments',
            error: error.message
        });
    } finally {
        if (connection) await connection.release();
    }
});

// API endpoint to get list of doctors (for dropdowns)
app.get('/api/doctors/list', async (req, res) => {
    let connection;
    try {
        // Get a connection from the pool
        connection = await pool.getConnection();
        
        // Test the connection
        await connection.ping();
        
        // Get list of tables for debugging
        const [tables] = await connection.query("SHOW TABLES LIKE 'doctor'");
        console.log('Tables found:', tables);
        
        if (tables.length === 0) {
            console.warn('Doctor table does not exist');
            return res.status(200).json([]);
        }
        
        // Get doctors
        const [doctors] = await connection.query(
            'SELECT doctor_id, name, department, specialization FROM doctor ORDER BY name'
        );
        
        console.log('Doctors found:', doctors);
        res.json(doctors);
        
    } catch (error) {
        console.error('Error in /api/doctors/list:', error);
        console.error('Error details:', {
            code: error.code,
            errno: error.errno,
            sqlState: error.sqlState,
            sqlMessage: error.sqlMessage
        });
        res.status(500).json({ 
            error: 'Failed to fetch doctors',
            details: error.message 
        });
    } finally {
        // Release the connection back to the pool
        if (connection) await connection.release();
    }
});

// API endpoint to create a new appointment
app.post('/api/appointments', async (req, res) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        
        const { patient_id, doctor_id, appointment_date, appointment_time, reason } = req.body;
        
        // Validate required fields
        if (!patient_id || !doctor_id || !appointment_date || !appointment_time) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        
        // Check if the patient exists
        const [patient] = await connection.query(
            'SELECT patient_id FROM patient_registration WHERE patient_id = ?',
            [patient_id]
        );
        
        if (patient.length === 0) {
            return res.status(404).json({ error: 'Patient not found' });
        }
        
        // Check if the doctor exists
        const [doctor] = await connection.query(
            'SELECT doctor_id FROM doctor WHERE doctor_id = ?',
            [doctor_id]
        );
        
        if (doctor.length === 0) {
            return res.status(404).json({ error: 'Doctor not found' });
        }
        
        // Check for existing appointment at the same time
        const [existingAppointment] = await connection.query(
            'SELECT appointment_id FROM appointment WHERE doctor_id = ? AND appointment_date = ? AND appointment_time = ?',
            [doctor_id, appointment_date, appointment_time]
        );
        
        if (existingAppointment.length > 0) {
            return res.status(409).json({ error: 'Appointment slot is already booked' });
        }
        
        // Create the appointment
        const [result] = await connection.query(
            'INSERT INTO appointment (patient_id, doctor_id, appointment_date, appointment_time, reason_for_visit, status) VALUES (?, ?, ?, ?, ?, ?)',
            [patient_id, doctor_id, appointment_date, appointment_time, reason || 'General Checkup', 'Scheduled']
        );
        
        await connection.commit();
        
        res.status(201).json({
            appointment_id: result.insertId,
            message: 'Appointment booked successfully'
        });
        
    } catch (error) {
        await connection.rollback();
        console.error('Error creating appointment:', error);
        res.status(500).json({ error: 'Failed to book appointment' });
    } finally {
        connection.release();
    }
});

// API endpoint to handle patient registration
app.post('/api/patients', async (req, res) => {
    let connection;
    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();

        const { 
            patientName: patient_name, 
            gender, 
            dob: date_of_birth, 
            bloodGroup: blood_group, 
            address, 
            phoneNumber: phone_number, 
            email, 
            medicalHistory: previous_medical_history 
        } = req.body;

        // Generate a unique patient ID
        const patientId = await generateUniqueId('patient_registration', 'patient_id');

        // First, check if email column exists
        try {
            // Try to insert with email
            const [result] = await connection.query(
                `INSERT INTO patient_registration 
                 (patient_id, patient_name, gender, date_of_birth, blood_group, address, phone_number, email, previous_medical_history)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [patientId, patient_name, gender, date_of_birth, blood_group, address, phone_number, email || null, previous_medical_history || null]
            );
            
            await connection.commit();
            
            res.status(201).json({
                success: true,
                message: 'Patient registered successfully',
                patientId: patientId,
                patientNumber: `P${patientId}`
            });
            return;
        } catch (err) {
            await connection.rollback();
            
            // If the error is about the email column, try without it
            if (err.code === 'ER_BAD_FIELD_ERROR' && err.sqlMessage.includes('email')) {
                try {
                    console.log('Email column not found, inserting without email');
                    const [result] = await connection.query(
                        `INSERT INTO patient_registration 
                         (patient_id, patient_name, gender, date_of_birth, blood_group, address, phone_number, previous_medical_history)
                         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                        [patientId, patient_name, gender, date_of_birth, blood_group, address, phone_number, previous_medical_history || null]
                    );
                    
                    await connection.commit();
                    
                    res.status(201).json({
                        success: true,
                        message: 'Patient registered successfully',
                        patientId: patientId,
                        patientNumber: `P${patientId}`
                    });
                    return;
                } catch (innerErr) {
                    await connection.rollback();
                    throw innerErr;
                }
            }
            // If it's a different error, rethrow it
            throw err;
        }
    } catch (error) {
        console.error('Error registering patient:', error);
        
        // Handle duplicate phone number error
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({
                success: false,
                message: error.message.includes('phone_number') ? 'Phone number already exists' : 
                         error.message.includes('email') ? 'Email already exists' : 'Duplicate entry',
                error: error.message
            });
        }
        
        res.status(500).json({
            success: false,
            message: 'Error registering patient',
            error: error.message
        });
    } finally {
        if (connection) await connection.release();
    }
});

// API endpoint to handle doctor registration
app.post('/api/doctors', async (req, res) => {
    let connection;
    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();
        
        const { 
            name,
            email,
            phoneNumber: phone_number,
            department,
            specialization = '',
            qualification,
            experience_years = 0,
            consultation_fee = 0,
            bio = '',
            address = '',
            city = '',
            state = '',
            pincode = '',
            available_days = '',
            available_time_slot = ''
        } = req.body;
        
        // Debug log to see what we're receiving
        console.log('Received doctor data:', {
            name, email, phone_number, department, specialization, qualification,
            experience_years, consultation_fee, bio, address, city, state, 
            pincode, available_days, available_time_slot
        });
        
        // Generate a unique doctor ID
        const doctorId = await generateUniqueId('doctor', 'doctor_id');

        // Check if email or phone already exists
        const [existing] = await connection.query(
            'SELECT doctor_id FROM doctor WHERE email = ? OR phone_number = ?',
            [email, phone_number]
        );

        if (existing.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Email or phone number already registered'
            });
        }

        // Insert new doctor with the generated ID
        await connection.query(
            `INSERT INTO doctor (
                doctor_id, name, email, phone_number, department, specialization,
                qualification, experience_years, consultation_fee, bio,
                address, city, state, pincode, available_days, available_time_slot
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                doctorId, name, email, phone_number, department, specialization,
                qualification, experience_years, consultation_fee, bio,
                address, city, state, pincode, available_days, available_time_slot
            ]
        );
        
        await connection.commit();

        res.status(201).json({
            success: true,
            message: 'Doctor registered successfully',
            doctorId: doctorId,
            doctorNumber: `D${doctorId}`
        });
    } catch (error) {
        if (connection) await connection.rollback();
        console.error('Error registering doctor:', error);
        
        // Handle duplicate entry errors
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({
                success: false,
                message: error.message.includes('email') ? 'Email already registered' : 
                         error.message.includes('phone') ? 'Phone number already registered' :
                         'Duplicate entry',
                error: error.message
            });
        }
        
        // Handle other errors
        res.status(500).json({
            success: false,
            message: 'Error registering doctor',
            error: error.message
        });
    } finally {
        if (connection) await connection.release();
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

// Handle server shutdown
process.on('SIGINT', async () => {
    try {
        await pool.end();
        console.log('MySQL connection pool closed');
        process.exit(0);
    } catch (error) {
        console.error('Error closing MySQL connection pool:', error);
        process.exit(1);
    }
});
