const router = require('express').Router();
const infoPostController = require('../controllers/infoPost.js')
const GenresController = require('../controllers/genres.js')
const RolesController = require('../controllers/roles.js')

router.get('/search', infoPostController.getInfoPostsBySearch);
router.get('/genres', GenresController.getGenres);
router.get('/roles', RolesController.getRoles);


module.exports = router;