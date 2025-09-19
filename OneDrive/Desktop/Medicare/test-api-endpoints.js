// Simple test script to check API endpoints
const http = require('http');

function testAPI(endpoint) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 5000,
            path: endpoint,
            method: 'GET'
        };

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                try {
                    const result = JSON.parse(data);
                    console.log(`\n${endpoint} - Status: ${res.statusCode}`);
                    console.log('Response:', JSON.stringify(result, null, 2));
                    resolve(result);
                } catch (error) {
                    console.log(`\n${endpoint} - Status: ${res.statusCode}`);
                    console.log('Raw response:', data);
                    resolve(data);
                }
            });
        });

        req.on('error', (error) => {
            console.error(`Error testing ${endpoint}:`, error.message);
            reject(error);
        });

        req.end();
    });
}

async function testAllAPIs() {
    console.log('Testing API endpoints...');
    
    try {
        await testAPI('/api/doctors/list');
        await testAPI('/api/patients/list');
        console.log('\n✅ All API tests completed');
    } catch (error) {
        console.error('❌ API test failed:', error);
    }
}

testAllAPIs();