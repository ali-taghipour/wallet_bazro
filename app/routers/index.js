module.exports = (app) => {
    //backFromBank in payment
    app.get('/payment/payir/verify', require("../controllers/paymentController").paymentVerifyByGateway)

    app.use(require("../middlewares/checkingBasicAuthentication"))
    app.use('/packet', require("./packet"))
    app.use('/wallet', require("./wallet"))
    app.use('/part', require("./part"))
    app.use('/locked', require("./locked"))
    app.use('/payment', require("./payment"))
    app.use('/withdrawal', require("./withdrawal"))
    app.use('/creditcard', require("./creditcard"))
    app.use('/transaction', require("./transaction"))
    app.use((req, res, next) => {
        res.status(404).send("oops ! 404")
    })
}