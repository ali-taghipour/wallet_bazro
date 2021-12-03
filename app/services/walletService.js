const HasDataException = require("../core/exceptions/hasDataException");
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
    if (decoded_token.role == "user") {
        filter["service_id"] = decoded_token.service
        filter["userable_id"] = decoded_token.id
        filter["userable_type"] = decoded_token.role
        return filter;
    }
}

module.exports.checkAccessInGetById = async (req, wallet) => {
    const decoded_token = await decodeToken(req.headers.authorization)

    if (decoded_token.role == "super_admin") {
        return;
    }
    if (decoded_token.role == "admin") {
        if (!wallet.service_id == decoded_token.service)
            throw new RestrictedAreaException("access denied")
    }
    if (decoded_token.role == "user") {
        if (!wallet.id == decoded_token.wallet_id)
            throw new RestrictedAreaException("access denied")
        if (!(wallet.userable_id == decoded_token.id && wallet.userable_type == "user"))
            throw new RestrictedAreaException("access denied")
    }
}

module.exports.checkAccessInUpdate = async (req, wallet) => {
    const decoded_token = await decodeToken(req.headers.authorization)

    if (decoded_token.role == "super_admin") {
        return;
    }
    if (decoded_token.role == "admin") {
        if (!wallet.service_id == decoded_token.service)
            throw new RestrictedAreaException("access denied")
    }
    if (decoded_token.role == "user") {
        if (!wallet.id == decoded_token.wallet_id)
            throw new RestrictedAreaException("access denied")
        if (!(wallet.userable_id == decoded_token.id && wallet.userable_type == "user"))
            throw new RestrictedAreaException("access denied")
    }
}

module.exports.checkAccessInCharge = async (req, wallet) => {
    const decoded_token = await decodeToken(req.headers.authorization)

    if (decoded_token.role == "super_admin") {
    }
    if (decoded_token.role == "admin") {
        if (!wallet.service_id == decoded_token.service)
            throw new RestrictedAreaException("access denied")
    }
    return { decoded_token };
}


module.exports.checkWalletCanMakeANewPart = (wallet, newAmount) => {
    const walletAmount = Number(wallet.amount)
    let totalPartsAmount = 0
    for (let i = 0; i < wallet.parts.length; i++) {
        totalPartsAmount += Number(wallet.parts[i].amount)
    }
    let totalLockeds = 0
    for (let i = 0; i < wallet.lockeds.length; i++) {
        totalLockeds += Number(wallet.lockeds[i].amount)
    }

    // let canMakeNewPart = false
    // if (walletAmount >= newAmount) {
    //     const remainingofWalletAfterLockeds = walletAmount - (totalLockeds - totalPartsAmount)
    //     if (remainingofWalletAfterLockeds >= newAmount) {
    //         canMakeNewPart = true
    //     }
    // }

    // if (!canMakeNewPart)
    //     throw new HasDataException("wallet has not enough money", {
    //         reminingInWallet: walletAmount,
    //         parts: totalPartsAmount,
    //         locked: totalLockeds,
    //     })

    const realWalletRemainung = (walletAmount + totalPartsAmount) - totalLockeds
    if (realWalletRemainung < newAmount)
        throw new HasDataException("wallet has not enough money", {
            reminingInWallet: walletAmount,
            parts: totalPartsAmount,
            locked: totalLockeds,
        })

    return {
        walletAmount,
        totalPartsAmount,
        totalLockeds,
        newWalletAmount: realWalletRemainung - newAmount,
        realWalletRemainung,
    }
}
