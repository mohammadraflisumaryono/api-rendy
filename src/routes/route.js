
const { Router } = require('express');
const router = Router();

const ItemsController = require('../controllers/items-controller');
const ScheduleController = require('../controllers/schedule-controller');

router.post('/items', ItemsController.postItemHandler);
router.get('/items', ItemsController.getAllItemsHandler);


router.get('/jadwal', ScheduleController.getAllSchedule);
router.post('/jadwal', ScheduleController.postScheduleHandler);
// delete
router.delete('/jadwal/:id', ScheduleController.deleteScheduleHandler);


module.exports = router;
