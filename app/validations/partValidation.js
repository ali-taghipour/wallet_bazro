const BaseValidate = require("../core/baseValidate");

class PartValidate extends BaseValidate {
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
            wallet_id: {
                type: String,
                required: true,
                use: { test: this.useRegexUUID4 }
            },
            name: {
                type: String,
                required: true,
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
                packet_id: {
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
                name: {
                    type: String,
                    required: false,
                },
                init_amount: {
                    // type: String,
                    required: false,
                    // use: { test: this.useNumbers }
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
            partId: {
                type: String,
                required: true,
                use: { test: this.useRegexUUID4 }
            }
        })
    }
    spend(fields) {
        this.checkValidation(fields, {
            amount: {
                // type: String,
                required: true,
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
    spendForSuperAdmin(fields) {
        this.checkValidation(fields, {
            service_id: {
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
}


module.exports = new PartValidate()