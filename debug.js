try {
    console.log('Requiring config...');
    const sequelize = require('./config/database');
    console.log('Config loaded.');

    console.log('Requiring User...');
    const User = require('./models/User');
    console.log('User loaded.');

    console.log('Requiring Application...');
    const Application = require('./models/Application');
    console.log('Application loaded.');

    console.log('Requiring Inspection...');
    const Inspection = require('./models/Inspection');
    console.log('Inspection loaded.');

    console.log('Requiring models index...');
    const models = require('./models');
    console.log('Models loaded.');

} catch (error) {
    console.error('CRASH:', error);
}
