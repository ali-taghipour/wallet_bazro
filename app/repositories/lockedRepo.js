const { v4: uuidv4 } = require("uuid");
const { Locked, Wallet } = require("../models");
const BaseRepo = require("../core/baseRepo");
const { Op } = require("sequelize");
const Exception = require("../helpers/errorHelper");

class LockedRepo extends BaseRepo {
    constructor() {
        super(Locked)
    }

    // async addNew(fields) {
    //     return await this.findOrCreate({
    //         id: fields.id,
    //     }, {
    //         service_id: fields.service_id,
    //         packet_id: fields.packet_id,
    //         wallet_id: fields.wallet_id,
    //         name: fields.name,
    //         amount: 0,
    //     })
    // }
    async addNew(wallet, fields) {
        return await wallet.createLocked({
            id: uuidv4(),
            service_id: wallet.service_id,
            userable_id: wallet.userable_id,
            userable_type: wallet.userable_type,
            // wallet_id: wallet.id, //came from sequlize associated
            description: fields.description,
            amount: Number(fields.amount),
        })
    }

    async updateLocked(id, fields) {
        const updateData = {}
        if (fields.description) updateData["description"] = fields.description
        return await this.updateById(id, updateData)
    }

    async updateAmount(id, amount) {
        const updateData = {}
        if (amount) updateData["amount"] = amount
        return await this.updateById(id, updateData)
    }

    async getLockedWithWallet(id) {
        return await this.getById(id, {
            include: [
                {
                    association: Locked.packet
                },
                {
                    association: Locked.wallet,
                    include: [
                        Wallet.parts,
                        Wallet.lockeds
                    ]
                }
            ]
        })
    }

}

module
    .exports = new LockedRepo()
