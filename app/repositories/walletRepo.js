const { v4: uuidv4 } = require("uuid");
const { Wallet } = require("../models");
const BaseRepo = require("../core/baseRepo");
const { Op } = require("sequelize");
const Exception = require("../helpers/errorHelper");

class WalletRepo extends BaseRepo {
    constructor() {
        super(Wallet)
    }
    async addNew(packet, fields) {
        return await this.findOrCreate({
            id: fields.id,
        }, {
            userable_id: fields.user_id,
            userable_type: fields.user_type,
            role_id: fields.role_id,
            name: fields.name,
            service_id: packet.service_id,
            packet_id: packet.id,
            amount: 0,
        })
    }

    async updateWallet(id, fields) {
        const updateData = {}
        if (fields.name) updateData["name"] = fields.name
        return await this.updateById(id, updateData)
    }
    async updateAmount(id, amount) {
        const updateData = {}
        updateData["amount"] = amount
        return await this.updateById(id, updateData)
    }

    async getWalletWithAllPartsAndLocks(id) {
        return await this.getById(id, {
            include: [
                Wallet.parts,
                Wallet.lockeds
            ]
        })
    }

    async getWalletWithPacket(id) {
        return await this.getById(id, {
            include: [
                Wallet.packet,
                Wallet.parts,
                Wallet.lockeds
            ]
        })
    }

    async getAdminsUsersWallets(serviceId) {
        const walletIds = await this.getAll({
            service_id: serviceId,
            userable_type: "user"
        },
            "id",
            null,
            0,
            10000,
            {
                attributes: ['id'],
                // raw: true,
            })
        let returnableArray = []
        for (let i = 0; i < walletIds.length; i++) {
            returnableArray.push(walletIds[i].id)
        }
        return returnableArray
    }

    async getAdminWalletByServiceId(serviceId) {
        return await this.getOne({
            service_id: serviceId,
            userable_type: "admin"
        })
    }

    async getAdminWalletByPacket(packet) {
        return await this.getOne({
            id: packet.admin_wallet_id,
            userable_type: "admin"
        })
    }

}

module.exports = new WalletRepo()
