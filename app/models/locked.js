const Sequelize = require("sequelize")
const db = require("../database/db")
const schema = {
    id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true
    },
    userable_id: {
        type: Sequelize.UUID,
        allowNull: true
    },
    userable_type: {
        type: Sequelize.TEXT,
        allowNull: true,
    },
    wallet_id: {
        type: Sequelize.UUID,
        allowNull: true
    },
    service_id: {
        type: Sequelize.UUID,
        allowNull: true
    },
    description: {
        type: Sequelize.TEXT,
        allowNull: true,
    },
    amount: {
        type: Sequelize.BIGINT,
        defaultValue: 0
    },
}

module.exports = db.define("locked", schema, {
    //createdAt: 'created_at',
    //updatedAt: 'updated_at',
    //deletedAt: 'deteled_at',
    paranoid: true,
    timestamps: true,
})