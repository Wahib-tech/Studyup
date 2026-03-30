import axios from 'axios';
import fs from 'fs';

const login = async () => {
    try {
        const response = await axios.post('http://localhost:4000/api/auth/login', {
            username: 'admin',
            password: 'Admin@123'
        });
        console.log(JSON.stringify(response.data));
    } catch (error) {
        console.error('Login failed:', error.message);
        process.exit(1);
    }
};

login();
