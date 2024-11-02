const express = require('express');
const {
    GetAllUsers,
    CreateUser,
    DeleteUser,
    UpdateUser,
    updateMe,
    deActivateUser,
    GetUser,
    uploadUserPhoto
} = require('../controller/userContorl');
const {
    protect,
    resetPassword,
    forgetpassword,
    signUp,
    login,
    updatePassword,
    Permission
} = require('./../controller/authContoller')
const router = express.Router();

router.route('/signup').post(signUp)
router.route('/login').post(login)


router.route('/reset/:token').post(resetPassword)

// protected routes 
router.use(protect) // all routes that comes after it will be protected
router.route('/forgetpass').post(forgetpassword)
router.route('/profile/change-data').post(updateMe)
router.route('/profile/active').post(deActivateUser)
router.route('/change-password').post(updatePassword)
router.route('/updateMe')
    .post(uploadUserPhoto, updateMe)


// this routs only for admins
router.use(Permission('admin'))
router.route('/')
    .get(GetAllUsers)
    .post(CreateUser);

router.route('/:id')
    .get(GetUser)
    .delete(DeleteUser)
    .patch(UpdateUser);


module.exports = router;
