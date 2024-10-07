const express = require('express');
const controller = require('../controller/tourContorl');

const router = express.Router();


// middleware for checking id

router.param('id', controller.checkID_MW);

router.route('/')
    .get(controller.GetAllTouts)
    .post(controller.checkBody_MW, controller.CreateTour);
router.route('/:id')
    .get(controller.GetTour)
    .patch(controller.UpdateTour)
    .delete(controller.DeleteTour);


module.exports = router;