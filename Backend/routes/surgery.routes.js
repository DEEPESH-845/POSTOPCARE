const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const surgeryController = require('../controllers/surgery.controller.js');
const { authenticateToken } = require('../middleware/auth.middleware.js');

// POST /surgery/onboarding - Create surgery onboarding data
router.post('/onboarding', [
    body('preferredLanguage').not().isEmpty().withMessage('Preferred language is required'),
    body('privacyPermission').isBoolean().withMessage('Privacy permission must be a boolean'),
    body('surgery.category').not().isEmpty().withMessage('Surgery category is required'),
    body('surgery.specificProcedure').not().isEmpty().withMessage('Specific procedure is required'),
    body('surgery.surgeryDate').isISO8601().withMessage('Surgery date must be a valid date in ISO format'),
    body('surgery.additionalDetails').optional().isString().withMessage('Additional details must be a string')
], authenticateToken, surgeryController.createOnboarding);

// GET /surgery/data - Get all surgery onboarding data for user
router.get('/data', authenticateToken, surgeryController.getOnboardingData);

// PUT /surgery/onboarding/:surgeryId - Update specific surgery onboarding data
router.put('/onboarding/:surgeryId', [
    body('preferredLanguage').optional().not().isEmpty().withMessage('Preferred language cannot be empty'),
    body('privacyPermission').optional().isBoolean().withMessage('Privacy permission must be a boolean'),
    body('surgery.category').optional().not().isEmpty().withMessage('Surgery category cannot be empty'),
    body('surgery.specificProcedure').optional().not().isEmpty().withMessage('Specific procedure cannot be empty'),
    body('surgery.surgeryDate').optional().isISO8601().withMessage('Surgery date must be a valid date in ISO format'),
    body('surgery.additionalDetails').optional().isString().withMessage('Additional details must be a string')
], authenticateToken, surgeryController.updateOnboarding);

// DELETE /surgery/onboarding/:surgeryId - Delete specific surgery onboarding data
router.delete('/onboarding/:surgeryId', authenticateToken, surgeryController.deleteOnboarding);

module.exports = router;
