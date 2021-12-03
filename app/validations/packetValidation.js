const BaseValidate = require("../core/baseValidate");

class PacketValidate extends BaseValidate {
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
            service_id: {
                type: String,
                required: true,
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
                service_id: {
                    type: String,
                    required: false,
                    use: { test: this.useRegexUUID4 }
                },
                name: {
                    type: String,
                    required: false,
                },
                min_deposit: {
                    // type: String,
                    required: false,
                    // use: { test: this.useNumbers }
                },
                max_deposit: {
                    // type: String,
                    required: false,
                    // use: { test: this.useNumbers }
                },
                min_withdrawal: {
                    // type: String,
                    required: false,
                    // use: { test: this.useNumbers }
                },
                max_withdrawal: {
                    // type: String,
                    required: false,
                    // use: { test: this.useNumbers }
                },
                max_capacity: {
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
            packetId: {
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
            min_deposit: {
                // type: String,
                required: true,
                // use: { test: this.useNumbers }
            },
            max_deposit: {
                // type: String,
                required: true,
                // use: { test: this.useNumbers }
            },
            min_withdrawal: {
                // type: String,
                required: true,
                // use: { test: this.useNumbers }
            },
            max_withdrawal: {
                // type: String,
                required: true,
                // use: { test: this.useNumbers }
            },
            max_capacity: {
                // type: String,
                required: true,
                // use: { test: this.useNumbers }
            },
        })
    }
}


module.exports = new PacketValidate()