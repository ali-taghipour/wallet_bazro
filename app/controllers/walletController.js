const response = require("../helpers/responseHelper");
const { pagination, searchFilter } = require("../services/paginationService");

const walletRepo = require("../repositories/walletRepo");
const {
    checkAccessInGetById,
    checkAccessInUpdate,
    checkAccessInGetAll,
    checkAccessInCharge
} = require("../services/walletService");
const validate = require("../validations/walletValidation");
const packetRepo = require("../repositories/packetRepo");
const paymentRepo = require("../repositories/paymentRepo");
const { Wallet } = require("../models");


module.exports.create = async (req, res) => {
    try {
        validate.create(req.body)
        const packet = await packetRepo.findByService(req.body.service_id)
        if (!packet) return response.error(res, "packet not founded")
        const wallet = await walletRepo.addNew(packet, req.body)
        if (wallet.userable_type == "admin") await packetRepo.updateAdminWalletId(packet, wallet.id)
        return response.success(res, wallet)
    } catch (e) {
        return response.exception(res, e);
    }
}

module.exports.update = async (req, res) => {
    try {
        validate.params(req.params)
        validate.update(req.body)
        const wallet = await walletRepo.getById(req.params.walletId)
        if (!wallet) return response.error(res, "not founded")
        await checkAccessInUpdate(req, wallet)
        const result = await walletRepo.updateById(wallet.id, req.body)
        return response.success(res, result)
    } catch (e) {
        return response.exception(res, e);
    }
}

module.exports.charge = async (req, res) => {
    try {
        validate.params(req.params)
        validate.charge(req.body)
        const wallet = await walletRepo.getById(req.params.walletId)
        if (!wallet) return response.error(res, "not founded")
        const { decoded_token } = await checkAccessInCharge(req, wallet)
        const payment = await paymentRepo.chargeWithOutGateway(decoded_token.id, decoded_token.role, wallet, Number(req.body.amount))
        const result = await walletRepo.updateAmount(wallet.id, Number(wallet.amount) + Number(req.body.amount))
        return response.success(res, { payment, result })
    } catch (e) {
        return response.exception(res, e);
    }
}

module.exports.getAll = async (req, res) => {
    try {
        validate.getAll(req.body)
        const { orderBy, orderType, limit, offset, dateFilter } = pagination(req)
        let { filter } = searchFilter(req, "wallet")
        filter = await checkAccessInGetAll(req, filter);
        const result = await walletRepo.getAll({ ...filter, ...dateFilter }, orderBy, orderType, offset, limit, {
            // include: [
            //     Wallet.parts,
            //     Wallet.lockeds
            // ]
        })
        return response.success(res, result)
    } catch (e) {
        return response.exception(res, e);
    }
}

module.exports.getById = async (req, res) => {
    try {
        validate.params(req.params)
        const wallet = await walletRepo.getWalletWithAllPartsAndLocks(req.params.walletId)
        if (!wallet) return response.error(res, "Not founded")
        await checkAccessInGetById(req, wallet)
        return response.success(res, wallet)
    } catch (e) {
        return response.exception(res, e);
    }
}