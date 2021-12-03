const BaseValidate = require("../core/baseValidate");

class WithdrawalValidate extends BaseValidate {
    constructor() {
        super()
    }

    create(fields) {
        this.checkValidation(fields, {
            service_id: {
                type: String,
                required: true,
                use: { test: this.useRegexUUID4 }
            },
            amount: {
                // type: String,
                required: true,
                // use: { test: this.useNumbers }
            }
        });
    }

    createBySuperAdmin(fields) {
        this.checkValidation(fields, {
            wallet_id: {
                type: String,
                required: true,
                use: { test: this.useRegexUUID4 }
            }
        });
    }

    getAll(fields) {
        this.checkValidation(fields, {
            filter: {
                id: {
                    type: String,
                    required: false,
                    use: { test: this.useRegexUUID4 }
                },
                wallet_id: {
                    type: String,
                    required: false,
                    use: { test: this.useRegexUUID4 }
                },
                amount: {
                    // type: String,
                    required: false,
                    // use: { test: this.useNumbers }
                },
                tracking_code: {
                    type: String,
                    required: false,
                },
                description: {
                    type: String,
                    required: false,
                },
                is_confirmed: {
                    type: String,
                    required: false,
                    enum: ["false", "true"]
                }
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
            withdrawalId: {
                type: String,
                required: true,
                use: { test: this.useRegexUUID4 }
            }
        })
    }

    update(fields) {
        this.checkValidation(fields, {
            tracking_code: {
                type: String,
                required: false,
            },
            description: {
                type: String,
                required: false,
            },
        })
    }
}


module.exports = new WithdrawalValidate()