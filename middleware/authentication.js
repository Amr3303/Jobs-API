const { UnauthenticatedError } = require("../errors");
const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
    // check for header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new UnauthenticatedError("Authintication invalied");
    }

    const token = authHeader.split(" ")[1];

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { userId: payload.userId, name: payload.name};
        console.log("payload: ", payload);
        next();
    } catch (error) {
        throw new UnauthenticatedError("Authintication invalied");
    }
};

module.exports = auth;
