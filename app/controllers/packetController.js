const response = require("../helpers/responseHelper");
const { pagination, searchFilter } = require("../services/paginationService");

const packetRepo = require("../repositories/packetRepo");
const {
    checkAccessInGetById,
    checkAccessInUpdate,
    checkAccessInGetAll
} = require("../services/packetServise");
const validate = require("../validations/packetValidation");


module.exports.create = async (req, res) => {
    try {
        validate.create(req.body)
        const packet = await packetRepo.addNew(req.body)
        return response.success(res, packet)
    } catch (e) {
        return response.exception(res, e);
    }
}

module.exports.update = async (req, res) => {
    try {
        validate.params(req.params)
        validate.update(req.body)
        const packet = await packetRepo.getById(req.params.packetId)
        if (!packet) return response.error(res, "not founded")
        await checkAccessInUpdate(req, packet)
        const result = await packetRepo.updateById(packet.id, req.body)
        return response.success(res, result)
    } catch (e) {
        return response.exception(res, e);
    }
}

module.exports.getAll = async (req, res) => {
    try {
        validate.getAll(req.body)
        const { orderBy, orderType, limit, offset, dateFilter } = pagination(req)
        let { filter } = searchFilter(req, "packet")
        filter = await checkAccessInGetAll(req, filter);
        const result = await packetRepo.getAll({ ...filter, ...dateFilter }, orderBy, orderType, offset, limit)
        return response.success(res, result)
    } catch (e) {
        return response.exception(res, e);
    }
}

module.exports.getById = async (req, res) => {
    try {
        validate.params(req.params)
        const packet = await packetRepo.getById(req.params.packetId)
        if (!packet) return response.error(res, "Not founded")
        await checkAccessInGetById(req, packet)
        return response.success(res, packet)
    } catch (e) {
        return response.exception(res, e);
    }
}