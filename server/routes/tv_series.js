const router = require('express').Router();
const infoPostController = require('../controllers/infoPost.js')

router.get('/', infoPostController.getTVSerieses);
router.get('/:id', infoPostController.getTVSeries);
router.get('/genre/:genre_id', infoPostController.getTVSeriesesByGenre);

module.exports = router;