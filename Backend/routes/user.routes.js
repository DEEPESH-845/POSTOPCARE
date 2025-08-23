const express = require('express');
const router = express.Router();
const {body} = require('express-validator');
const userController = require('../controllers/user.controller.js');
const { authenticateToken } = require('../middleware/auth.middleware.js');


router.post('/register',[
    body('fullname').isLength({min:3}).withMessage('Fullname must be atleast 3 characters long'),
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('password').isLength({min:3}).withMessage('Password must be atleast 3 characters long'),
    body('language').not().isEmpty().withMessage('Please enter a valid language')
],userController.registerUser);

router.post('/login',[
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('password').isLength({min:3}).withMessage('Password must be atleast 3 characters long')
],userController.loginUser);


router.get('/check',(req,res)=>{
    res.status(200).json({message:"User is authenticated"});
});

// Notification preference routes (authenticated)
router.get('/notificationPreference', authenticateToken, userController.getNotificationPreferences);
router.put('/notificationPreference', authenticateToken, userController.updateNotificationPreferences);

module.exports = router;