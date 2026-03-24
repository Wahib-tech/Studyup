const http = require('http');

const data = JSON.stringify({
  username: 'admin',
  password: 'Admin@123'
});

const options = {
  hostname: 'localhost',
  port: 4000,
  path: '/api/auth/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
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
    try {
      const json = JSON.parse(body);
      if (json.token) {
        console.log('LOGIN SUCCESSFUL');
      } else {
        console.log('LOGIN FAILED');
      }
    } catch (e) {
      console.log('Error parsing response');
    }
  });
});

req.on('error', (error) => {
  console.error('Error with request:', error);
});

req.write(data);
req.end();
