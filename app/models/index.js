const transactionsTypes = require('../constants/transactionsTypes');

const Packet = require('./packet');
const Wallet = require('./wallet');
const Part = require('./part');
const Locked = require('./locked');
const Transaction = require('./transaction');
const Creditcard = require('./creditcard');
const Payment = require('./payment');
const Withdrawal = require('./withdrawal');
const wallet = require('./wallet');



Packet.wallets = Packet.hasMany(Wallet, { as: "wallets", sourceKey: "id", foreignKey: "packet_id", constraints: false })

Wallet.packet = Wallet.belongsTo(Packet, { as: "packet", targetKey: "id", foreignKey: "packet_id", constraints: false })
Wallet.parts = Wallet.hasMany(Part, { as: "parts", sourceKey: "id", foreignKey: "wallet_id", constraints: false })
Wallet.lockeds = Wallet.hasMany(Locked, { as: "lockeds", sourceKey: "id", foreignKey: "wallet_id", constraints: false })
Wallet.deposites = Wallet.hasMany(Transaction, { as: "deposites", sourceKey: "id", foreignKey: "to_id", scope: { to_type: transactionsTypes.DEPOSIT }, constraints: false })
Wallet.withdrawals = Wallet.hasMany(Withdrawal, { as: "withdrawals", sourceKey: "id", foreignKey: "to_id", scope: { to_type: transactionsTypes.WITHDRAWAL }, constraints: false })

Part.wallet = Part.belongsTo(Wallet, { as: "wallet", targetKey: "id", foreignKey: "wallet_id", constraints: false })

Locked.wallet = Locked.belongsTo(Wallet, { as: "wallet", targetKey: "id", foreignKey: "wallet_id", constraints: false })
Locked.packet = Locked.belongsTo(Packet, { as: "packet", targetKey: "service_id", foreignKey: "service_id", constraints: false })

Transaction.childs = Transaction.hasMany(Transaction, { as: "childs", sourceKey: "id", foreignKey: "transaction_id", constraints: false })
Transaction.parent = Transaction.belongsTo(Transaction, { as: "parent", targetKey: "id", foreignKey: "transaction_id", constraints: false })
Transaction.packet = Transaction.belongsTo(Packet, { as: "packet", targetKey: "service_id", foreignKey: "service_id", constraints: false })
Transaction.wallet = Transaction.belongsTo(Wallet, { as: "wallet", targetKey: "id", foreignKey: "wallet_id", constraints: false })


Withdrawal.wallet = Withdrawal.belongsTo(wallet, { as: "wallet", targetKey: "id", foreignKey: "wallet_id", constraints: false })


Creditcard.packet = Creditcard.belongsTo(Packet, { as: "packet", targetKey: "service_id", foreignKey: "service_id", constraints: false })

module.exports = {
    Packet,
    Wallet,
    Part,
    Locked,
    Transaction,
    Creditcard,
    Payment,
    Withdrawal,
}