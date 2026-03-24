const http = require('http');

// This script simulates an admin creating a new user.
// You need to replace ADMIN_TOKEN with a valid token obtained from login.

const adminToken = process.argv[2];

if (!adminToken) {
    console.error('Please provide an admin token as an argument');
    process.exit(1);
}

const data = JSON.stringify({
  username: 'teststudent1',
  email: 'student1@studyup.com',
  password: 'Password@123',
  first_name: 'Test',
  last_name: 'Student',
  role: 'student'
});

const options = {
  hostname: 'localhost',
  port: 4000,
  path: '/api/auth/register',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length,
    'Authorization': `Bearer ${adminToken}`
  }
};

const req = http.request(options, (res) => {
  let body = '';
  console.log(`Status Code: ${res.statusCode}`);
  
  res.on('data', (chunk) => {
    body += chunk;
  });

  res.on('end', () => {
    console.log('Response Body:', body);
  });
});

req.on('error', (error) => {
  console.error('Error with request:', error);
});

req.write(data);
req.end();
