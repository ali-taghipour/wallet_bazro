const Sequelize = require("sequelize")
const db = require("../database/db")
const schema = {
    userable_id: {
        type: Sequelize.UUID,
        allowNull: true
    },
    userable_type: {
        type: Sequelize.TEXT,
        allowNull: true
    },
    service_id: {
        type: Sequelize.UUID,
        allowNull: true
    },
    wallet_id: {
        type: Sequelize.UUID,
        allowNull: true
    },
    moduleName: {
        type: Sequelize.TEXT,
        defaultValue: "pay.ir",
    },
    amount: {
        type: Sequelize.BIGINT,
        defaultValue: 0
    },
    token: {
        type: Sequelize.TEXT,
        allowNull: true,
    },
    status: {
        type: Sequelize.TEXT,
        allowNull: true,
    },
    tracking_code: {
        type: Sequelize.TEXT,
        allowNull: true,
    },
    description: {
        type: Sequelize.TEXT,
        allowNull: true,
    }
}

module.exports = db.define("payment", schema, {
    //createdAt: 'created_at',
    //updatedAt: 'updated_at',
    //deletedAt: 'deteled_at',
    paranoid: true,
    timestamps: true,
})