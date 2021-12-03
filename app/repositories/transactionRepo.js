const { v4: uuidv4 } = require("uuid");
const { Transaction } = require("../models");
const BaseRepo = require("../core/baseRepo");
const { Op } = require("sequelize");
const Exception = require("../helpers/errorHelper");
const paymentStatusTypes = require("../constants/paymentStatusTypes");
const transactionsTypes = require("../constants/transactionsTypes");
const wallet = require("../models/wallet");

class TransactionRepo extends BaseRepo {
    constructor() {
        super(Transaction)
    }


    // id : fields.id,
    // service_id : fields.service_id,
    // from_id : fields.from_id,
    // from_type : fields.from_type,
    // to_id : fields.to_id,
    // to_type : fields.to_type,
    // type : fields.type,
    // amount : fields.amount,
    // sections : fields.sections,
    // description : fields.description,
    // transaction_id : fields.transaction_id,
    // is_tax_payed : fields.is_tax_payed,
    // is_confirmed : fields.is_confirmed,

    //for payment
    async paymentToWallet(payment) {
        return this.create({
            id: uuidv4(),
            service_id: payment.service_id,
            wallet_id: payment.wallet_id,
            from_id: payment.id,
            from_type: "payment",
            to_id: payment.wallet_id,
            to_type: "wallet",
            type: transactionsTypes.DEPOSIT,
            amount: Number(payment.amount),
            // sections : fields.sections,
            // description : fields.description,
            // transaction_id : fields.transaction_id,
            // is_tax_payed : fields.is_tax_payed,
            is_confirmed: true,
        })
    }

    //for making part
    async walletToPart(wallet, part, amount) {
        return this.create({
            id: uuidv4(),
            service_id: wallet.service_id,
            wallet_id: wallet.id,
            from_id: wallet.id,
            from_type: "wallet",
            to_id: part.id,
            to_type: "part",
            type: transactionsTypes.MAKE_NEW_PART,
            amount: amount,
            is_confirmed: true,
        })
    }

    //for deleteing part 
    async residualPartToWallet(part, wallet) {
        return this.create({
            id: uuidv4(),
            service_id: wallet.service_id,
            wallet_id: wallet.id,
            from_id: part.id,
            from_type: "part",
            to_id: wallet.id,
            to_type: "wallet",
            type: transactionsTypes.REMINING_IN_PART,
            amount: Number(part.amount),
            is_confirmed: true,
        })
    }

    //for sell from part
    async spendFromPart(part, packet, fields) {
        return this.create({
            id: uuidv4(),
            service_id: part.service_id,
            wallet_id: part.wallet_id,
            from_id: part.id,
            from_type: "part",
            to_id: packet.id,
            to_type: "packet",
            type: transactionsTypes.SPEND_FROM_PART,
            amount: Number(fields.amount),
            sections: fields.sections,//?
            description: fields.description,//?
            // transaction_id : fields.transaction_id,
            // is_tax_payed : fields.is_tax_payed,
            // is_confirmed: false,
            expire_at: fields.expire_at ? fields.expire_at : null,
            // is_pause: fields.is_pause, //false
        })
    }

    //for punishment in locked (deducted money)
    async lockedToPacket(locked, wallet, packet, fields) {
        return this.create({
            id: uuidv4(),
            service_id: wallet.service_id,
            wallet_id: wallet.id,
            from_id: wallet.id,
            from_type: "wallet",
            to_id: packet.id,
            to_type: "packet",
            type: transactionsTypes.LOCKED_TO_PACKET,
            amount: Number(fields.amount),
            sections: fields.sections,//?
            description: "lockedId:" + locked.id + "\n" + fields.description,//?
            // transaction_id : fields.transaction_id,
            // is_tax_payed : fields.is_tax_payed,
            // is_confirmed: false,
            expire_at: fields.expire_at ? fields.expire_at : null,
            // is_pause: fields.is_pause, //false
        })
    }

    async chargingCreditcard(adminWallet, creditcard, amount) {
        return this.create({
            id: uuidv4(),
            service_id: adminWallet.service_id,
            wallet_id: adminWallet.id,
            from_id: adminWallet.id,
            from_type: "wallet",
            to_id: creditcard.id,
            to_type: "creditcard",
            type: transactionsTypes.CHARGING_CREDITCART,
            amount: amount,
            // sections : fields.sections,//?
            // description : fields.description,//?
            // transaction_id : fields.transaction_id,
            // is_tax_payed : fields.is_tax_payed,
            is_confirmed: true,
        })
    }

