const { v4: uuidv4 } = require("uuid");
const { Creditcard } = require("../models");
const BaseRepo = require("../core/baseRepo");
const { Op } = require("sequelize");
const Exception = require("../helpers/errorHelper");
const creditcardService = require("../services/creditcardService");
const moment = require('moment');
const _ = require("lodash")

class CreditcardRepo extends BaseRepo {
    constructor() {
        super(Creditcard)
    }

    async addNewCreditCard(wallet, fields) {
        return await this.create({
            id: uuidv4(),
            type: "creditcard",
            // password: null,
            service_id: wallet.service_id,
            wallets: [...fields.wallet_ids],
            amount: Number(fields.amount),
            expire_at: fields.expire_at ? fields.expire_at : null
        })
    }
    async addNewGiftCard(wallet, fields) {
        return await this.create({
            id: uuidv4(),
            type: "giftcard",
            password: creditcardService.passGenerator(),
            service_id: wallet.service_id,
            amount: Number(fields.amount),
            expire_at: fields.expire_at ? fields.expire_at : null
        })
    }


    async updateAmount(id, amount) {
        const updateData = {}
        if (!_.isUndefined(amount)) updateData["amount"] = amount
        const x =  await this.updateById(id, updateData)
        return x
    }

    async getCreditCardWithPacket(id) {
        return await this.getById(id, {
            include: [
                Creditcard.packet
            ]
        })
    }

    async getAllExpiredCreditcards() {
        return await this.getAll({
            expire_at: {
                [Op.lt]: moment().toDate()
            },
            amount: {
                [Op.gt]: 0
            }
        },
            "id",
            null,
            0,
            10000,
            {
                include: [
                    Creditcard.packet
                ]
            })
    }

}

module.exports = new CreditcardRepo()
