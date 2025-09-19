-- MySQL Script for Hospital Management System Database
-- Created: 2025-09-19

-- Create the database
CREATE DATABASE IF NOT EXISTS hms;
USE hms;

-- 1. Patient Registration Table
CREATE TABLE IF NOT EXISTS patient_registration (
    patient_id INT AUTO_INCREMENT PRIMARY KEY,
    patient_name VARCHAR(100) NOT NULL,
    gender ENUM('Male', 'Female', 'Other') NOT NULL,
    date_of_birth DATE NOT NULL,
    blood_group ENUM('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown'),
    address TEXT NOT NULL,
    phone_number VARCHAR(15) NOT NULL,
    email VARCHAR(100),
    previous_medical_history TEXT,
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_phone (phone_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Doctor Table
CREATE TABLE IF NOT EXISTS doctor (
    doctor_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE,
    phone_number VARCHAR(15) NOT NULL UNIQUE,
    department VARCHAR(50) NOT NULL,
    specialization VARCHAR(100) NOT NULL,
    qualification VARCHAR(100) NOT NULL,
    experience_years INT,
    consultation_fee DECIMAL(10,2) NOT NULL,
    bio TEXT,
    address TEXT,
    city VARCHAR(50),
    state VARCHAR(50),
    pincode VARCHAR(10),
    available_days VARCHAR(50),
    available_time_slot VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Appointment Table
CREATE TABLE IF NOT EXISTS appointment (
    appointment_id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT NOT NULL,
    doctor_id INT NOT NULL,
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    reason_for_visit TEXT NOT NULL,
    status ENUM('Scheduled', 'Completed', 'Cancelled', 'No-Show') DEFAULT 'Scheduled',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patient_registration(patient_id) ON DELETE CASCADE,
    FOREIGN KEY (doctor_id) REFERENCES doctor(doctor_id) ON DELETE CASCADE,
    INDEX idx_appointment_datetime (appointment_date, appointment_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Admin Table
CREATE TABLE IF NOT EXISTS admin (
    admin_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE,
    last_login TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insert default admin user (password: Admin@123)
INSERT INTO admin (username, password_hash, full_name, email) 
VALUES ('admin', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'System Administrator', 'admin@medicare.com');

-- Create a view for appointment details
CREATE VIEW vw_appointment_details AS
SELECT 
    a.appointment_id,
    p.patient_name,
    p.phone_number,
    d.name AS doctor_name,
    d.department,
    a.appointment_date,
    a.appointment_time,
    a.reason_for_visit,
    a.status,
    a.created_at
FROM 
    appointment a
    JOIN patient_registration p ON a.patient_id = p.patient_id
    JOIN doctor d ON a.doctor_id = d.doctor_id;

-- Create a view for patient appointments
CREATE VIEW vw_patient_appointments AS
SELECT 
    p.patient_id,
    p.patient_name,
    p.phone_number,
    COUNT(a.appointment_id) AS total_appointments,
    MAX(a.appointment_date) AS last_visit_date
FROM 
    patient_registration p
    LEFT JOIN appointment a ON p.patient_id = a.patient_id
GROUP BY 
    p.patient_id, p.patient_name, p.phone_number;

-- Create an index for faster patient lookups
CREATE INDEX idx_patient_name ON patient_registration(patient_name);
CREATE INDEX idx_doctor_name ON doctor(name);

-- Add sample data (optional)
-- Uncomment and modify as needed

-- Sample Doctors
INSERT INTO doctor (name, email, phone_number, department, specialization, qualification, experience_years, consultation_fee) VALUES
('Dr. John Smith', 'john.smith@medicare.com', '1234567890', 'Cardiology', 'Interventional Cardiology', 'MD, DM Cardiology', 15, 1500.00),
('Dr. Sarah Johnson', 'sarah.johnson@medicare.com', '1234567891', 'Neurology', 'Brain Surgery', 'MD, DM Neurology', 12, 1800.00),
('Dr. Mike Williams', 'mike.williams@medicare.com', '1234567892', 'Pediatrics', 'Child Health', 'MD, DCH', 8, 1200.00);

-- Sample Patients
INSERT INTO patient_registration (patient_name, gender, date_of_birth, blood_group, address, phone_number, email) VALUES
('John Doe', 'Male', '1985-05-15', 'A+', '123 Main St, City', '9876543210', 'john.doe@email.com'),
('Jane Smith', 'Female', '1990-08-22', 'B+', '456 Oak Ave, Town', '9876543211', 'jane.smith@email.com'),
('Robert Brown', 'Male', '1978-12-10', 'O+', '789 Pine Rd, Village', '9876543212', 'robert.brown@email.com'),
('Emily Davis', 'Female', '1995-03-08', 'AB+', '321 Elm St, County', '9876543213', 'emily.davis@email.com');

-- Sample Appointments
INSERT INTO appointment (patient_id, doctor_id, appointment_date, appointment_time, reason_for_visit, status) VALUES
(1, 1, '2025-09-25', '10:00:00', 'Chest pain consultation', 'Scheduled'),
(2, 2, '2025-09-26', '14:30:00', 'Headache and dizziness', 'Scheduled'),
(3, 3, '2025-09-27', '09:15:00', 'Regular checkup', 'Scheduled'),
(4, 1, '2025-09-28', '11:00:00', 'Follow-up visit', 'Scheduled');

-- Add comments to tables and columns for better documentation
ALTER TABLE patient_registration COMMENT 'Stores patient demographic and contact information';
ALTER TABLE doctor COMMENT 'Stores doctor information and their specializations';
ALTER TABLE appointment COMMENT 'Tracks patient appointments with doctors';
ALTER TABLE admin COMMENT 'Stores administrator login credentials and information';

-- Add database user with appropriate privileges (modify username and password as needed)
-- CREATE USER 'hospital_user'@'localhost' IDENTIFIED BY 'SecurePassword123!';
-- GRANT SELECT, INSERT, UPDATE, DELETE ON hospital_management_system.* TO 'hospital_user'@'localhost';
-- FLUSH PRIVILEGES;
