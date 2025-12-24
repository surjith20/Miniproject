const { Application } = require('./models');

async function checkApps() {
    try {
        const apps = await Application.findAll();
        console.log('Total Applications:', apps.length);
        apps.forEach(app => {
            console.log(`ID: ${app.id}, Applicant: ${app.applicantName}`);
        });
    } catch (error) {
        console.error('Error:', error);
    }
}

checkApps();