    //for deleteing CreditCard 
    async residualCreditCardToAdminWallet(creditCard, adminWallet) {
        return this.create({
            id: uuidv4(),
            service_id: adminWallet.service_id,
            wallet_id: adminWallet.id,
            from_id: creditCard.id,
            from_type: "creditcard",
            to_id: adminWallet.id,
            to_type: "wallet",
            type: transactionsTypes.CREDITCARD_To_WALLET,
            amount: Number(creditCard.amount),
            is_confirmed: true,
        })
    }

    //sell by credit cart --start
    async creditcardToWallet(creditcard, fields) {
        return this.create({
            id: uuidv4(),
            service_id: creditcard.service_id,
            wallet_id: fields.wallet_id,
            from_id: creditcard.id,
            from_type: "creditcard",
            to_id: fields.wallet_id,
            to_type: "wallet",
            type: transactionsTypes.CREDITCARD_To_WALLET,
            amount: Number(fields.amount),
            // sections : fields.sections,//?
            description: fields.description,//?
            // transaction_id : fields.transaction_id,
            // is_tax_payed : fields.is_tax_payed,
            is_confirmed: true,
        })
    }

    async walletToPacket(credicardTransaction, creditcard, packet, fields) {
        return this.create({
            id: uuidv4(),
            service_id: creditcard.service_id,
            wallet_id: fields.wallet_id,
            from_id: fields.wallet_id,
            from_type: "wallet",
            to_id: packet.id,
            to_type: "packet",
            type: transactionsTypes.CREDITCARD_To_PACKET,
            amount: Number(fields.amount),
            sections: fields.sections,
            description: "creditcardId:" + creditcard.id + "\n" + fields.description,//?
            transaction_id: credicardTransaction.id,
            // is_tax_payed : fields.is_tax_payed,
            // is_confirmed: false,
            expire_at: fields.expire_at ? fields.expire_at : null,
            // is_pause: fields.is_pause, //false
        })
    }
    //sell by credit cart --end

    //Withdrawal --start
    async walletToWithdrawal(wallet, withdrawal) {
        return this.create({
            id: uuidv4(),
            service_id: wallet.service_id,
            wallet_id: wallet.id,
            from_id: wallet.id,
            from_type: "wallet",
            to_id: withdrawal.id,
            to_type: "withdrawal",
            type: transactionsTypes.WITHDRAWAL,
            amount: Number(withdrawal.amount),
            // sections : fields.sections,
            // description : fields.description,
            // transaction_id : fields.transaction_id,
            // is_tax_payed : fields.is_tax_payed,
            is_confirmed: true,
        })
    }
    //Withdrawal --end


    //send money from packet to wallet
    async packetToWallet(wallet, amount, parentTransactionId) {
        return this.create({
            id: uuidv4(),
            service_id: wallet.service_id,
            wallet_id: wallet.id,
            from_id: wallet.packet_id,
            from_type: "packet",
            to_id: wallet.id,
            to_type: "wallet",
            type: transactionsTypes.PACKET_TO_WALLET,
            amount: amount,
            transaction_id: parentTransactionId,
            is_tax_payed: false,
            is_confirmed: true,
        })
    }

    //back from wallet to creditcard
    async ReverseMoney_WalletToCreditcard(wallet, creditcard_id, amount, transaction_id) {
        return this.create({
            id: uuidv4(),
            service_id: wallet.service_id,
            wallet_id: wallet.id,
            from_id: wallet.id,
            from_type: "wallet",
            to_id: creditcard_id,
            to_type: "creditcard",
            type: transactionsTypes.WALLET_TO_CREDITCARD,
            amount: amount,
            // sections : fields.sections,//?
            // description : fields.description,//?
            transaction_id: transaction_id,
            // is_tax_payed : fields.is_tax_payed,
            is_confirmed: true,
        })
    }


    //send money from adminWallet to taxwallet
    async adminWalletToTaxWallet(adminwallet, wallet, parentTransactionId, fields) {
        return this.create({
            id: uuidv4(),
            service_id: adminwallet.service_id,
            wallet_id: adminwallet.id,
            from_id: adminwallet.id,
            from_type: "wallet",
            to_id: wallet.id,
            to_type: "wallet",
            type: transactionsTypes.PAING_TAX,
            amount: fields.amount,
            transaction_id: parentTransactionId,
            description: "tax " + fields.description,
            is_confirmed: true,
        })
    }


    async getTransaction(id) {
        return await this.getById(id, {
            include: [
                Transaction.childs,
                Transaction.parent,
                Transaction.wallet,
                Transaction.packet,
            ]
        })
    }

}

module.exports = new TransactionRepo()
