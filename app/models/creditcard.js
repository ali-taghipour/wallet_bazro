const Sequelize = require("sequelize")
const db = require("../database/db")
const schema = {
    id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true
    },
    type: {
        type: Sequelize.TEXT,
        defaultValue: "creditcard",//"giftcard"
    },
    password: {
        type: Sequelize.TEXT,
        allowNull: true
    },
    service_id: {
        type: Sequelize.UUID,
        allowNull: true
    },
    wallets: {
        type: Sequelize.ARRAY(Sequelize.UUID),
        allowNull: true
    },
    amount: {
        type: Sequelize.BIGINT,
        defaultValue: 0
    },
    expire_at: {
        type: Sequelize.DATE,
        allowNull: true,
    },
}

module.exports = db.define("creditcard", schema, {
    //createdAt: 'created_at',
    //updatedAt: 'updated_at',
    //deletedAt: 'deteled_at',
    paranoid: true,
    timestamps: true,
})