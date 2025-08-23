const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const recoveryController = require('../controllers/recovery.controller.js');
const { authenticateToken } = require('../middleware/auth.middleware.js');

// Create recovery plan route
router.post('/createplan', [
    body('surgeryId').notEmpty().withMessage('Surgery ID is required')
], authenticateToken, recoveryController.createRecoveryPlan);

// Get recovery plan route
router.get('/plan/:surgeryId', authenticateToken, recoveryController.getRecoveryPlan);

// Update daily check-in route (for future use)
router.put('/checkin/:planId', authenticateToken, recoveryController.updateDailyCheckin);

module.exports = router;
