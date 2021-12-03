const response = require("../helpers/responseHelper");
const { pagination, searchFilter } = require("../services/paginationService");

const transactionRepo = require("../repositories/transactionRepo");
const {
    checkAccessInGetById,
    checkAccessInUpdate,
    checkAccessInGetAll,
    getOtherFilterByURL,
    setActionByURL
} = require("../services/transactionService");
const validate = require("../validations/transactionValidation");
const packetRepo = require("../repositories/packetRepo");
const transactionsTypes = require("../constants/transactionsTypes");


// module.exports.create = async (req, res) => {
//     try {
//         validate.create(req.body)
//         const packet = await packetRepo.findByService(req.body.service_id)
//         if (!packet) return response.error(res, "packet not founded")
//         const transaction = await transactionRepo.addNew(packet, req.body)
//         if (transaction.userable_type == "admin") await packetRepo.updateAdmintransactionId(packet, transaction.id)
//         return response.success(res, transaction)
//     } catch (e) {
//         return response.exception(res, e);
//     }
// }

// module.exports.update = async (req, res) => {
//     try {
//         validate.params(req.params)
//         validate.update(req.body)
//         const transaction = await transactionRepo.getById(req.params.transactionId)
//         if (!transaction) return response.error(res, "not founded")
//         await checkAccessInUpdate(req, transaction)
//         const result = await transactionRepo.updateById(transaction.id, req.body)
//         return response.success(res, result)
//     } catch (e) {
//         return response.exception(res, e);
//     }
// }

module.exports.getAll = async (req, res) => {
    try {
        validate.getAll(req.body)
        const { orderBy, orderType, limit, offset, dateFilter } = pagination(req)
        let { filter } = searchFilter(req, "transaction")
        filter = await checkAccessInGetAll(req, filter);
        filter = await getOtherFilterByURL(req, filter)
        const result = await transactionRepo.getAll({ ...filter, ...dateFilter }, orderBy, orderType, offset, limit)
        return response.success(res, result)
    } catch (e) {
        return response.exception(res, e);
    }
}

module.exports.getById = async (req, res) => {
    try {
        validate.params(req.params)
        const transaction = await transactionRepo.getTransaction(req.params.transactionId)
        if (!transaction) return response.error(res, "Not founded")
        await checkAccessInGetById(req, transaction)
        return response.success(res, transaction)
    } catch (e) {
        return response.exception(res, e);
    }
}


module.exports.setAction = async (req, res) => {
    try {
        validate.params(req.params)
        const transaction = await transactionRepo.getTransaction(req.params.transactionId)
        if (!transaction) return response.error(res, "transaction Not founded")
        await checkAccessInGetById(req, transaction)
        const result = await setActionByURL(req, transaction)
        return response.success(res, result)
    } catch (e) {
        return response.exception(res, e);
    }
}

module.exports.getAllTypes = async (req, res) => {
    try {
        return response.success(res, transactionsTypes)
    } catch (e) {
        return response.exception(res, e);
    }
}