const jwt = require("jsonwebtoken");
const secret = require("../secret");
module.exports = function (req, res, next) {
    if (req.method === "OPTIONS") {
        next();
    }
    try {
        const token = req.headers.authorization.split(" ")[1];
        if (!token) {
            return res.json("Пользователь не авторизован");
        }
        const dekodeData = jwt.verify(token, secret);
        req.user = dekodeData;
        next();
    } catch (error) {
        console.log(error);
        return res.json("Пользователь не авторизован");
    }
}