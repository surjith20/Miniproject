const http = require('http');

function request(options, data) {
    return new Promise((resolve, reject) => {
        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => resolve({ statusCode: res.statusCode, body: JSON.parse(body) }));
        });

        req.on('error', reject);

        if (data) {
            req.write(JSON.stringify(data));
        }
        req.end();
    });
}

async function test() {
    try {
        console.log('Testing Register...');
        const registerRes = await request({
            hostname: 'localhost',
            port: 5000,
            path: '/api/auth/register',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        }, {
            name: 'Tester',
            email: 'tester@test.com',
            password: 'pass',
            role: 'applicant'
        });
        console.log('Register:', registerRes.statusCode, registerRes.body);

        const token = registerRes.body.token;

        console.log('Testing Get Applications...');
        const appRes = await request({
            hostname: 'localhost',
            port: 5000,
            path: '/api/applications',
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` } // Not implementing auth middleware yet but sending just in case
        });
        console.log('Applications:', appRes.statusCode, appRes.body);

    } catch (err) {
        console.error(err);
    }
}

test();
