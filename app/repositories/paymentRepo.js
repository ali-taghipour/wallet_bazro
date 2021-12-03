const { v4: uuidv4 } = require("uuid");
const { Payment } = require("../models");
const BaseRepo = require("../core/baseRepo");
const { Op } = require("sequelize");
const Exception = require("../helpers/errorHelper");
const paymentStatusTypes = require("../constants/paymentStatusTypes");

class PaymentRepo extends BaseRepo {
    constructor() {
        super(Payment)
    }
    async addNew(userable_id, userable_type, wallet, fields) {
        return await this.create({
            userable_id: userable_id,
            userable_type: userable_type,
            service_id: wallet.service_id,
            wallet_id: wallet.id,
            moduleName: "pay.ir",
            amount: Number(fields.amount),
            status: paymentStatusTypes.unPayed
        })
    }

    async chargeWithOutGateway(userable_id, userable_type, wallet, amount) {
        return await this.create({
            userable_id: userable_id,
            userable_type: userable_type,
            service_id: wallet.service_id,
            wallet_id: wallet.id,
            moduleName: "chargeWithoutGateway",
            amount: Number(amount),
            status: paymentStatusTypes.verified
        })
    }

    async getPayment(id) {
        return await this.getById(id)
    }

    async findPaymentByToken(token) {
        return await this.getOne({ token: token })
    }

    async updatePaymentStatusToSendToBank(id) {
        return await this.updateById(id, {
            status: paymentStatusTypes.sendToBank
        })
    }
    async updatePaymentStatusToBackFromBank(id) {
        return await this.updateById(id, {
            status: paymentStatusTypes.backFromBank
        })
    }
    async updatePaymentStatusToSendToBank(id) {
        return await this.updateById(id, {
            status: paymentStatusTypes.verified
        })
    }

}

module.exports = new PaymentRepo()
