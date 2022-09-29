const express = require('express');
const userRouter = require('./../controllers/userController');

// ROUTING USERS
const router = express.Router();

router.route('/').get(userRouter.getAllUsers).post(userRouter.addUser);
router
    .route('/:id')
    .get(userRouter.getUser)
    .patch(userRouter.updateUser)
    .delete(userRouter.deleteUser);

module.exports = router;
