const express = require('express');
const userRouter = require('./../controllers/userController');
const authRouter = require('./../controllers/authController');

// ROUTING USERS
const router = express.Router();

router.post('/signup', authRouter.signup);
router.post('/login', authRouter.login);

router.route('/').get(userRouter.getAllUsers).post(userRouter.addUser);
router
    .route('/:id')
    .get(userRouter.getUser)
    .patch(userRouter.updateUser)
    .delete(userRouter.deleteUser);

module.exports = router;
