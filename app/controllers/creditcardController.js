const response = require("../helpers/responseHelper");
const { pagination, searchFilter } = require("../services/paginationService");

const creditcardRepo = require("../repositories/creditcardRepo");
const {
    checkAccessInGetById,
    checkAccessInUpdate,
    checkAccessInGetAll,
    checkAccessInCreate,
    getAdminWallet,
    getCreditCard,
    checkAccessToCreditCard,
    checkCreditCard,
    returnMoneyFromCreditCardToAdminCard,
} = require("../services/creditcardService");
const validate = require("../validations/creditcardValidation");
const walletRepo = require("../repositories/walletRepo");
const packetRepo = require("../repositories/packetRepo");
const transactionRepo = require("../repositories/transactionRepo");
const HasDataException = require("../core/exceptions/hasDataException");
const { Creditcard } = require("../models");


module.exports.createCreditCard = async (req, res) => {
    try {
        validate.createCreditcard(req.body)
        validate.walletIds(req.body)
        const serviceId = await checkAccessInCreate(req)
        const adminWallet = await getAdminWallet(serviceId)
        if (adminWallet.userable_type != "admin")
            return response.error(res, "making creditcard on this wallet is denied")
        if (Number(adminWallet.amount) < Number(req.body.amount))
            return response.error(res, "not enough money on this wallet ")
        const creditcard = await creditcardRepo.addNewCreditCard(adminWallet, req.body)
        //make a transaction = walletToCreditcard
        const transaction = await transactionRepo.chargingCreditcard(adminWallet, creditcard, Number(req.body.amount))
        //update adminWallet amount
        const result = await walletRepo.updateAmount(adminWallet.id, Number(adminWallet.amount) - Number(req.body.amount))
        return response.success(res, { creditcard, transactionId: transaction.id })
    } catch (e) {
        return response.exception(res, e);
    }
}

module.exports.createGiftcard = async (req, res) => {
    try {
        validate.createGiftcard(req.body)
        const serviceId = await checkAccessInCreate(req)
        const adminWallet = await getAdminWallet(serviceId)
        if (adminWallet.userable_type != "admin")
            return response.error(res, "making creditcard on this wallet is denied")
        if (adminWallet.amount < req.body.amount)
            return response.error(res, "not enough money on this wallet ")
        const creditcard = await creditcardRepo.addNewGiftCard(adminWallet, req.body)
        //make a transaction = walletToCreditcard
        const transaction = await transactionRepo.chargingCreditcard(adminWallet, creditcard, Number(req.body.amount))
        //update adminWallet amount
        const result = await walletRepo.updateAmount(adminWallet.id, Number(adminWallet.amount) - Number(req.body.amount))
        return response.success(res, { creditcard, transactionId: transaction.id })
    } catch (e) {
        return response.exception(res, e);
    }
}

// module.exports.update = async (req, res) => {
//     try {
//         validate.params(req.params)
//         validate.update(req.body)
//         const creditcard = await creditcardRepo.getById(req.params.creditcardId)
//         if (!creditcard) return response.error(res, "not founded")
//         await checkAccessInUpdate(req, creditcard)
//         const result = await creditcardRepo.updateById(creditcard.id, req.body)
//         return response.success(res, result)
//     } catch (e) {
//         return response.exception(res, e);
//     }
// }

module.exports.getAll = async (req, res) => {
    try {
        validate.getAll(req.body)
        const { orderBy, orderType, limit, offset, dateFilter } = pagination(req)
        let { filter } = searchFilter(req, "creditcard")
        filter = await checkAccessInGetAll(req, filter);
        const result = await creditcardRepo.getAll({ ...filter, ...dateFilter }, orderBy, orderType, offset, limit)
        return response.success(res, result)
    } catch (e) {
        return response.exception(res, e);
    }
}

module.exports.getById = async (req, res) => {
    try {
        validate.params(req.params)
        const creditcard = await creditcardRepo.getById(req.params.creditcardId)
        if (!creditcard) return response.error(res, "Not founded")
        await checkAccessInGetById(req, creditcard)
        return response.success(res, creditcard)
    } catch (e) {
        return response.exception(res, e);
    }
}

module.exports.spendFromCreditCard = async (req, res) => {
    try {
        validate.params(req.params)
        validate.spendFromCreditCard(req.body)
        const creditcard = await creditcardRepo.getCreditCardWithPacket(req.params.creditcardId)
        await checkCreditCard(req, creditcard, "creditcard")
        await checkAccessToCreditCard(req, creditcard)
        //make transaction from creditcard to wallet
        const credicardTransaction = await transactionRepo.creditcardToWallet(creditcard, req.body)
        //make transaction from wallet to packet
        const packet = creditcard.packet
        const walletTransaction = await transactionRepo.walletToPacket(credicardTransaction, creditcard, packet, req.body)

        return response.success(res, { credicardTransactionId: credicardTransaction.id, walletTransactionId: walletTransaction.id })
    } catch (e) {
        return response.exception(res, e);
    }


}
module.exports.spendFromGiftCard = async (req, res) => {
    try {
        validate.params(req.params)
        validate.spendFromGiftCard(req.body)
        const creditcard = await creditcardRepo.getCreditCardWithPacket(req.params.creditcardId)
        await checkCreditCard(req, creditcard, "giftcard")
        await checkAccessToCreditCard(req, creditcard)
        //make transaction from creditcard to wallet
        const credicardTransaction = await transactionRepo.creditcardToWallet(creditcard, req.body)
        //make transaction from wallet to packet
        const packet = creditcard.packet
        const walletTransaction = await transactionRepo.walletToPacket(credicardTransaction, creditcard, packet, req.body)

        return response.success(res, { credicardTransactionId: credicardTransaction.id, walletTransactionId: walletTransaction.id })
    } catch (e) {
        return response.exception(res, e);
    }
}


module.exports.delete = async (req, res) => {
    try {
        validate.params(req.params)
        const creditcard = await creditcardRepo.getCreditCardWithPacket(req.params.creditcardId)
        if (!creditcard) return response.error(res, "CreditCard Not founded")
        if (!creditcard.packet) return response.error(res, "packet Not founded")
        const returnableObject = {}
        if (Number(creditcard.amount) > 0) {
            const adminWallet = await walletRepo.getAdminWalletByPacket(creditcard.packet)
            returnableObject["transactionId"] = await returnMoneyFromCreditCardToAdminCard(creditcard, adminWallet)
        }
        // returnableObject["result"] = await creditcardRepo.removeByid(creditcard.id)
        return response.success(res, returnableObject)
    } catch (e) {
        return response.exception(res, e);
    }
}