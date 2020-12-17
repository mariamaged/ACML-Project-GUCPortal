const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
    const token = req.header.token;
    if(!token) {
        return res.status(401).send('Access denied!');
    }
    try {
    req.user = jwt.verify(token, process.env.TOKEN_SECRET);
    next();
    }
    catch(err) {
        return res.status(400).send('Invalid request!');
    }
};