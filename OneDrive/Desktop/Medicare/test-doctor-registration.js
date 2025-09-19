const http = require('http');

const testDoctorData = {
    name: "Dr. Test Doctor",
    email: "test.doctor@example.com",
    phoneNumber: "1234567890",
    department: "Cardiology",
    specialization: "Heart Surgery",
    qualification: "MD, MBBS",
    experience_years: 5,
    consultation_fee: 1000,
    bio: "Test doctor for registration",
    address: "Test Hospital",
    city: "Test City",
    state: "Test State",
    pincode: "123456",
    available_days: "Mon-Fri",
    available_time_slot: "9am-5pm"
};

const postData = JSON.stringify(testDoctorData);

const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/doctors',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
    }
};

console.log('Testing doctor registration...');

const req = http.request(options, (res) => {
    let data = '';
    
    res.on('data', (chunk) => {
        data += chunk;
    });
    
    res.on('end', () => {
        console.log(`Status Code: ${res.statusCode}`);
        console.log('Response:', data);
        
        if (res.statusCode === 201) {
            console.log('✅ Doctor registration successful!');
        } else {
            console.log('❌ Doctor registration failed');
        }
    });
});

req.on('error', (error) => {
    console.error('Error:', error);
});

req.write(postData);
req.end();