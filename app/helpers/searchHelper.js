const { Op } = require("sequelize")

module.exports.makeSearchableFilter = (fieldsArray, stringFields, reqFilters) => {
    const returnField = {}
    fieldsArray.forEach((field) => {
        if (reqFilters[field]) {
            if (stringFields.includes(field)) {
                returnField[field] = { [Op.like]: `%${reqFilters[field]}%` }
            } else {
                returnField[field] = reqFilters[field]
            }
        }
    })
    return returnField;
}