const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');
const authRoutes = require('./routes/authRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const inspectionRoutes = require('./routes/inspectionRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/inspections', inspectionRoutes);
app.use('/api/admin', require('./routes/adminRoutes'));

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Unhandled Error:', err); // Log the full error
    res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

// Start server
const startServer = async () => {
    try {
        await sequelize.sync({ force: false }); // Set force: true to reset DB on restart during dev
        console.log('Database synced');

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
};

startServer();


