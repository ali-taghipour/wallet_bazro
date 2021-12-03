const RestrictedAreaException = require("../core/exceptions/restrictedAreaException")
const { decodeToken } = require("./tokenService")
const validate = require("../validations/partValidation");
const HasDataException = require("../core/exceptions/hasDataException");
const packetRepo = require("../repositories/packetRepo");




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
        filter["wallet_id"] = decoded_token.wallet_id
        return filter;
    }
}

module.exports.checkAccessInGetById = async (req, part) => {
    const decoded_token = await decodeToken(req.headers.authorization)

    if (decoded_token.role == "super_admin") {
        return;
    }
    if (decoded_token.role == "admin") {
        if (!part.service_id == decoded_token.service)
            throw new RestrictedAreaException("access denied")
    }
    if (decoded_token.role == "user") {
        if (!part.wallet_id == decoded_token.wallet_id)
            throw new RestrictedAreaException("access denied")
    }
}

module.exports.checkAccessInUpdate = async (req, part) => {
    const decoded_token = await decodeToken(req.headers.authorization)

    if (decoded_token.role == "super_admin") {
        return;
    }
    if (decoded_token.role == "admin") {
        if (!part.service_id == decoded_token.service)
            throw new RestrictedAreaException("access denied")
    }
    if (decoded_token.role == "user") {
        if (!part.wallet_id == decoded_token.wallet_id)
            throw new RestrictedAreaException("access denied")
    }
}

module.exports.checkAccessInSpend = async (req, part) => {
    const decoded_token = await decodeToken(req.headers.authorization)
    let service_id;
    if (decoded_token.role == "super_admin") {
        service_id = req.body.service_id
    }
    if (decoded_token.role == "admin") {
        service_id = decoded_token.service
    }
    if (service_id != part.service_id)
        throw new HasDataException("service_id and part not match")
    return service_id;
}

module.exports.getPacket = async (service_id) => {
    if (!service_id)
        throw new HasDataException("service_id not founded")
    const packet = await packetRepo.findByService(service_id)
    if (!packet)
        throw new HasDataException("packet not founded")
    return packet;
}

module.exports.checkingAmount = async (part, wallet, amount) => {
    if (Number(part.amount) < amount)
        throw new HasDataException("part has not enough money", { partAmount: part.amount })


    const walletAmount = Number(wallet.amount)
    let totalPartsAmount = 0
    for (let i = 0; i < wallet.parts.length; i++) {
        totalPartsAmount += Number(wallet.parts[i].amount)
    }
    let totalLockeds = 0
    for (let i = 0; i < wallet.lockeds.length; i++) {
        totalLockeds += Number(wallet.lockeds[i].amount)
    }

    if (totalLockeds > (totalPartsAmount + walletAmount - amount)) {
        throw new HasDataException("wallet was locked", {
            reminingInWallet: walletAmount,
            parts: totalPartsAmount,
            locked: totalLockeds,
        })
    }

    return {
        walletAmount,
        totalPartsAmount,
        totalLockeds,
        newPartAmount: Number(part.amount) - amount,
    }
}
