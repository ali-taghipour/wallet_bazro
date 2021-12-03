const response = require("../helpers/responseHelper");
const { pagination, searchFilter } = require("../services/paginationService");

const paymentRepo = require("../repositories/paymentRepo");
const {
    checkAccessInGetById,
    checkAccessInUpdate,
    checkAccessInGetAll,
    checkAccessInCreate,
    checkAmountInPacket
} = require("../services/paymentService");
const validate = require("../validations/paymentValidation");
const walletRepo = require("../repositories/walletRepo");
const { getTokenFromPaymentGataway, verifyPayment } = require("../services/payIr");
const paymentStatusTypes = require("../constants/paymentStatusTypes");


module.exports.create = async (req, res) => {
    try {
        validate.create(req.body)
        const { userable_id, userable_type } = await checkAccessInCreate(req)
        const wallet = await walletRepo.getWalletWithPacket(req.body.wallet_id)
        await checkAmountInPacket(wallet, Number(req.body.amount))
        const payment = await paymentRepo.addNew(userable_id, userable_type, wallet, req.body)
        const { paymentLink } = await getTokenFromPaymentGataway(req, payment);
        return response.success(res, { paymentLink })
    } catch (e) {
        return response.exception(res, e);
    }
}

module.exports.paymentVerifyByGateway = async (req, res) => {
    try {
        //status={transaction_status}&token={token}
        const { status, token } = req.query
        if (status == 1 && token) {
            const payment = await paymentRepo.findPaymentByToken(token)
            await paymentRepo.updatePaymentStatusToBackFromBank(payment.id)
            const transaction = await verifyPayment(token, payment)
            return response.success(res, { transactionId: transaction.id })
        }
    } catch (e) {
        return response.exception(res, e);
    }
}

// module.exports.update = async (req, res) => {
//     try {
//         validate.params(req.params)
//         validate.update(req.body)
//         const payment = await paymentRepo.getById(req.params.paymentId)
//         if (!payment) return response.error(res, "not founded")
//         await checkAccessInUpdate(req, payment)
//         const result = await paymentRepo.updateById(payment.id, req.body)
//         return response.success(res, result)
//     } catch (e) {
//         return response.exception(res, e);
//     }
// }

module.exports.getAll = async (req, res) => {
    try {
        validate.getAll(req.body)
        const { orderBy, orderType, limit, offset, dateFilter } = pagination(req)
        let { filter } = searchFilter(req, "payment")
        filter = await checkAccessInGetAll(req, filter);
        const result = await paymentRepo.getAll({ ...filter, ...dateFilter }, orderBy, orderType, offset, limit)
        return response.success(res, result)
    } catch (e) {
        return response.exception(res, e);
    }
}

module.exports.getAllStatusTypes = async (req, res) => {
    try {
        return response.success(res, paymentStatusTypes)
    } catch (e) {
        return response.exception(res, e);
    }
}

module.exports.getById = async (req, res) => {
    try {
        validate.params(req.params)
        const payment = await paymentRepo.getPayment(req.params.paymentId)
        if (!payment) return response.error(res, "Not founded")
        await checkAccessInGetById(req, payment)
        return response.success(res, payment)
    } catch (e) {
        return response.exception(res, e);
    }
}