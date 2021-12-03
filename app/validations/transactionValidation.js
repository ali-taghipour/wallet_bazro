const BaseValidate = require("../core/baseValidate");
const validationException = require("../core/exceptions/validationException");

class TransactionValidate extends BaseValidate {
    constructor() {
        super()
    }

    getAll(fields) {
        this.checkValidation(fields, {
            filter: {
                id: {
                    type: String,
                    required: false,
                    use: { test: this.useRegexUUID4 }
                },
                from_id: {
                    type: String,
                    required: false,
                    use: { test: this.useRegexUUID4 }
                },
                from_type: {
                    type: String,
                    required: false,
                },
                to_id: {
                    type: String,
                    required: false,
                    use: { test: this.useRegexUUID4 }
                },
                to_type: {
                    type: String,
                    required: false,
                },
                type: {
                    type: String,
                    required: false,
                },
                amount: {
                    // type: String,
                    required: false,
                    // use: { test: this.useNumbers }
                },
                // sections: {
                //     type: Array,
                //     required: false,
                // },
                service_id: {
                    type: String,
                    required: false,
                    use: { test: this.useRegexUUID4 }
                },
                wallet_id: {
                    type: String,
                    required: false,
                    use: { test: this.useRegexUUID4 }
                },
                transaction_id: {
                    type: String,
                    required: false,
                    use: { test: this.useRegexUUID4 }
                },
                is_tax_payed: {
                    type: String,
                    required: false,
                    enum: ["false", "true"]
                },
                description: {
                    type: String,
                    required: false,
                },
                expire_at: {
                    type: String,
                    required: false,
                },
                is_pause: {
                    type: String,
                    required: false,
                    enum: ["false", "true"]
                },
                is_confirmed: {
                    type: String,
                    required: false,
                    enum: ["false", "true"]
                },
            },
            sort_by: {
                type: String,
            },
            sort_type: {
                type: String,
                required: false,
                enum: [1, -1],
            },
            per_page: {
                type: String,
            },
            page: {
                type: String,
            },
            from_date: {
                type: String,
                required: false,
            },
            to_date: {
                type: String,
                required: false,
            },
        })
    }

    params(fields) {
        this.checkValidation(fields, {
            transactionId: {
                type: String,
                required: true,
                use: { test: this.useRegexUUID4 }
            }
        })
    }

    setAction_Accept(fields) {
        if (!fields.commission_status)
            throw new validationException("validation error", { "commission_status": this.messages.required() })
        if (Object.keys(fields.commission_status) > 0)
            for (const [key, value] of Object.entries(fields.commission_status)) {
                if (!this.useRegexUUID4(key))
                    throw new validationException("validation error", { "wallet_id": this.messages.test() })
            }
    }
    setAction_PaidTheTax(fields) {
        this.checkValidation(fields, {
            wallet_id: {
                type: String,
                required: true,
                use: { test: this.useRegexUUID4 }
            },
            amount: {
                // type: String,
                required: true,
                // use: { test: this.useNumbers }
            }
        })
    }
}


module.exports = new TransactionValidate()