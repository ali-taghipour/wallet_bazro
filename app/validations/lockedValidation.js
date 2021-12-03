const BaseValidate = require("../core/baseValidate");

class LockedValidate extends BaseValidate {
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
            description: {
                type: String,
                required: false,
            },
            amount: {
                // type: String,
                required: true,
                // use: { test: this.useNumbers }
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
                userable_id: {
                    type: String,
                    required: false,
                    use: { test: this.useRegexUUID4 }
                },
                userable_type: {
                    type: String,
                    required: false,
                },
                description: {
                    type: String,
                    required: false,
                },
                amount: {
                    // type: String,
                    required: false,
                    // use: { test: this.useNumbers }
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
            lockedId: {
                type: String,
                required: true,
                use: { test: this.useRegexUUID4 }
            }
        })
    }

    update(fields) {
        this.checkValidation(fields, {
            description: {
                type: String,
                required: false,
            },
            amount: {
                // type: String,
                required: false,
                // use: { test: this.useNumbers }
            },
        })
    }

    unlocked(fields) {
        this.checkValidation(fields, {
            amount: {
                // type: String,
                required: false,
                // use: { test: this.useNumbers }
            },
            sections: {
                required: false,
                type: Array,
                each: {
                    type: Object,
                    wallet_id: {
                        type: String,
                        required: true,
                        use: { test: this.useRegexUUID4 }
                    },
                    percent: {
                        type: Number,
                        required: true,
                        size: { min: 1, max: 100 }
                    },
                }
            },
            description: {
                type: String,
                required: false,
            },
            expire_at: {
                type: String,
                required: false,
            }
        })
    }
}


module.exports = new LockedValidate()