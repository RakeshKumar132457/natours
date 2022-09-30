const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');

// FUNCTION for USERS
exports.getUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet implemented!',
    });
};

exports.getAllUsers = catchAsync(async (req, res) => {
    const users = await User.find();
    res.status(200).json({
        status: 'success',
        results: users.length,
        data: {
            users,
        },
    });
});

exports.addUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet implemented!',
    });
};

exports.updateUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet implemented!',
    });
};

exports.deleteUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet implemented!',
    });
};
