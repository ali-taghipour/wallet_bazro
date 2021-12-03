const BaseValidate = require("../core/baseValidate");
const ValidationException = require("../core/exceptions/validationException");

class CreditcardValidate extends BaseValidate {
    constructor() {
        super()
    }

    createCreditcard(fields) {
        this.checkValidation(fields, {
            amount: {
                // type: String,
                required: true,
                // use: { test: this.useNumbers }
            },
            expire_at: {
                type: String,
                required: false,
            }
        });
    }
    createGiftcard(fields) {
        this.checkValidation(fields, {
            amount: {
                // type: String,
                required: true,
                // use: { test: this.useNumbers }
            },
            expire_at: {
                type: String,
                required: false,
            }
        });
    }

    spendFromCreditCard(fields) {
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
        });
    }

    spendFromGiftCard(fields) {
        this.checkValidation(fields, {
            wallet_id: {
                type: String,
                required: true,
                use: { test: this.useRegexUUID4 }
            },
            password: {
                // type: String,
                required: true,
                // use: { test: this.useNumbers },
                length: 3,
            },
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
        });
    }

    walletIds(fields) {
        if (!fields.wallet_ids)
            throw new ValidationException("validation error", { "wallet_ids": this.messages.required() })
        if (Array.isArray(fields.wallet_ids) && fields.wallet_ids.length == 0)
            throw new ValidationException("validation error", { "wallet_ids": "wallet_ids need to at least one id" })
        for (let i = 0; i < fields.wallet_ids.length; i++) {
            const wallet_id = fields.wallet_ids[i]
            if (wallet_id) {
                if (!this.useRegexUUID4(wallet_id))
                    throw new ValidationException("validation error", { "wallet_ids": this.messages.test() })
            }
        }
    }

    createBySuperAdmin(fields) {
        this.checkValidation(fields, {
            service_id: {
                type: String,
                required: true,
                use: { test: this.useRegexUUID4 }
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
                type: {
                    type: String,
                    required: false,
                    enum: ["creditcard", "giftcard"]
                },
                password: {
                    type: String,
                    required: false,
                },
                service_id: {
                    type: String,
                    required: false,
                    use: { test: this.useRegexUUID4 }
                },
                // wallets: {
                //     type: String,
                //     required: false,
                //     use: { test: this.useRegexUUID4 }
                // },
                // amount: {
                //     type: String,
                //     required: false,
                //     use: { test: this.useNumbers }
                // },
                expire_at: {
                    type: String,
                    required: false,
                    use: { test: this.useRegexUUID4 }
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
            creditcardId: {
                type: String,
                required: true,
                use: { test: this.useRegexUUID4 }
            }
        })
    }

    update(fields) {
        this.checkValidation(fields, {
            password: {
                type: String,
                required: true,
            },
        })
    }
}


module.exports = new CreditcardValidate()