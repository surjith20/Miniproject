const express = require('express');
const router = express.Router();
const { Application, User, Inspection } = require('../models');

// wrapper for async routes
const asyncHandler = fn => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

// Create application
router.post('/', asyncHandler(async (req, res) => {
    const application = await Application.create(req.body);
    res.status(201).json(application);
}));

// Get all applications (optionally filter by user via query param)
router.get('/', asyncHandler(async (req, res) => {
    const { userId } = req.query;
    const whereClause = userId ? { userId } : {};

    const applications = await Application.findAll({
        where: whereClause,
        include: [{ model: User }, { model: Inspection }]
    });
    res.json(applications);
}));

// Get single application
router.get('/:id', asyncHandler(async (req, res) => {
    const application = await Application.findByPk(req.params.id, {
        include: [{ model: User }, { model: Inspection }]
    });

    if (!application) {
        return res.status(404).json({ message: 'Application not found' });
    }
    res.json(application);
}));

// Update application
router.patch('/:id', asyncHandler(async (req, res) => {
    const application = await Application.findByPk(req.params.id);
    if (!application) {
        return res.status(404).json({ message: 'Application not found' });
    }

    await application.update(req.body);
    res.json(application);
}));

module.exports = router;
