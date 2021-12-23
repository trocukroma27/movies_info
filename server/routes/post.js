const router = require('express').Router();
const infoPostController = require('../controllers/infoPost.js')
const auth = require('../middleware/auth.js')

router.post('/', auth, infoPostController.createInfoPost);
router.post('/rate', auth, infoPostController.setRating);
router.post('/:movie_id/comment', auth, infoPostController.postComment);
router.put('/rate', auth, infoPostController.changeRating);
router.put('/:id', auth, infoPostController.updateInfoPost);
router.delete('/:id', auth, infoPostController.deleteInfoPost);

module.exports = router;