const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Application = sequelize.define('Application', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    applicantName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    contactEmail: {
        type: DataTypes.STRING,
        allowNull: false
    },
    contactPhone: {
        type: DataTypes.STRING,
        allowNull: false
    },
    propertyType: {
        type: DataTypes.STRING,
        allowNull: false
    },
    propertyAddress: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    buildingArea: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    floorCount: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    fireSafetyFeatures: {
        type: DataTypes.JSON,
        defaultValue: []
    },
    status: {
        type: DataTypes.ENUM('submitted', 'under_review', 'inspection_scheduled', 'inspection_completed', 'approved', 'rejected'),
        defaultValue: 'submitted'
    },
    priority: {
        type: DataTypes.ENUM('low', 'medium', 'high'),
        defaultValue: 'medium'
    },
    additionalNotes: {
        type: DataTypes.TEXT
    }
});

module.exports = Application;
