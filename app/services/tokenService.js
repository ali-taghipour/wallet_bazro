
const JWT = require("../helpers/JWTHelper")
const Exception = require("../helpers/errorHelper")
const UnAuthorizedException = require("../core/exceptions/unAuthorizedException")

//validating accessToken(jwt) or make a exception error
exports.tokenValidate = async (token) => {
    if (!token)
        throw new UnAuthorizedException("unauthorized")
    if (token.startsWith("Bearer "))
        token = token.substr("Bearer ".length)
    try {
        return await JWT.verify(token)
    } catch (e) {
        throw new UnAuthorizedException("your token is not valid")
    }

}

//extracting information from token or make a exception error
exports.decodeToken = async (token) => {
    if (!token)
        throw new UnAuthorizedException("unauthorized")
    if (token.startsWith("Bearer "))
        token = token.substr("Bearer ".length)
    return await JWT.decode(token);
}


