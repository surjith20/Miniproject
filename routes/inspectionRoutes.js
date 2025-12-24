const express = require('express');
const router = express.Router();
const { Inspection, Application, User } = require('../models');

const asyncHandler = fn => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

// Create inspection
router.post('/', asyncHandler(async (req, res) => {
    const inspection = await Inspection.create(req.body);

    // Optionally update application status
    const application = await Application.findByPk(req.body.applicationId);
    if (application) {
        await application.update({ status: 'inspection_scheduled' });
    }

    res.status(201).json(inspection);
}));

// Get all inspections
router.get('/', asyncHandler(async (req, res) => {
    const inspections = await Inspection.findAll({
        include: [
            {
                model: Application,
                include: [User]
            },
            {
                model: User,
                as: 'inspector'
            }
        ]
    });
    res.json(inspections);
}));

// Update inspection
router.patch('/:id', asyncHandler(async (req, res) => {
    const inspection = await Inspection.findByPk(req.params.id);
    if (!inspection) {
        return res.status(404).json({ message: 'Inspection not found' });
    }

    await inspection.update(req.body);

    if (req.body.status === 'completed') {
        await inspection.update({ completedAt: new Date() });

        // Update Application status
        const application = await inspection.getApplication();
        if (application) {
            await application.update({ status: 'inspection_completed' });
        }
    }

    res.json(inspection);
}));

module.exports = router;
