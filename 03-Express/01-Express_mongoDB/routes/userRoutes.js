const express = require('express');
const controller = require('../controller/userContorl');

const router = express.Router();


router.route('/')
    .get(controller.GetAllUsers)
    .post(controller.CreateUser);
router.route('/:id')
    .get(controller.GetUser)
    .delete(controller.DeleteUser)
    .patch(controller.UpdateUser);

module.exports = router;
