const response = require("../helpers/responseHelper");
const { pagination, searchFilter } = require("../services/paginationService");

const withdrawalRepo = require("../repositories/withdrawalRepo");
const {
    checkAccessInGetById,
    checkAccessInUpdate,
    checkAccessInGetAll,
    checkAccessInCreate,
    checkAccessInAccept,
    checkAmount,
    checkAccessInReject
} = require("../services/withdrawalService");
const validate = require("../validations/withdrawalValidation");
const packetRepo = require("../repositories/packetRepo");
const transactionRepo = require("../repositories/transactionRepo");
const { Withdrawal, Wallet } = require("../models");
const walletRepo = require("../repositories/walletRepo");


module.exports.create = async (req, res) => {
    try {
        validate.create(req.body)
        const { wallet, newWalletAmount } = await checkAccessInCreate(req)
        const withdrawal = await withdrawalRepo.addNew(wallet, Number(req.body.amount))
        return response.success(res, withdrawal)
    } catch (e) {
        return response.exception(res, e);
    }
}

module.exports.update = async (req, res) => {
    try {
        validate.params(req.params)
        validate.update(req.body)
        const withdrawal = await withdrawalRepo.getById(req.params.withdrawalId)
        if (!withdrawal) return response.error(res, "not founded")
        await checkAccessInUpdate(req, withdrawal)
        const result = await withdrawalRepo.updateWithdrawal(withdrawal.id, req.body)
        return response.success(res, result)
    } catch (e) {
        return response.exception(res, e);
    }
}

module.exports.accept = async (req, res) => {
    try {
        validate.params(req.params)
        validate.update(req.body)
        const withdrawal = await withdrawalRepo.getById(req.params.withdrawalId, {
            include: [
                {
                    association: Withdrawal.wallet,
                    include: [
                        Wallet.packet,
                        Wallet.parts,
                        Wallet.lockeds,
                    ]
                },
            ]
        })
        if (!withdrawal) return response.error(res, "withdrawal not founded")
        await checkAccessInAccept(req, withdrawal)
        const { wallet, newWalletAmount } = await checkAmount(withdrawal)
        const result = await withdrawalRepo.acceptWithdrawal(withdrawal.id, req.body)
        const transaction = await transactionRepo.walletToWithdrawal(wallet, withdrawal)
        const updatedWallet = await walletRepo.updateAmount(wallet.id, newWalletAmount)
        return response.success(res, { transactionId: transaction.id, walletAmount: newWalletAmount })
    } catch (e) {
        return response.exception(res, e);
    }
}


module.exports.reject = async (req, res) => {
    try {
        validate.params(req.params)
        validate.update(req.body)
        const withdrawal = await withdrawalRepo.getById(req.params.withdrawalId)
        if (!withdrawal) return response.error(res, "withdrawal not founded")
        await checkAccessInReject(req, withdrawal)
        const result = await withdrawalRepo.rejectWithdrawal(withdrawal.id, req.body)
        return response.success(res, result)
    } catch (e) {
        return response.exception(res, e);
    }
}

module.exports.getAll = async (req, res) => {
    try {
        validate.getAll(req.body)
        const { orderBy, orderType, limit, offset, dateFilter } = pagination(req)
        let { filter } = searchFilter(req, "withdrawal")
        filter = await checkAccessInGetAll(req, filter)
        const result = await withdrawalRepo.getAll({ ...filter, ...dateFilter }, orderBy, orderType, offset, limit)
        return response.success(res, result)
    } catch (e) {
        return response.exception(res, e);
    }
}

module.exports.getById = async (req, res) => {
    try {
        validate.params(req.params)
        const withdrawal = await withdrawalRepo.getwithdrawalWithAllPartsAndLocks(req.params.withdrawalId)
        if (!withdrawal) return response.error(res, "Not founded")
        await checkAccessInGetById(req, withdrawal)
        return response.success(res, withdrawal)
    } catch (e) {
        return response.exception(res, e);
    }
}