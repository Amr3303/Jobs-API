const express = require("express");
const {
    loginUser,
    registerUser,
    getAllUsers,
    getSingleUser,
} = require("../controllers/auth");
const router = express.Router();

router.post("/login", loginUser);

router.post("/register", registerUser);

router.get("/", getAllUsers);

router.get("/current", getSingleUser);

module.exports = router;
