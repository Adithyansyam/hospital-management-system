const express = require('express');
const path = require('path');
const cors = require('cors');
const mysql = require('mysql2/promise'); // Using promise-based MySQL
const app = express();
const PORT = process.env.PORT || 5000;

// MySQL database configuration
const dbConfig = {
    host: 'localhost',
    user: 'root',        // default XAMPP MySQL username
    password: '',        // default XAMPP MySQL password is empty
    database: 'hms',     // your database name
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

// Create a connection pool
const pool = mysql.createPool(dbConfig);

// Test the database connection
async function testConnection() {
    try {
        const connection = await pool.getConnection();
        console.log('Successfully connected to MySQL database');
        connection.release();
    } catch (error) {
        console.error('Error connecting to MySQL database:', error);
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

// API endpoint to get list of doctors
app.get('/api/doctors/list', async (req, res) => {
    try {
        const [doctors] = await pool.query(
            'SELECT doctor_id, name, department, specialization FROM doctor ORDER BY name'
        );
        res.json(doctors);
    } catch (error) {
        console.error('Error fetching doctors:', error);
        res.status(500).json({ error: 'Failed to fetch doctors' });
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
    try {
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

        // First, check if email column exists
        try {
            // Try to insert with email
            const [result] = await pool.query(
                `INSERT INTO patient_registration 
                 (patient_name, gender, date_of_birth, blood_group, address, phone_number, email, previous_medical_history)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [patient_name, gender, date_of_birth, blood_group, address, phone_number, email || null, previous_medical_history || null]
            );
            return result;
        } catch (err) {
            // If the error is about the email column, try without it
            if (err.code === 'ER_BAD_FIELD_ERROR' && err.sqlMessage.includes('email')) {
                console.log('Email column not found, inserting without email');
                const [result] = await pool.query(
                    `INSERT INTO patient_registration 
                     (patient_name, gender, date_of_birth, blood_group, address, phone_number, previous_medical_history)
                     VALUES (?, ?, ?, ?, ?, ?, ?)`,
                    [patient_name, gender, date_of_birth, blood_group, address, phone_number, previous_medical_history || null]
                );
                return result;
            }
            // If it's a different error, rethrow it
            throw err;
        }

        res.status(201).json({
            success: true,
            message: 'Patient registered successfully',
            patientId: result.insertId
        });
    } catch (error) {
        console.error('Error registering patient:', error);
        
        // Handle duplicate phone number error
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({
                success: false,
                message: 'Phone number already exists'
            });
        }
        
        res.status(500).json({
            success: false,
            message: 'Error registering patient',
            error: error.message
        });
    }
});

// API endpoint to handle doctor registration
app.post('/api/doctors', async (req, res) => {
    try {
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

        const [result] = await pool.query(
            `INSERT INTO doctor 
             (name, email, phone_number, department, specialization, qualification, 
              experience_years, consultation_fee, bio, address, city, state, pincode,
              available_days, available_time_slot)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                name, email, phone_number, department, specialization, qualification,
                experience_years, consultation_fee, bio, address, city, state, pincode,
                available_days, available_time_slot
            ]
        );

        res.status(201).json({
            success: true,
            message: 'Doctor registered successfully',
            doctorId: result.insertId
        });
    } catch (error) {
        console.error('Error registering doctor:', error);
        
        // Handle duplicate entry error
        if (error.code === 'ER_DUP_ENTRY') {
            const field = error.sqlMessage.includes('email') ? 'Email' : 'Phone number';
            return res.status(400).json({
                success: false,
                message: `${field} already exists`
            });
        }
        
        res.status(500).json({
            success: false,
            message: 'Error registering doctor',
            error: error.message
        });
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
