const { v4: uuidv4 } = require("uuid");
const { Part, Wallet } = require("../models");
const BaseRepo = require("../core/baseRepo");
const { Op } = require("sequelize");
const Exception = require("../helpers/errorHelper");

class PartRepo extends BaseRepo {
    constructor() {
        super(Part)
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
        return await wallet.createPart({
            id: uuidv4(),
            service_id: wallet.service_id,
            packet_id: wallet.packet_id,
            // wallet_id: wallet.id, //came from sequlize associated
            name: fields.name,
            init_amount: Number(fields.amount),
            amount: Number(fields.amount),
        })
    }

    async updatePartName(id, fields) {
        const updateData = {}
        if (fields.name) updateData["name"] = fields.name
        return await this.updateById(id, updateData)
    }

    async updateAmount(id, amount) {
        const updateData = {}
        if (amount) updateData["amount"] = amount
        return await this.updateById(id, updateData)
    }

    async getPartWithWallet(id) {
        return await this.getById(id, {
            include: [
                {
                    association: Part.wallet,
                    include: [
                        Wallet.parts,
                        Wallet.lockeds,
                    ]
                }
            ]
        })
    }

}

module.exports = new PartRepo()
