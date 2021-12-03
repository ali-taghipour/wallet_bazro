const response = require("../helpers/responseHelper");
const tokenService = require("../services/tokenService");

exports.isLogin = async (req, res, next) => {
    try {
        await tokenService.tokenValidate(req.headers.authorization)
        const decode_token = await tokenService.decodeToken(req.headers.authorization)
        if (decode_token && decode_token.role) {
            return next()
        }
        return response.error(res, "access denied", 403)
    } catch (e) {
        return response.exception(res, e);
    }
}
exports.isSuperAdmin = async (req, res, next) => {
    try {
        await tokenService.tokenValidate(req.headers.authorization)
        const decode_token = await tokenService.decodeToken(req.headers.authorization)
        if (decode_token && decode_token.role == "super_admin") {
            return next()
        }
        return response.error(res, "access denied", 403)
    } catch (e) {
        return response.exception(res, e);
    }
}

exports.isSuperAdminOrAdmin = async (req, res, next) => {
    try {
        await tokenService.tokenValidate(req.headers.authorization)
        const decode_token = await tokenService.decodeToken(req.headers.authorization)
        if (decode_token && (decode_token.role == "super_admin" || decode_token.role == "admin")) {
            return next()
        }
        return response.error(res, "access denied", 403)
    } catch (e) {
        return response.exception(res, e);
    }
}

exports.isAdmin = async (req, res, next) => {
    try {
        await tokenService.tokenValidate(req.headers.authorization)
        const decode_token = await tokenService.decodeToken(req.headers.authorization)
        if (decode_token && decode_token.role == "admin") {
            return next()
        }
        return response.error(res, "access denied", 403)


    } catch (e) {
        return response.exception(res, e);
    }
}

exports.isUser = async (req, res, next) => {
    try {
        await tokenService.tokenValidate(req.headers.authorization)
        const decode_token = await tokenService.decodeToken(req.headers.authorization)

        if (decode_token && decode_token.role == "user") {
            return next()
        }
        return response.error(res, "access denied", 403)

    } catch (e) {
        return response.exception(res, e);
    }
}

