const transactionsTypes = require("../constants/transactionsTypes");
const HasDataException = require("../core/exceptions/hasDataException");
const RestrictedAreaException = require("../core/exceptions/restrictedAreaException");
const transactionRepo = require("../repositories/transactionRepo");
const { decodeToken } = require("./tokenService")
const moment = require('moment');
const partRepo = require("../repositories/partRepo");
const { Part, Locked } = require("../models");
const walletRepo = require("../repositories/walletRepo");
const creditcardRepo = require("../repositories/creditcardRepo");
const lockedRepo = require("../repositories/lockedRepo");
const packetRepo = require("../repositories/packetRepo");
const validate = require("../validations/transactionValidation")
const { Op } = require("sequelize");




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

module.exports.checkAccessInGetById = async (req, transaction) => {
    const decoded_token = await decodeToken(req.headers.authorization)

    if (decoded_token.role == "super_admin") {
        return;
    }
    if (decoded_token.role == "admin") {
        if (!transaction.service_id == decoded_token.service)
            throw new RestrictedAreaException("access denied")
    }

}

module.exports.checkAccessInUpdate = async (req, transaction) => {
    const decoded_token = await decodeToken(req.headers.authorization)

    if (decoded_token.role == "super_admin") {
        return;
    }
    if (decoded_token.role == "admin") {
        if (!transaction.service_id == decoded_token.service)
            throw new RestrictedAreaException("access denied")
    }
    if (decoded_token.role == "user") {
        if (!transaction.id == decoded_token.transaction_id)
            throw new RestrictedAreaException("access denied")
        if (!(transaction.userable_id == decoded_token.id && transaction.userable_type == "user"))
            throw new RestrictedAreaException("access denied")
    }
}


module.exports.getOtherFilterByURL = async (req, filter) => {
    const decoded_token = await decodeToken(req.headers.authorization)

    const URL = req.url
    switch (URL) {
        case "/need-action":
            filter["type"] = {
                [Op.or]: [
                    transactionsTypes.SPEND_FROM_PART,
                    transactionsTypes.LOCKED_TO_PACKET,
                    transactionsTypes.CREDITCARD_To_PACKET,
                ]
            }
            filter["is_confirmed"] = null
            filter["is_pause"] = false
            break;
        case "/holds":
            filter["type"] = {
                [Op.or]: [
                    transactionsTypes.SPEND_FROM_PART,
                    transactionsTypes.LOCKED_TO_PACKET,
                    transactionsTypes.CREDITCARD_To_PACKET,
                ]
            }
            filter["is_confirmed"] = null
            filter["is_pause"] = true
            break;
        case "/accepted":
            filter["type"] = {
                [Op.or]: [
                    transactionsTypes.SPEND_FROM_PART,
                    transactionsTypes.LOCKED_TO_PACKET,
                    transactionsTypes.CREDITCARD_To_PACKET,
                ]
            }
            filter["is_confirmed"] = true
            break;
        case "/rejected":
            filter["type"] = {
                [Op.or]: [
                    transactionsTypes.SPEND_FROM_PART,
                    transactionsTypes.LOCKED_TO_PACKET,
                    transactionsTypes.CREDITCARD_To_PACKET,
                ]
            }
            filter["is_confirmed"] = false
            break;
        case "/unpaied-taxes":
            filter["type"] = transactionsTypes.PACKET_TO_WALLET
            if (decoded_token.role == "super_admin") {
                const packets = await packetRepo.getAll()
                let adminWalletIds = []
                for (let i = 0; i < packets.length; i++) {
                    if (packets[i].admin_wallet_id)
                        adminWalletIds.push(packets[i].admin_wallet_id)
                }
                filter["wallet_id"] = { [Op.in]: adminWalletIds }
            }
            if (decoded_token.role == "admin") {
                filter["wallet_id"] = decoded_token.wallet_id
            }
            filter["is_tax_payed"] = false
            break;

        default://    /transaction/
            break;
    }
    return filter;
}

