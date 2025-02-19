
const { Router } = require('express');
const router = Router();

const ItemsController = require('../controllers/items-controller');

router.post('/items', ItemsController.postItemHandler);
router.get('/items', ItemsController.getAllItemsHandler);


module.exports = router;
