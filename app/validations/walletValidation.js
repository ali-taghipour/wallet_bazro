const BaseValidate = require("../core/baseValidate");

class WalletValidate extends BaseValidate {
    constructor() {
        super()
    }

    create(fields) {
        this.checkValidation(fields, {
            id: {
                type: String,
                required: true,
                use: { test: this.useRegexUUID4 }
            },
            user_id: {
                type: String,
                required: true,
                use: { test: this.useRegexUUID4 }
            },
            user_type: {
                type: String,
                required: true,
                enum: ["user", "admin"]
            },
            service_id: {
                type: String,
                required: true,
                use: { test: this.useRegexUUID4 }
            },
            role_id: {
                type: String,
                required: false,
                use: { test: this.useRegexUUID4 }
            },
            name: {
                type: String,
                required: true,
            },
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
                packet_id: {
                    type: String,
                    required: false,
                    use: { test: this.useRegexUUID4 }
                },
                role_id: {
                    type: String,
                    required: false,
                    use: { test: this.useRegexUUID4 }
                },
                name: {
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
            walletId: {
                type: String,
                required: true,
                use: { test: this.useRegexUUID4 }
            }
        })
    }

    update(fields) {
        this.checkValidation(fields, {
            name: {
                type: String,
                required: true,
            },
        })
    }
    charge(fields) {
        this.checkValidation(fields, {
            amount: {
                // type: String,
                required: true,
                // use: { test: this.useNumbers }
            },
        })
    }
}


module.exports = new WalletValidate()