//Actions ...
const checkTransaction = async (transaction, typeOfAction) => {
    const needActionsType = [
        transactionsTypes.SPEND_FROM_PART,
        transactionsTypes.LOCKED_TO_PACKET,
        transactionsTypes.CREDITCARD_To_PACKET,
    ]

    if (transaction.is_confirmed == true)
        throw new HasDataException("transaction allready has been accepted", { transaction })
    if (transaction.is_confirmed == false)
        throw new HasDataException("transaction allready has been rejected", { transaction })

    switch (typeOfAction) {
        case "hold":
            if (!needActionsType.includes(transaction.type))
                throw new HasDataException("transaction type is wrong", {
                    acceptableTypes: needActionsType,
                    transactionType: transaction.type
                })
            break;

        case "accept":
            if (!needActionsType.includes(transaction.type))
                throw new HasDataException("transaction type is wrong", {
                    acceptableTypes: needActionsType,
                    transactionType: transaction.type
                })
            if (transaction.expire_at != null)
                if (moment(transaction.expire_at).valueOf() > moment().valueOf())
                    throw new HasDataException("expire_at is bigger than now()", {
                        transaction_expire_at: transaction.expire_at,
                    })
            break;

        case "reject":
            if (!needActionsType.includes(transaction.type))
                throw new HasDataException("transaction type is wrong", {
                    acceptableTypes: needActionsType,
                    transactionType: transaction.type
                })
            break;
        default:
            break;
    }
}
const checkTransactionForPaingTax = (transaction) => {
    if (transaction.type != transactionsTypes.PACKET_TO_WALLET)
        throw new HasDataException("transaction type is wrong", {
            acceptableType: transactionsTypes.PACKET_TO_WALLET,
            transactionType: transaction.type
        })
    if (transaction.is_tax_payed == true)
        throw new HasDataException("tax for transaction allready has been paied", { transaction })
    if (transaction.packet.admin_wallet_id != transaction.to_id)
        throw new HasDataException("admin does not owner of this transaction", { transaction })
}
//accept transaction -------------------------------------------------------------------------

const acceptTransaction = async (req, transaction) => {
    validate.setAction_Accept(req.body)
    let returnObject = [];
    let otherUserMoney = 0
    const packet = transaction.packet

    const adminWallet = await walletRepo.getById(packet.admin_wallet_id)

    if (!adminWallet)
        throw new HasDataException("adminWallet not founded", { wallet_id: packet.admin_wallet_id })

    const sections = transaction.sections
    const commission_status = req.body.commission_status
    if (sections && Array.isArray(sections) && sections.length > 0 && commission_status) {
        for (let i = 0; i < sections.length; i++) {
            const section = sections[i];
            if (commission_status[section.wallet_id] == true) {
                const userMoney = Number(section.percent) * Number(transaction.amount)
                const userWallet = await walletRepo.getById(section.wallet_id)
                if (!userWallet)
                    throw new HasDataException("wallet not founded", { wallet_id: section.wallet_id })
                otherUserMoney += userMoney
                const userTransaction = await transactionRepo.packetToWallet(userWallet, userMoney, transaction.id)
                await walletRepo.updateAmount(userWallet.id, userMoney)
                returnObject.push(userTransaction)
            }
        }
    }

    const adminPartOfMoney = Number(transaction.amount) - otherUserMoney;
    const tx = await transactionRepo.packetToWallet(adminWallet, adminPartOfMoney, transaction.id)
    await walletRepo.updateAmount(adminWallet.id, adminPartOfMoney)
    returnObject.push(tx)

    transaction.is_confirmed = true;
    transaction.is_pause = false
    await transaction.save()
    return returnObject
}
//rejection(reverse transactions) section -----------------------------------------------------
const rejectTransaction_FromPart = async (transaction) => {
    const returnObject = []
    const part = await partRepo.getById(transaction.from_id, { include: [Part.wallet] })
    let wallet
    if (part) {
        if (!part.wallet)
            throw new HasDataException("wallet not founded")
        wallet = part.wallet
        await partRepo.updateAmount(part.id, Number(part.amount) + Number(transaction.amount))
    } else {
        wallet = await walletRepo.getById(transaction.wallet_id)
        if (!wallet)
            throw new HasDataException("wallet not founded")
        await walletRepo.updateAmount(wallet.id, Number(wallet.amount) + Number(transaction.amount))
    }
    const tx = await transactionRepo.packetToWallet(wallet, Number(transaction.amount), transaction.id)
    returnObject.push(tx)
    return returnObject
}

