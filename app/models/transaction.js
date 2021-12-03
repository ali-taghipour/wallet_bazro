const Sequelize = require("sequelize")
const db = require("../database/db")
const schema = {
    id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true
    },
    from_id: {
        type: Sequelize.UUID,
        allowNull: true
    },
    from_type: {
        type: Sequelize.TEXT,
        allowNull: true,
    },
    to_id: {
        type: Sequelize.UUID,
        allowNull: true
    },
    to_type: {
        type: Sequelize.TEXT,
        allowNull: true,
    },
    type: {
        type: Sequelize.TEXT,
        allowNull: true,
    },
    amount: {
        type: Sequelize.BIGINT,
        defaultValue: 0
    },
    sections: {
        type: Sequelize.ARRAY(Sequelize.JSON),
        allowNull: true,
    },
    service_id: {
        type: Sequelize.UUID,
        allowNull: true
    },
    wallet_id: {
        type: Sequelize.UUID,
        allowNull: true
    },
    transaction_id: {
        type: Sequelize.UUID,
        allowNull: true,
    },
    is_tax_payed: {
        type: Sequelize.BOOLEAN,
        // defaultValue: false
        allowNull: true
    },
    description: {
        type: Sequelize.TEXT,
        allowNull: true,
    },
    expire_at: {
        type: Sequelize.DATE,
        allowNull: true,
    },
    is_pause: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
    },
    is_confirmed: {
        type: Sequelize.BOOLEAN,
        // defaultValue: true
        allowNull: true
    },
}

module.exports = db.define("transaction", schema, {
    //createdAt: 'created_at',
    //updatedAt: 'updated_at',
    //deletedAt: 'deteled_at',
    paranoid: true,
    timestamps: true,
})