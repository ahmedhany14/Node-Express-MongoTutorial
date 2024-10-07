const express = require('express');
const controller = require('../controller/tourContorl');

const router = express.Router();


router.route('/')
    .get(controller.GetAllTouts)
    .post(controller.CreateTour);
router.route('/:id')
    .get(controller.GetTour)
    .patch(controller.UpdateTour)
    .delete(controller.DeleteTour);


module.exports = router;