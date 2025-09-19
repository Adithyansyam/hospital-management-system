# Medicare Control Panel - Patient Data Fetching Fix

## Issues Found and Fixed

### 1. Database Name Mismatch
**Problem**: Server was configured to use database `'hms'` but SQL schema creates `'hospital_management_system'`
**Fix**: Updated server.js to use correct database name

### 2. Missing Email Field in Database Schema
**Problem**: Control panel expected email field but it wasn't in the patient table
**Fix**: Added email field to patient_registration table

### 3. Property Name Mismatch
**Problem**: Control panel was accessing patient data with wrong property names
**Fix**: Updated control panel to use correct property names from server response

### 4. URL Issues in AJAX Calls
**Problem**: Some API calls were using relative URLs that might not work properly
**Fix**: Updated all API calls to use absolute URLs with localhost:5000

## Steps to Fix the Patient Data Issue

### Step 1: Set Up Database
1. Make sure XAMPP is running
2. Start MySQL service in XAMPP
3. Open phpMyAdmin (http://localhost/phpmyadmin)
4. Import the `hospital_db.sql` file or run it manually
5. Verify that the database `hospital_management_system` is created

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Test Database Connection (Optional)
```bash
node setup-database.js
```

### Step 4: Start the Server
```bash
npm start
```
or
```bash
node server.js
```

### Step 5: Access Control Panel
1. Open your browser
2. Go to http://localhost:5000/control-panel.html
3. The patient data should now load properly

## Files Modified

1. **server.js**
   - Fixed database name from 'hms' to 'hospital_management_system'

2. **hospital_db.sql**
   - Added email field to patient_registration table
   - Added sample data for testing

3. **control-panel.html**
   - Fixed property names to match server response format
   - Updated API URLs to use absolute paths

4. **setup-database.js** (New file)
   - Helper script to verify database setup

## Common Issues and Solutions

### Issue: "Failed to load patients"
**Possible Causes**:
- MySQL server not running
- Database doesn't exist
- Wrong database credentials
- No data in patient_registration table

**Solutions**:
1. Check XAMPP MySQL status
2. Run the SQL file to create database and tables
3. Verify connection in server.js logs
4. Add sample data using the SQL file

### Issue: "CORS errors"
**Solution**: Make sure CORS is properly configured in server.js (already done)

### Issue: "Connection refused"
**Solution**: Make sure server is running on port 5000

## Testing the Fix

1. Start the server: `node server.js`
2. You should see messages like:
   - "Server is running on port 5000"
   - "Successfully connected to MySQL database"
   - "Found X patients in the database"

3. Open control panel: http://localhost:5000/control-panel.html
4. Click on "Patients" tab
5. Patient data should load automatically
6. Click "Refresh Data" button to reload

## Sample Data

The SQL file now includes sample patients:
- John Doe (john.doe@email.com)
- Jane Smith (jane.smith@email.com)
- Robert Brown (robert.brown@email.com)
- Emily Davis (emily.davis@email.com)

## API Endpoints

- GET `/api/patients` - Fetch all patients
- GET `/api/doctors` - Fetch all doctors
- GET `/api/appointments` - Fetch all appointments
- DELETE `/api/patients/:id` - Delete a patient
- DELETE `/api/doctors/:id` - Delete a doctor
- PUT `/api/appointments/:id/cancel` - Cancel an appointment