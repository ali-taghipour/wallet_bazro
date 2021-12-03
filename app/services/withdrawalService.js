const HasDataException = require("../core/exceptions/hasDataException");
const RestrictedAreaException = require("../core/exceptions/restrictedAreaException")
const { decodeToken } = require("./tokenService")
const walletRepo = require("../repositories/walletRepo")
const { Op } = require("sequelize");
const validate = require("../validations/withdrawalValidation");
const { Wallet } = require("../models");



module.exports.checkAccessInCreate = async (req) => {
    const decoded_token = await decodeToken(req.headers.authorization)
    let walletId;
    if (decoded_token.role == "super_admin") {
        validate.createBySuperAdmin(req.body)
        walletId = req.body.wallet_id
    }
    if (decoded_token.role == "admin") {
        walletId = decoded_token.wallet_id
    }
    if (decoded_token.role == "user") {
        walletId = decoded_token.wallet_id
    }
    if (!walletId)
        throw new HasDataException("wallet_id not founded")
    const wallet = await walletRepo.getById(walletId, { include: [Wallet.packet] })
    if (!wallet)
        throw new HasDataException("wallet not founded")

    const packet = wallet.packet
    if (!packet)
        throw new HasDataException("packet not founded")

    const amount = Number(req.body.amount)
    if (amount < Number(packet.min_withdrawal))
        throw new HasDataException("amount is lower than minWithdrawalValue", {
            amount,
            min_withdrawal: packet.min_withdrawal
        })
    if (amount > Number(packet.max_withdrawal))
        throw new HasDataException("amount is bigger than maxWithdrawalValue", {
            amount,
            max_withdrawal: packet.max_withdrawal
        })


    if (Number(wallet.amount) < amount)
        throw new HasDataException("wallet has not enough money", {
            walletAmount: wallet.amount,
            amount
        })

    return {
        wallet: wallet,
        newWalletAmount: Number(wallet.amount) - amount
    }

}

module.exports.checkAccessInGetAll = async (req, filter) => {
    const decoded_token = await decodeToken(req.headers.authorization)

    if (decoded_token.role == "super_admin") {
        return filter;
    }
    if (decoded_token.role == "admin") {
        const userwalletIds = await walletRepo.getAdminsUsersWallets(decoded_token.service)
        if (!Array.isArray(userwalletIds))
            throw new HasDataException("userIds is not array!!!", {
                userwalletIds
            })
        filter["wallet_id"] = { [Op.in]: [...userwalletIds, decoded_token.wallet_id], ...filter["wallet_id"] }
        return filter;
    }
    if (decoded_token.role == "user") {
        filter["wallet_id"] = decoded_token.wallet_id
        return filter;
    }
}

module.exports.checkAccessInGetById = async (req, withdrawal) => {
    const decoded_token = await decodeToken(req.headers.authorization)

    if (decoded_token.role == "super_admin") {
        return;
    }
    if (decoded_token.role == "admin") {
        const userwalletIds = await walletRepo.getAdminsUsersWallets(decoded_token.service)
        if (!(userwalletIds.includes(withdrawal.wallet_id) || withdrawal.wallet_id == decoded_token.wallet_id))
            throw new RestrictedAreaException("access denied")
    }
    if (decoded_token.role == "user") {
        if (!withdrawal.wallet_id == decoded_token.wallet_id)
            throw new RestrictedAreaException("access denied")
    }
}

module.exports.checkAccessInUpdate = async (req, withdrawal) => {
    const decoded_token = await decodeToken(req.headers.authorization)

    if (decoded_token.role == "super_admin") {
        return;
    }
    if (decoded_token.role == "admin") {
        const userwalletIds = await walletRepo.getAdminsUsersWallets(decoded_token.service)
        if (!(userwalletIds.includes(withdrawal.wallet_id) || withdrawal.wallet_id == decoded_token.wallet_id))
            throw new RestrictedAreaException("access denied")
    }
    if (decoded_token.role == "user") {
        if (!withdrawal.wallet_id == decoded_token.wallet_id)
            throw new RestrictedAreaException("access denied")
    }
}


module.exports.checkAccessInAccept = async (req, withdrawal) => {
    const decoded_token = await decodeToken(req.headers.authorization)

    if (decoded_token.role == "super_admin") {
        return;
    }
    if (decoded_token.role == "admin") {
        const userwalletIds = await walletRepo.getAdminsUsersWallets(decoded_token.service)
        if (!userwalletIds.includes(withdrawal.wallet_id))
            throw new RestrictedAreaException("access denied")
    }
}

module.exports.checkAccessInReject = async (req, withdrawal) => {
    const decoded_token = await decodeToken(req.headers.authorization)

    if (decoded_token.role == "super_admin") {
        return;
    }
    if (decoded_token.role == "admin") {
        const userwalletIds = await walletRepo.getAdminsUsersWallets(decoded_token.service)
        if (!userwalletIds.includes(withdrawal.wallet_id))
            throw new RestrictedAreaException("access denied")
    }
}


module.exports.checkAmount = async (withdrawal) => {
    const wallet = withdrawal.wallet
    // const wallet = await walletRepo.getWalletWithPacket(withdrawal.wallet_id)
    if (!wallet)
        throw new HasDataException("wallet not founded")
    const packet = withdrawal.wallet.packet
    if (!packet)
        throw new HasDataException("packet not founded")

    if (Number(withdrawal.amount) < Number(packet.min_withdrawal))
        throw new HasDataException("amount is lower than minWithdrawalValue", {
            amount: withdrawal.amount,
            min_withdrawal: packet.min_withdrawal
        })
    if (Number(withdrawal.amount) > Number(packet.max_withdrawal))
        throw new HasDataException("amount is bigger than maxWithdrawalValue", {
            amount: withdrawal.amount,
            max_withdrawal: packet.max_withdrawal
        })

    const walletAmount = Number(wallet.amount)
    let totalPartsAmount = 0
    for (let i = 0; i < wallet.parts.length; i++) {
        totalPartsAmount += Number(wallet.parts[i].amount)
    }
    let totalLockeds = 0
    for (let i = 0; i < wallet.lockeds.length; i++) {
        totalLockeds += Number(wallet.lockeds[i].amount)
    }

    const realWalletRemainung = (walletAmount + totalPartsAmount) - totalLockeds
    if (realWalletRemainung < Number(withdrawal.amount))
        throw new HasDataException("wallet has not enough money", {
            reminingInWallet: walletAmount,
            parts: totalPartsAmount,
            locked: totalLockeds,
            withdrawal_amount: Number(withdrawal.amount)
        })

    if (walletAmount < Number(withdrawal.amount)) {
        throw new HasDataException("wallet has not enough money", {
            reminingInWallet: walletAmount,
            // parts: totalPartsAmount,
            // locked: totalLockeds,
            withdrawal_amount: Number(withdrawal.amount)
        })
    }

    return {
        wallet,
        // walletAmount,
        // totalPartsAmount,
        // totalLockeds,
        newWalletAmount: walletAmount - Number(withdrawal.amount),
        // realWalletRemainung,
    }

}

