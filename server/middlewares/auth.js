const jwt = require('jsonwebtoken');
const auth = ((req, res, next) => {
    const token = req.get('Authorization');
    try {
        if (token) {
            const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
            if (decoded.user) {
                next();
            } 
        }
        else {
            res.sendStatus(404);
        }
    } catch (error) {
        return  res.sendStatus(404);
    }


})

module.exports = auth;