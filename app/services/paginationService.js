const { makeSearchableFilter } = require('../helpers/searchHelper');
const { Op } = require("sequelize")
const moment = require('moment');

module.exports.pagination = (req) => {
    const orderBy = req.body.sort_by ? req.body.sort_by : "createdAt";
    const orderType = req.body.sort_type && req.body.sort_type == 1 ? "ASC" : "DESC";
    const limit = req.body.per_page ? req.body.per_page : 10;
    const offset = req.body.page ? (req.body.page > 0 ? req.body.page - 1 : 0) * limit : 0;

    let fromDate = moment('2000-01-01T10:00:00').toDate()
    if (req.body.from_date)
        fromDate = moment(req.body.from_date).toDate()

    let toDate = moment().toDate()
    if (req.body.from_date)
        toDate = moment(req.body.to_date).toDate()

    const dateFilter = {
        createdAt: {
            [Op.gte]: fromDate,
            [Op.lte]: toDate
        }
    }

    return {
        orderBy,
        orderType,
        limit,
        offset,
        dateFilter,
    }
}

const capitalize = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

const getModelFileds = (modelName) => {
    let allModelsFields = []; //all fields
    let stringsFields = []; //strings

    switch (capitalize(modelName)) {
        case "Packet":
            allModelsFields = [
                "id",
                "service_id",
                "name",
                "min_deposit",
                "max_deposit",
                "min_withdrawal",
                "max_withdrawal",
                "max_capacity"
            ];
            stringsFields = [
                "name"
            ];
            break;
        case "Wallet":
            allModelsFields = [
                "id",
                "userable_id",
                "userable_type",
                "service_id",
                "role_id",
                "packet_id",
                "name",
                "amount",
            ];
            stringsFields = [
                "name"
            ];
            break;
        case "Part":
            allModelsFields = [
                "id",
                "service_id",
                "packet_id",
                "wallet_id",
                "name",
                "init_amount",
                "amount"
            ];
            stringsFields = [
                "name"
            ];
            break;
        case "Locked":
            allModelsFields = [
                "id",
                "userable_id",
                "userable_type",
                "wallet_id",
                "service_id",
                "description",
                "amount"
            ];
            stringsFields = [
                "description"
            ];
            break;
        case "Creditcard":
            allModelsFields = [
                "id",
                "type",
                "password",
                "service_id",
                "wallets",
                "amount",
                "expire_at"
            ];
            stringsFields = [];
            break;
        case "Transaction":
            allModelsFields = [
                "id",
                "from_id",
                "from_type",
                "to_id",
                "to_type",
                "type",
                "amount",
                "sections",
                "service_id",
                "wallet_id",
                "description",
                "transaction_id",
                "is_tax_payed",
                "is_confirmed",
                "expire_at",
                "is_pause"
            ];
            stringsFields = [
                "description"
            ];
            break;

        case "Withdrawal":
            allModelsFields = [
                "id",
                "wallet_id",
                "amount",
                "is_confirmed",
                "tracking_code",
                "description",
            ];
            stringsFields = [
                "tracking_code",
                "description"
            ];
            break;
        case "Payment":
            allModelsFields = [
                "id",
                "userable_id",
                "userable_type",
                "service_id",
                "wallet_id",
                "moduleName",
                "amount",
                "token",
                "status",
                "tracking_code",
                "description",
            ];
            stringsFields = [
                "token",
                "tracking_code",
                "description"
            ];
            break;

        default:
            break;
    }

    return {
        allModelsFields,
        stringsFields
    }
}

module.exports.searchFilter = (req, modelName) => {
    let filter = {}
    let reqFilter = {}
    if (req.body.filter) {
        if (typeof req.body.filter === 'object')
            reqFilter = req.body.filter
    } else if (typeof req.body.filter === 'string') {
        reqFilter = JSON.parse(req.body.filter)
    }
    const { allModelsFields, stringsFields } = getModelFileds(modelName)
    filter = makeSearchableFilter(allModelsFields, stringsFields, reqFilter)
    return {
        filter,
        reqFilter
    }
}