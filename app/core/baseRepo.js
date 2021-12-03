const { user } = require("../models");


class BaseRepo {
    constructor(model) {
        this.sequlizeModel = model
    }


    async getAll(
        filter = {},
        orderBy = "id",
        orderType = "DESC",
        offset = 0,
        limit = 10,
        otherOptions = {}
    ) {
        return await this.sequlizeModel.findAll({
            where: filter,
            order: [
                [orderBy,
                    orderType == "DESC" ? "DESC" : "ASC"]
            ],
            offset: offset,
            limit: limit,
            // attributes: { exclude: ['password'] }
            ...otherOptions
        })
    }
    async getOne(condition, orderBy = null, sortType = null, otherOptions = {}) {
        let order = [["createdAt", "DESC"]];
        if (orderBy)
            order = [[orderBy, sortType]]
        return await this.sequlizeModel.findOne({ where: condition, order: order, ...otherOptions })
    }

    async getById(id, otherOptions = {}) {
        return await this.sequlizeModel.findOne({ where: { id: id.toString() }, ...otherOptions })
    }


    async create(data, otherOptions = {}) {
        return await this.sequlizeModel.create(data, otherOptions)
    }

    async update(condition, updatedDate, returning = true) {
        return await this.sequlizeModel.update(updatedDate, {
            where: condition,
            returning: returning,
            // plain: plain
        })
    }

    async updateById(id, updatedDate) {
        return await this.sequlizeModel.update(updatedDate, { where: { id: id } })
    }


    async remove(condition) {
        return await this.sequlizeModel.destroy({ where: condition })
    }

    async removeByid(id) {
        return await this.sequlizeModel.destroy({ where: { id: id } })
    }

    async count(condition = {}) {
        return await this.sequlizeModel.count({ where: condition })
    }

    async findOrCreate(condition = {}, otherFields = {}, returning = true) {
        const item = await this.sequlizeModel.findOrCreate({
            where: condition,
            defaults: otherFields,
            returning: returning,
        });
        return item[0];
    }
    async updateOrCreate(condition = {}, otherFields = {}, returning = true) {
        const item = await this.findOrCreate(condition, otherFields, true)
        const updated = await this.update({ id: item.id }, otherFields, returning)
        return updated[0] == 1 ? updated[1][0] : item;

    }
}

module.exports = BaseRepo
