const router = require('express').Router();
const {getUserProfile,
    updatePassword,
    updateUser,
    deleteProfile,
    userFollow,
    userUnfollow,
    restoreProfile,
    getUsers,deleteUsers} = require('../../controllers/userController');
const {isAuthenticated,authorizeRoles} = require('../../middlewares/auth');

router.use(isAuthenticated);

router.get('/profile', getUserProfile);
router.put('/profile/update', updateUser);
router.put('/:slug/follow', userFollow);
router.put('/:slug/unfollow', userUnfollow);
router.put('/password/update', updatePassword);
router.delete('/profile/delete', deleteProfile);

// Admin only route
router.put('/restore', authorizeRoles('admin'),restoreProfile);
// router.get('/users', authorizeRoles('admin'),getUsers);
// router.delete('/delete/:id', authorizeRoles('admin'),deleteUsers);

module.exports = router;