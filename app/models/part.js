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
        allowNull: true
    },
    packet_id: {
        type: Sequelize.UUID,
        allowNull: true
    },
    wallet_id: {
        type: Sequelize.UUID,
        allowNull: true
    },
    name: {
        type: Sequelize.TEXT,
        allowNull: true,
    },
    init_amount: {
        type: Sequelize.BIGINT,
        defaultValue: 0
    },
    amount: {
        type: Sequelize.BIGINT,
        defaultValue: 0
    },
}

module.exports = db.define("part", schema, {
    //createdAt: 'created_at',
    //updatedAt: 'updated_at',
    //deletedAt: 'deteled_at',
    paranoid: true,
    timestamps: true,
})