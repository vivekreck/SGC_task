const { constants } = require("../configs/constants");
const jwt = require('jsonwebtoken');

module.exports.isAuth = async (req, res, next) => {
    const authHeader = req.get('Authorization');
    if (!authHeader) {
        return res.send(401, {
            msg: 'Your authorization failed! You have to need to login again!'
        })
    }
    try {
        const token = authHeader.split(' ')[1];
        const decodedToken = await jwt.verify(token, constants.JWT_SECRET);

        if (!decodedToken) {
            return res.send(401, {
                msg: 'Your authorization failed! You have to need to login again!'
            })
        }

        // Get required user details
        req.email = decodedToken.email;

        next();
    } catch (err) {
        return res.send(401, {
            msg: 'Your authorization failed! You have to need to login again!'
        })
    }
}