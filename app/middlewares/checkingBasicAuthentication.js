const response = require("../helpers/responseHelper")


module.exports = async (req, res, next) => {
    // check for basic auth header
    if (!req.headers.auth_basic || req.headers.auth_basic.indexOf('Basic ') === -1) {
        return res.status(401).json({ message: 'Missing Authorization Header' });
    }

    // verify auth credentials
    const base64Credentials = req.headers.auth_basic.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [username, password] = credentials.split(':');
    if (username === process.env.BASICAUTH_USERNAME && password === process.env.BASICAUTH_PASSWORD) {
        return next()
    }
    return response.error(res, "user or pass was wrong!")
}