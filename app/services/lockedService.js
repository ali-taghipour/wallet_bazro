const HasDataException = require("../core/exceptions/hasDataException");
const RestrictedAreaException = require("../core/exceptions/restrictedAreaException");
const walletRepo = require("../repositories/walletRepo");
const { decodeToken } = require("./tokenService")


module.exports.checkAccessInCreate = async (req, wallet) => {
    const decoded_token = await decodeToken(req.headers.authorization)

    if (decoded_token.role == "super_admin") {
        return;
    }
    if (decoded_token.role == "admin") {
        if (!wallet.service_id == decoded_token.service)
            throw new RestrictedAreaException("access denied")
    }
    if (!wallet) new HasDataException("wallet not founded")
    if (wallet.userable_type != "user") new HasDataException("making locked on this wallet is denied")

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

module.exports.checkAccessInGetById = async (req, locked) => {
    const decoded_token = await decodeToken(req.headers.authorization)

    if (decoded_token.role == "super_admin") {
        return;
    }
    if (decoded_token.role == "admin") {
        if (!locked.service_id == decoded_token.service)
            throw new RestrictedAreaException("access denied")
    }
    if (decoded_token.role == "user") {
        if (!locked.wallet_id == decoded_token.wallet_id)
            throw new RestrictedAreaException("access denied")
        if (!(locked.userable_id == decoded_token.id && locked.userable_type == "user"))
            throw new RestrictedAreaException("access denied")
    }
}

module.exports.checkAccessInUpdate = async (req, locked) => {
    const decoded_token = await decodeToken(req.headers.authorization)

    if (decoded_token.role == "super_admin") {
        return;
    }
    if (decoded_token.role == "admin") {
        if (!locked.service_id == decoded_token.service)
            throw new RestrictedAreaException("access denied")
    }
    if (decoded_token.role == "user") {
        if (!locked.wallet_id == decoded_token.wallet_id)
            throw new RestrictedAreaException("access denied")
        if (!(locked.userable_id == decoded_token.id && locked.userable_type == "user"))
            throw new RestrictedAreaException("access denied")
    }
}


module.exports.checkAccessInUnlocked = async (req, locked) => {
    const decoded_token = await decodeToken(req.headers.authorization)

    if (decoded_token.role == "super_admin") {
    }
    if (decoded_token.role == "admin") {
        if (!locked.service_id == decoded_token.service)
            throw new RestrictedAreaException("access denied")
    }

    let lockedAmount = Number(locked.amount)
    const shouldBeDeducted = Number(req.body.amount)
    if (lockedAmount < shouldBeDeducted)
        throw new HasDataException("amount is bigger than locked", {
            amount: shouldBeDeducted,
            lockedAmount: lockedAmount,
        })

    if (!locked.wallet)
        throw new HasDataException("wallet not founded")

    let walletAmount = Number(locked.wallet.amount)
    if (shouldBeDeducted > walletAmount)
        throw new HasDataException("amount is bigger than wallet amount", {
            amount: shouldBeDeducted,
            walletAmount: walletAmount,
        })

    walletAmount = walletAmount - shouldBeDeducted
    lockedAmount = lockedAmount - shouldBeDeducted

    return {
        amount: shouldBeDeducted,
        newWalletAmount: walletAmount,
        newLockedAmount: lockedAmount,
    }
}


module.exports.getAdminWallet = async (locked) => {
    const serviceId = locked.service_id
    const adminWallet = await walletRepo.getAdminWalletByServiceId(serviceId)

    if (!adminWallet)
        throw new HasDataException("admin wallet not founded")

    return adminWallet

}
