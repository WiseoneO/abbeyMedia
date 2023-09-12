const router = require('express').Router();
const {registerUser,loginUser,forgotPassword,resetPassword,logout} = require('../controllers/authController');
const {isAuthenticated} = require('../middlewares/auth');


router.post('/', registerUser);
router.post('/login', loginUser);
router.post('/password/forgot', forgotPassword);
router.put('/password/reset/:token', resetPassword);
router.get('/logout',isAuthenticated, logout);

module.exports = router;