const express = require('express');
const router = express.Router();
const { User } = require('../models');

// Wrapper for async routes
const asyncHandler = fn => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

// Get all users
router.get('/users', asyncHandler(async (req, res) => {
    const users = await User.findAll({
        attributes: { exclude: ['password'] }, // Don't return passwords
        order: [['createdAt', 'DESC']]
    });
    res.json(users);
}));

module.exports = router;
