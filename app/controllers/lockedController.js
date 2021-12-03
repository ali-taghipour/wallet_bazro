const response = require("../helpers/responseHelper");
const { pagination, searchFilter } = require("../services/paginationService");

const lockedRepo = require("../repositories/lockedRepo");
const {
    checkAccessInGetById,
    checkAccessInUpdate,
    checkAccessInGetAll,
    checkAccessInUnlocked,
    checkAccessInCreate
} = require("../services/lockedService");
const validate = require("../validations/lockedValidation");
const walletRepo = require("../repositories/walletRepo");
const transactionRepo = require("../repositories/transactionRepo");
const HasDataException = require("../core/exceptions/hasDataException");


module.exports.create = async (req, res) => {
    try {
        validate.create(req.body)
        const wallet = await walletRepo.getById(req.body.wallet_id)
        await checkAccessInCreate(req, wallet)
        const locked = await lockedRepo.addNew(wallet, req.body)
        return response.success(res, locked)
    } catch (e) {
        return response.exception(res, e);
    }
}

module.exports.update = async (req, res) => {
    try {
        validate.params(req.params)
        validate.update(req.body)
        const locked = await lockedRepo.getById(req.params.lockedId)
        if (!locked) return response.error(res, "not founded")
        await checkAccessInUpdate(req, locked)
        const result = await lockedRepo.updateLocked(locked.id, req.body)
        return response.success(res, result)
    } catch (e) {
        return response.exception(res, e);
    }
}

module.exports.getAll = async (req, res) => {
    try {
        validate.getAll(req.body)
        const { orderBy, orderType, limit, offset, dateFilter } = pagination(req)
        let { filter } = searchFilter(req, "locked")
        filter = await checkAccessInGetAll(req, filter);
        const result = await lockedRepo.getAll({ ...filter, ...dateFilter }, orderBy, orderType, offset, limit)
        return response.success(res, result)
    } catch (e) {
        return response.exception(res, e);
    }
}

module.exports.getById = async (req, res) => {
    try {
        validate.params(req.params)
        const locked = await lockedRepo.getLockedWithWallet(req.params.lockedId)
        if (!locked) return response.error(res, "Not founded")
        await checkAccessInGetById(req, locked)
        return response.success(res, locked)
    } catch (e) {
        return response.exception(res, e);
    }
}

// module.exports.delete = async (req, res) => {
//     try {
//         validate.params(req.params)
//         const locked = await lockedRepo.getLockedWithWallet(req.params.lockedId)
//         if (!locked) return response.error(res, "Not founded")
//         const result = await lockedRepo.removeByid(locked.id)
//         return response.success(res, result)
//     } catch (e) {
//         return response.exception(res, e);
//     }
// }

module.exports.unlocked = async (req, res) => {
    try {
        validate.params(req.params)
        validate.unlocked(req.body)
        const locked = await lockedRepo.getLockedWithWallet(req.params.lockedId)
        if (!locked) return response.error(res, "Not founded")
        const { amount, newLockedAmount, newWalletAmount } = await checkAccessInUnlocked(req, locked)
        const returnableObject = {}
        if (amount && amount > 0) {
            //Make a transaction from wallet to packet
            const transaction = await transactionRepo.lockedToPacket(locked, locked.wallet, locked.packet, req.body)
            //Update Wallet
            const updatedWallet = await walletRepo.updateAmount(locked.wallet.id, newWalletAmount)
            returnableObject["transactionId"] = transaction.id
        }
        //delete locked recorde
        returnableObject["result"] = await lockedRepo.removeByid(locked.id)
        return response.success(res, returnableObject)
    } catch (e) {
        return response.exception(res, e);
    }
}

module.exports.deductMoneyWithoutUnlocked = async (req, res) => {
    try {
        validate.params(req.params)
        validate.unlocked(req.body)
        const locked = await lockedRepo.getLockedWithWallet(req.params.lockedId)
        if (!locked) return response.error(res, "Not founded")
        const { amount, newLockedAmount, newWalletAmount } = await checkAccessInUnlocked(req, locked)
        if (amount <= 0)
            throw new HasDataException("amount should be bigger than 0")
        //Make a transaction from wallet to packet
        const transaction = await transactionRepo.lockedToPacket(locked, locked.wallet, locked.packet, req.body)
        //Update Wallet
        const updatedWallet = await walletRepo.updateAmount(locked.wallet.id, newWalletAmount)
        const updatedLocked = await lockedRepo.updateAmount(locked.id, newLockedAmount)
        return response.success(res, { transactionId: transaction.id })
    } catch (e) {
        return response.exception(res, e);
    }
}