const { v4: uuidv4 } = require("uuid");
const { Withdrawal, Wallet } = require("../models");
const BaseRepo = require("../core/baseRepo");
const { Op } = require("sequelize");
const Exception = require("../helpers/errorHelper");

class WithdrawalRepo extends BaseRepo {
    constructor() {
        super(Withdrawal)
    }
    async addNew(wallet, amount) {
        return this.create({
            id: uuidv4(),
            wallet_id: wallet.id,
            amount: Number(amount),
            // is_confirmed:,
            // tracking_code:,
            // description:,
        })
    }

    async getwithdrawalWithAllPartsAndLocks(id) {
        return this.getById(id, {
            include: [
                {
                    association: Withdrawal.wallet,
                    include: [
                        Wallet.packet,
                        Wallet.parts,
                        Wallet.lockeds,
                    ]
                },
            ]
        })
    }

    async acceptWithdrawal(id, fields) {
        const updateData = { is_confirmed: true, }
        if (fields.tracking_code) updateData["tracking_code"] = fields.tracking_code
        if (fields.description) updateData["description"] = fields.description
        return await this.updateById(id, updateData)
    }
    async rejectWithdrawal(id, fields) {
        const updateData = { is_confirmed: false, }
        // if (fields.tracking_code) updateData["tracking_code"] = fields.tracking_code
        if (fields.description) updateData["description"] = fields.description
        return await this.updateById(id, updateData)
    }

    async updateWithdrawal(id, fields) {
        const updateData = {}
        if (fields.tracking_code) updateData["tracking_code"] = fields.tracking_code
        if (fields.description) updateData["description"] = fields.description
        return await this.updateById(id, updateData)
    }

}

module.exports = new WithdrawalRepo()
