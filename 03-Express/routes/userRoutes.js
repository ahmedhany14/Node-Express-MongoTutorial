const express = require('express');
const controller = require('../controller/userContorl');
const auth = require('./../controller/authContoller')
const router = express.Router();

router.route('/signup')
    .post(auth.signUp)

router.route('/login')
    .post(auth.login)

router.route('/forgetpass')
    .post(auth.forgetpassword)

router.route('/reset/:token')
    .post(auth.resetPassword)

router.route('/change-password')
    .post(
        auth.protect,
        auth.updatePassword
    )

router.route('/')
    .get(controller.GetAllUsers)
    .post(controller.CreateUser);
router.route('/:id')
    .get(controller.GetUser)
    .delete(controller.DeleteUser)
    .patch(controller.UpdateUser);

module.exports = router;
