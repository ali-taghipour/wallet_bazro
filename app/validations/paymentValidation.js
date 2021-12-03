const BaseValidate = require("../core/baseValidate");

class PaymentValidate extends BaseValidate {
    constructor() {
        super()
    }

    create(fields) {
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
        });
    }

    getAll(fields) {
        this.checkValidation(fields, {
            filter: {
                id: {
                    type: String,
                    required: false,
                },
                userable_id: {
                    type: String,
                    required: false,
                    use: { test: this.useRegexUUID4 }
                },
                userable_type: {
                    type: String,
                    required: false,
                    enum: ["user", "admin"]
                },
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
                moduleName: {
                    type: String,
                    required: false,
                },
                amount: {
                    // type: String,
                    required: false,
                    // use: { test: this.useNumbers() }
                },
                token: {
                    type: String,
                    required: false,
                },
                status: {
                    type: String,
                    required: false,
                },
                tracking_code: {
                    type: String,
                    required: false,
                },
                description: {
                    type: String,
                    required: false,
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
            paymentId: {
                type: String,
                required: true,
            }
        })
    }

    update(fields) {
        this.checkValidation(fields, {
            // name: {
            //     type: String,
            //     required: true,
            // },
        })
    }
}


module.exports = new PaymentValidate()