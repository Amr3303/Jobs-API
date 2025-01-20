const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors");

// @desc login a user
// @route /api/v1/users/login
// @access Public
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        throw new BadRequestError("All fields are requried");
    }
    // check first for email
    const user = await User.findOne({ email });
    if (!user) {
        throw new UnauthenticatedError("Invalid email address");
    }

    // check for password
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
        throw new UnauthenticatedError("Wrong password");
    }

    const token = user.createJWT();
    res.status(StatusCodes.OK).json({ name: user.name, token });
};

// @desc regiser a new user
// @route /api/v1/users/register
// @access Public
const registerUser = async (req, res) => {
    const user = await User.create({ ...req.body });
    const token = user.createJWT();
    res.status(StatusCodes.CREATED).json({
        user: { name: user.name },
        token,
    });
};

// @desc get all users
// @route /api/v1/users
// @access Public
const getAllUsers = async (req, res) => {
    const users = await User.find();
    res.send(users);
};

// @desc get a single user
// @route /api/v1/users/current
// @access Private
const getSingleUser = (req, res) => {
    res.send("single user page");
};

module.exports = {
    loginUser,
    registerUser,
    getAllUsers,
    getSingleUser,
};
