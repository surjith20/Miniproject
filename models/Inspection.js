const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Inspection = sequelize.define('Inspection', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    applicationId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    inspectorId: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    scheduledDate: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    status: {
        type: DataTypes.ENUM('scheduled', 'in-progress', 'completed', 'pending'),
        defaultValue: 'pending'
    },
    report: {
        type: DataTypes.TEXT
    },
    rating: {
        type: DataTypes.INTEGER // 1-10 or similar
    },
    completedAt: {
        type: DataTypes.DATE
    }
});

module.exports = Inspection;
