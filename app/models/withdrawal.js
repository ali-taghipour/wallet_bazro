const Sequelize = require("sequelize")
const db = require("../database/db")
const schema = {
    id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true
    },
    wallet_id: {
        type: Sequelize.UUID,
        allowNull: true
    },
    amount: {
        type: Sequelize.BIGINT,
        defaultValue: 0
    },
    is_confirmed: { // null => new, accepted => true, rejected =>false
        type: Sequelize.BOOLEAN,
        allowNull: true,
    },
    tracking_code: {
        type: Sequelize.TEXT,
        allowNull: true,
    },
    description: {
        type: Sequelize.TEXT,
        allowNull: true,
    },
}

module.exports = db.define("withdrawal", schema, {
    //createdAt: 'created_at',
    //updatedAt: 'updated_at',
    //deletedAt: 'deteled_at',
    paranoid: true,
    timestamps: true,
})