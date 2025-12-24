const { sequelize, User, Application, Inspection } = require('./models');
const bcrypt = require('bcryptjs');

async function seed() {
    try {
        // Force sync to clear DB
        await sequelize.sync({ force: true });
        console.log('Database cleared and synced.');

        // 1. Create Users
        const password = await bcrypt.hash('password123', 10);

        const applicant = await User.create({
            name: 'John Smith',
            email: 'applicant@test.com',
            password: password,
            role: 'applicant',
            phone: '9876543210',
            isVerified: true
        });

        const official = await User.create({
            name: 'Officer Chen',
            email: 'official@test.com',
            password: password,
            role: 'official',
            phone: '1122334455',
            isVerified: true
        });

        const admin = await User.create({
            name: 'Admin User',
            email: 'admin@test.com',
            password: password,
            role: 'admin',
            isVerified: true
        });

        console.log('Users created.');

        // 2. Create Application
        const app1 = await Application.create({
            userId: applicant.id,
            applicantName: 'John Smith',
            contactEmail: 'applicant@test.com',
            contactPhone: '9876543210',
            propertyType: 'Commercial',
            propertyAddress: '123 Business St, Downtown',
            buildingArea: 5000,
            floorCount: 4,
            fireSafetyFeatures: ["Fire Extinguishers", "Smoke Detectors"],
            status: 'inspection_scheduled',
            priority: 'medium'
        });

        console.log(`Application created with ID: ${app1.id}`);

        // 3. Create Inspection
        await Inspection.create({
            applicationId: app1.id,
            inspectorId: official.id,
            scheduledDate: '2025-01-15',
            status: 'scheduled',
            priority: 'medium'
        });

        console.log('Inspection scheduled.');

        console.log('--- SEEDING COMPLETE ---');
        console.log(`Login as Applicant: applicant@test.com / password123`);
        console.log(`Login as Official: official@test.com / password123`);
        console.log(`Login as Admin: admin@test.com / password123`);
        console.log(`Track Application ID: ${app1.id}`);

    } catch (error) {
        console.error('Seeding failed:', error);
    } finally {
        process.exit();
    }
}

seed();
