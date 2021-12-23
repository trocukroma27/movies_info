const router = require('express').Router();
const userController = require('../controllers/user.js');
const auth = require('../middleware/auth.js')

router.post('/signup', userController.signup);
router.post('/signin', userController.signin);
router.get('/', auth, userController.getUsers);
router.put('/:id', auth, userController.updateRoles);

module.exports = router;