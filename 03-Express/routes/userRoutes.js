const express = require('express');
const controller = require('../controller/userContorl');
const signup = require('./../controller/authContoller')
const router = express.Router();

router.route('/signup')
    .post(signup.signUp)

router.route('/login')
    .post(signup.login)


router.route('/')
    .get(controller.GetAllUsers)
    .post(controller.CreateUser);
router.route('/:id')
    .get(controller.GetUser)
    .delete(controller.DeleteUser)
    .patch(controller.UpdateUser);

module.exports = router;
