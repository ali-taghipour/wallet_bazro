const RestrictedAreaException = require("../core/exceptions/restrictedAreaException")
const { decodeToken } = require("./tokenService")



module.exports.checkAccessInGetAll = async (req, filter) => {
    const decoded_token = await decodeToken(req.headers.authorization)

    if (decoded_token.role == "super_admin") {
        return filter;
    }
    if (decoded_token.role == "admin") {
        filter["service_id"] = decoded_token.service
        return filter;
    }
}

module.exports.checkAccessInGetById = async (req, packet) => {
    const decoded_token = await decodeToken(req.headers.authorization)

    if (decoded_token.role == "super_admin") {
        return;
    }
    if (decoded_token.role == "admin") {
        if (!packet.service_id == decoded_token.service)
            throw new RestrictedAreaException("access denied")
    }
}

module.exports.checkAccessInUpdate = async (req, packet) => {
    const decoded_token = await decodeToken(req.headers.authorization)

    if (decoded_token.role == "super_admin") {
        return;
    }
    if (decoded_token.role == "admin") {
        if (!packet.service_id == decoded_token.service)
            throw new RestrictedAreaException("access denied")
    }
}