const rejectTransaction_FromCreditcard = async (transaction) => {
    const returnObject = []
    const lastTransaction = transaction.parent //await transaction.getById(transaction.transaction_id)
    if (!lastTransaction)
        throw new HasDataException("lastTransaction(creditcard to wallet) not founded", {
            lastTransactionId: transaction.transaction_id
        })

    const wallet = await walletRepo.getById(transaction.from_id)
    if (!wallet)
        throw new HasDataException("wallet not founded")

    const creditcard = await creditcardRepo.getById(lastTransaction.from_id)
    if (!creditcard)
        throw new HasDataException("creditcard not founded")

    const txPacketToWallet = await transactionRepo.packetToWallet(wallet, Number(transaction.amount), transaction.id)
    returnObject.push(txPacketToWallet)
    const txWalletToCreditCard = await transactionRepo.ReverseMoney_WalletToCreditcard(wallet, creditcard.id, Number(transaction.amount), txPacketToWallet.id)
    returnObject.push(txWalletToCreditCard)
    creditcard.amount = Number(creditcard.amount) + Number(transaction.amount)
    await creditcard.save()
    return returnObject;
}

const rejectTransaction_FromLocked = async (transaction) => {
    const returnObject = []
    const locked = await lockedRepo.getById(transaction.from_id, { include: [Locked.wallet] })
    let wallet
    if (locked) {
        if (!locked.wallet)
            throw new HasDataException("wallet not founded")
        wallet = locked.wallet
        await partRepo.updateAmount(locked.id, Number(locked.amount) + Number(transaction.amount))
    } else {
        wallet = await walletRepo.getById(transaction.wallet_id)
        if (!wallet)
            throw new HasDataException("wallet not founded")
        await walletRepo.updateAmount(wallet.id, Number(wallet.amount) + Number(transaction.amount))
    }
    const tx = await transactionRepo.packetToWallet(wallet, Number(transaction.amount), transaction.id)
    returnObject.push(tx)
}


const rejectTransaction = async (transaction) => {
    let returnObject = [];
    if (transaction.type == transactionsTypes.SPEND_FROM_PART)
        returnObject = await rejectTransaction_FromPart(transaction)

    if (transaction.type == transactionsTypes.CREDITCARD_To_PACKET)
        returnObject = await rejectTransaction_FromCreditcard(transaction)

    if (transaction.type == transactionsTypes.LOCKED_TO_PACKET)
        returnObject = await rejectTransaction_FromLocked(transaction)

    transaction.is_confirmed = false;
    transaction.is_pause = false
    await transaction.save()
    return returnObject
}

const payTheTax = async (req, transaction) => {
    validate.setAction_PaidTheTax(req.body)
    const returnObject = []
    if (Number(transaction.amount) < Number(req.body.amount))
        throw new HasDataException("amount is bigger than transaction amount", {
            amount: req.body.amount,
            transactionAmount: transaction.amount,
        })
    const taxWallet = await walletRepo.getById(req.body.wallet_id)
    if (!taxWallet)
        throw new HasDataException("tax wallet not founded")
    const adminWallet = await walletRepo.getById(transaction.to_id)
    if (!adminWallet)
        throw new HasDataException("admin wallet not founded")
    const tx = await transactionRepo.adminWalletToTaxWallet(adminWallet, taxWallet, transaction.id, req.body)
    returnObject.push(tx)
    await walletRepo.updateAmount(taxWallet.id, Number(taxWallet.amount) + Number(req.body.amount))
    await walletRepo.updateAmount(adminWallet.id, Number(adminWallet.amount) - Number(req.body.amount))
    transaction.is_tax_payed = true
    await transaction.save()
    return returnObject;
}

module.exports.setActionByURL = async (req, transaction) => {
    const URL = req.url
    if (URL.endsWith("/hold")) {
        await checkTransaction(transaction, "hold")
        transaction.is_pause = true
        await transaction.save()
        return [transaction]
    }
    if (URL.endsWith("/accept")) {
        await checkTransaction(transaction, "accept")
        return await acceptTransaction(req, transaction)
    }
    if (URL.endsWith("/reject")) {
        await checkTransaction(transaction, "reject")
        return await rejectTransaction(transaction)
    }
    if (URL.endsWith("/tax")) {
        await checkTransactionForPaingTax(transaction)
        return await payTheTax(req, transaction)
    }
}


