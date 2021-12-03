const Sequelize = require("sequelize")
const db = require("../database/db")
const schema = {
    id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true
    },
    service_id: {
        type: Sequelize.UUID,
        allowNull: true,
    },
    name: {
        type: Sequelize.TEXT,
        allowNull: true,
    },
    admin_wallet_id: {
        type: Sequelize.UUID,
        allowNull: true,
    },
    min_deposit: {
        type: Sequelize.BIGINT,
        defaultValue: 0,
    },
    max_deposit: {
        type: Sequelize.BIGINT,
        defaultValue: 0,
    },
    min_withdrawal: {
        type: Sequelize.BIGINT,
        defaultValue: 0,
    },
    max_withdrawal: {
        type: Sequelize.BIGINT,
        defaultValue: 0,
    },
    max_capacity: {
        type: Sequelize.BIGINT,
        defaultValue: 0,
    }
}

module.exports = db.define("packet", schema, {
    //createdAt: 'created_at',
    //updatedAt: 'updated_at',
    //deletedAt: 'deteled_at',
    paranoid: true,
    timestamps: true,
})