const HasDataException = require("../core/exceptions/hasDataException");
const RestrictedAreaException = require("../core/exceptions/restrictedAreaException")
const { decodeToken } = require("./tokenService")


module.exports.checkAccessInCreate = async (req) => {
    const decoded_token = await decodeToken(req.headers.authorization)
    const infoForCreate = {}
    if (decoded_token.role == "super_admin") {
        throw new RestrictedAreaException("access denied")
        // return infoForCreate;
    }
    if (decoded_token.role) {
        infoForCreate["userable_id"] = decoded_token.id
        infoForCreate["userable_type"] = decoded_token.role
        return infoForCreate;
    }
}

module.exports.checkAmountInPacket = async (walletWithPacket, amount) => {
    const walletAmount = Number(walletWithPacket.amount);
    const packet = walletWithPacket.packet
    if (!packet)
        throw new HasDataException("packet not founded")
    if (amount < Number(packet.min_deposit))
        throw new HasDataException(`min deposit is ${packet.min_deposit}`)
    if (amount > Number(packet.max_deposit))
        throw new HasDataException(`max deposit is ${packet.max_deposit}`)

    const newAmount = walletAmount + amount
    if (newAmount > Number(packet.max_capacity))
        throw new HasDataException(`max capacity of this wallet is ${packet.max_capacity} and the wallet has ${walletAmount}`)
    return;
}


module.exports.checkAccessInGetAll = async (req, filter) => {
    const decoded_token = await decodeToken(req.headers.authorization)

    if (decoded_token.role == "super_admin") {
        return filter;
    }
    if (decoded_token.role == "admin") {
        filter["service_id"] = decoded_token.service
        return filter;
    }
    if (decoded_token.role == "user") {
        filter["service_id"] = decoded_token.service
        filter["userable_id"] = decoded_token.id
        filter["userable_type"] = decoded_token.role
        return filter;
    }
}

module.exports.checkAccessInGetById = async (req, payment) => {
    const decoded_token = await decodeToken(req.headers.authorization)

    if (decoded_token.role == "super_admin") {
        return;
    }
    if (decoded_token.role == "admin") {
        if (!payment.service_id == decoded_token.service)
            throw new RestrictedAreaException("access denied")
    }
    if (decoded_token.role == "user") {
        if (!payment.id == decoded_token.payment_id)
            throw new RestrictedAreaException("access denied")
        if (!(payment.userable_id == decoded_token.id && payment.userable_type == "user"))
            throw new RestrictedAreaException("access denied")
    }
}

module.exports.checkAccessInUpdate = async (req, payment) => {
    const decoded_token = await decodeToken(req.headers.authorization)

    if (decoded_token.role == "super_admin") {
        return;
    }
    if (decoded_token.role == "admin") {
        if (!payment.service_id == decoded_token.service)
            throw new RestrictedAreaException("access denied")
    }
    if (decoded_token.role == "user") {
        if (!payment.id == decoded_token.payment_id)
            throw new RestrictedAreaException("access denied")
        if (!(payment.userable_id == decoded_token.id && payment.userable_type == "user"))
            throw new RestrictedAreaException("access denied")
    }
}

