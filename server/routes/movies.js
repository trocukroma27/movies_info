const router = require('express').Router();
const infoPostController = require('../controllers/infoPost.js')
const auth = require('../middleware/auth.js')

router.get('/', infoPostController.getMovies);
router.get('/:id', infoPostController.getMovie);
router.get('/genre/:genre_id', infoPostController.getMoviesByGenre);

module.exports = router;