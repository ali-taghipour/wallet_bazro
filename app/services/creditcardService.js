const HasDataException = require("../core/exceptions/hasDataException");
const RestrictedAreaException = require("../core/exceptions/restrictedAreaException")
const { decodeToken } = require("./tokenService")
const validate = require("../validations/creditcardValidation");
const { Op } = require("sequelize");
const packetRepo = require("../repositories/packetRepo");
const walletRepo = require("../repositories/walletRepo");
const { Creditcard } = require("../models");
const creditcardRepo = require("../repositories/creditcardRepo");
const logHelper = require("../helpers/logHelper");
const transactionRepo = require("../repositories/transactionRepo");


module.exports.checkAccessInCreate = async (req) => {
    const decoded_token = await decodeToken(req.headers.authorization)
    const fields = {}

    if (decoded_token.role == "super_admin") {
        validate.createBySuperAdmin(req.body)
        fields["service_id"] = req.body.service_id
    }
    if (decoded_token.role == "admin") {
        fields["service_id"] = decoded_token.service
    }
    return fields.service_id
}

module.exports.getAdminWallet = async (service_id) => {
    const packet = await packetRepo.findByService(service_id)
    if (!packet)
        throw new HasDataException("packet not founded")
    if (!packet.admin_wallet_id)
        throw new HasDataException("admin_wallet not founded")
    const adminWallet = await walletRepo.getById(packet.admin_wallet_id)
    if (!adminWallet)
        throw new HasDataException("admin_wallet not founded")
    return adminWallet;
}

module.exports.passGenerator = () => {
    const minm = 100;
    const maxm = 999;
    const random = Math.floor(Math.random() * (maxm - minm + 1)) + minm;
    return random;
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
        filter["wallets"] = { [Op.contains]: decoded_token.wallet_id }
        return filter;
    }
}

module.exports.checkAccessInGetById = async (req, creditcard) => {
    const decoded_token = await decodeToken(req.headers.authorization)

    if (decoded_token.role == "super_admin") {
        return;
    }
    if (decoded_token.role == "admin") {
        if (!creditcard.service_id == decoded_token.service)
            throw new RestrictedAreaException("access denied")
    }
    if (decoded_token.role == "user") {
        if (!(creditcard.wallets && creditcard.wallets.includes(decoded_token.wallet_id)))
            throw new RestrictedAreaException("access denied")
    }
}

module.exports.checkAccessInUpdate = async (req, creditcard) => {
    const decoded_token = await decodeToken(req.headers.authorization)

    if (decoded_token.role == "super_admin") {
        return;
    }
    if (decoded_token.role == "admin") {
        if (!creditcard.service_id == decoded_token.service)
            throw new RestrictedAreaException("access denied")
    }
    if (decoded_token.role == "user") {
        if (!(creditcard.wallets && creditcard.wallets.includes(decoded_token.wallet_id)))
            throw new RestrictedAreaException("access denied")
    }
}


module.exports.checkCreditCard = async (req, creditcard, type = "creditcard") => {
    if (!creditcard)
        throw new HasDataException(`not founded`)
    if (creditcard.type != type)
        throw new HasDataException(`not founded - wrong type of card`)

    if (creditcard.type == "giftcard" && creditcard.password != req.body.password)
        throw new HasDataException(`${creditcard.type} password not correct`)

    if (Number(creditcard.amount) < Number(req.body.amount))
        throw new HasDataException(`${creditcard.type} amount has not enough money`, {
            cardAmount: Number(creditcard.amount),
            amount: Number(req.body.amount),
        })

    return creditcard
}

module.exports.checkAccessToCreditCard = (req, creditcard) => {
    if (creditcard.type == "creditcard") {
        if (!creditcard.wallets)
            throw new HasDataException(`this creditcard for this wallet_id not accessable`)
        if (creditcard.wallets.length == 0)
            throw new HasDataException(`this creditcard for this wallet_id not accessable`)
        if (!creditcard.wallets.includes(req.body.wallet_id))
            throw new HasDataException(`this creditcard for this wallet_id not accessable`)
    }
    if (creditcard.type == "giftcard") {
        if (creditcard.wallets != null
            && creditcard.wallets.length > 0
            && creditcard.wallets[0] != req.body.wallet_id)
            throw new HasDataException("this gift card or this wallet_id not accessable")
        creditcard.wallets = [req.body.wallet_id]
    }
    creditcard.amount = Number(creditcard.amount) - Number(req.body.amount)
    creditcard.save()
}

module.exports.returnMoneyFromCreditCardToAdminCard = async (creditcard, adminWallet) => {
    let transaction;
    if (Number(creditcard.amount) > 0)
        //Make a transaction from creditcard to admin Wallet
        transaction = await transactionRepo.residualCreditCardToAdminWallet(creditcard, adminWallet)
    //Update Wallet
    const newWalletAmount = Number(creditcard.amount) + Number(adminWallet.amount)
    await walletRepo.updateAmount(adminWallet.id, newWalletAmount)
    await creditcardRepo.updateAmount(creditcard.id, 0)
    return transaction ? transaction.id : null
}

module.exports.removeAllExpiredCreditGiftCard = async () => {
    try {
        const cards = await creditcardRepo.getAllExpiredCreditcards()
        if (cards.length > 0) {
            for (let i = 0; i < cards.length; i++) {
                const card = cards[i];
                if (Number(card.amount) != 0) {
                    if (!card.packet) {
                        logHelper.error(`Error: remove expired Creditcard: creditcardId:${card.id} has not any packet !!!`)
                        continue;
                    }
                    const adminWallet = await walletRepo.getAdminWalletByPacket(card.packet)
                    await this.returnMoneyFromCreditCardToAdminCard(card, adminWallet)
                }
            }
        }
    } catch (error) {
        logHelper.error(error)
    }
}
