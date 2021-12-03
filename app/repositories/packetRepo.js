const { v4: uuidv4 } = require("uuid");
const { Packet } = require("../models");
const BaseRepo = require("../core/baseRepo");
const { Op } = require("sequelize");
const Exception = require("../helpers/errorHelper");

class PacketRepo extends BaseRepo {
    constructor() {
        super(Packet)
    }
    async addNew(fields) {
        return await this.findOrCreate({
            id: fields.id,
        }, {
            service_id: fields.service_id,
            name: fields.name,
        })
    }

    async updatePacket(id, fields) {
        const updateData = {}
        if (fields.name) updateData["name"] = fields.name
        if (fields.min_deposit) updateData[fields.min_deposit] = fields.min_deposit
        if (fields.max_deposit) updateData[fields.max_deposit] = fields.max_deposit
        if (fields.min_withdrawal) updateData[fields.min_withdrawal] = fields.min_withdrawal
        if (fields.max_withdrawal) updateData[fields.max_withdrawal] = fields.max_withdrawal
        if (fields.max_capacity) updateData[fields.max_capacity] = fields.max_capacity
        return await this.updateById(id, updateData)
    }

    async findByService(serviceId) {
        return await this.getOne({
            service_id: serviceId,
        })
    }

    async updateAdminWalletId(packet, wallet_id) {
        packet.admin_wallet_id = wallet_id
        return await packet.save()
    }

}

module.exports = new PacketRepo()
