const response = require("../helpers/responseHelper");
const { pagination, searchFilter } = require("../services/paginationService");

const partRepo = require("../repositories/partRepo");
const {
    checkAccessInGetById,
    checkAccessInUpdate,
    checkAccessInGetAll,
    checkAccessInSpend,
    getPacket,
    checkingAmount
} = require("../services/partService");
const validate = require("../validations/partValidation");
const walletRepo = require("../repositories/walletRepo");
const { checkWalletCanMakeANewPart } = require("../services/walletService");
const transactionRepo = require("../repositories/transactionRepo");
const { Wallet } = require("../models");


module.exports.create = async (req, res) => {
    try {
        validate.create(req.body)
        const wallet = await walletRepo.getById(req.body.wallet_id, { include: [Wallet.parts, Wallet.lockeds] })
        if (!wallet) return response.error(res, "wallet not founded")

        if (wallet.userable_type != "user") return response.error(res, "making part on this wallet is denied")
        //check Wallet can Make a new Part
        const { newWalletAmount } = checkWalletCanMakeANewPart(wallet, Number(req.body.amount))
        //making new part
        const part = await partRepo.addNew(wallet, req.body)
        //Make a transaction from Wallet to Part
        const transaction = await transactionRepo.walletToPart(wallet, part, Number(req.body.amount))
        //Update Wallet
        await walletRepo.updateAmount(part.wallet_id, newWalletAmount)
        return response.success(res, { part, transactionId: transaction.id })
    } catch (e) {
        return response.exception(res, e);
    }
}

module.exports.update = async (req, res) => {
    try {
        validate.params(req.params)
        validate.update(req.body)
        const part = await partRepo.getById(req.params.partId)
        if (!part) return response.error(res, "not founded")
        await checkAccessInUpdate(req, part)
        const result = await partRepo.updateById(part.id, req.body)
        return response.success(res, result)
    } catch (e) {
        return response.exception(res, e);
    }
}

module.exports.getAll = async (req, res) => {
    try {
        validate.getAll(req.body)
        const { orderBy, orderType, limit, offset, dateFilter } = pagination(req)
        let { filter } = searchFilter(req, "part")
        filter = await checkAccessInGetAll(req, filter);
        const result = await partRepo.getAll({ ...filter, ...dateFilter }, orderBy, orderType, offset, limit)
        return response.success(res, result)
    } catch (e) {
        return response.exception(res, e);
    }
}

module.exports.getById = async (req, res) => {
    try {
        validate.params(req.params)
        const part = await partRepo.getPartWithWallet(req.params.partId)
        if (!part)
            return response.error(res, "Not founded")
        await checkAccessInGetById(req, part)
        return response.success(res, part)
    } catch (e) {
        return response.exception(res, e);
    }
}

module.exports.spend = async (req, res) => {
    try {
        validate.params(req.params)
        validate.spend(req.body)
        const part = await partRepo.getPartWithWallet(req.params.partId)
        if (!part)
            return response.error(res, "part Not founded")
        const serviceId = await checkAccessInSpend(req, part)
        const packet = await getPacket(serviceId)
        const { newPartAmount } = await checkingAmount(part, part.wallet, Number(req.body.amount))
        //Make a transaction from Wallet to Part
        const transaction = await transactionRepo.spendFromPart(part, packet, req.body)
        //Update Wallet
        await partRepo.updateAmount(part.id, newPartAmount)
        return response.success(res, { transactionId: transaction.id })

    } catch (e) {
        return response.exception(res, e);
    }

}

module.exports.delete = async (req, res) => {
    try {
        validate.params(req.params)
        const part = await partRepo.getPartWithWallet(req.params.partId)
        if (!part) return response.error(res, "Not founded")
        const returnableObject = {}
        if (Number(part.amount) > 0) {
            //Make a transaction from Part to Wallet
            const transaction = await transactionRepo.residualPartToWallet(part, part.wallet)
            //Update Wallet
            const newWalletAmount = Number(part.amount) + Number(part.wallet.amount)
            await walletRepo.updateAmount(part.wallet.id, newWalletAmount)
        }
        const result = await partRepo.removeByid(part.id)
        returnableObject["result"] = result
        return response.success(res, returnableObject)
    } catch (e) {
        return response.exception(res, e);
    }
}