const sequelize = require('../config/database');
const User = require('./User');
const Application = require('./Application');
const Inspection = require('./Inspection');

// Associations
User.hasMany(Application, { foreignKey: 'userId' });
Application.belongsTo(User, { foreignKey: 'userId' });

Application.hasOne(Inspection, { foreignKey: 'applicationId' });
Inspection.belongsTo(Application, { foreignKey: 'applicationId' });

User.hasMany(Inspection, { as: 'inspections', foreignKey: 'inspectorId' });
Inspection.belongsTo(User, { as: 'inspector', foreignKey: 'inspectorId' });

module.exports = {
    sequelize,
    User,
    Application,
    Inspection
};
