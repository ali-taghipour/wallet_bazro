const Payir = require('payir');
const paymentStatusTypes = require('../constants/paymentStatusTypes');
const HasDataException = require('../core/exceptions/hasDataException');
const walletRepo = require('../repositories/walletRepo');
const transactionRepo = require('../repositories/transactionRepo');
const gateway = new Payir(process.env.PAYIR_API_KEY || "test");
const verifyAddress = "/payment/payir/verify"



module.exports.getTokenFromPaymentGataway = async (req, payment) => {
    //sending information to payment gateway and getting redirectingUrl with token
    const paymentLink = await gateway.send(Number(payment.amount), "http://" + req.headers.host + verifyAddress, payment.id)
    //extracting token from redirecting url and save it in paymentModel
    const token = paymentLink.substring(paymentLink.lastIndexOf("/") + 1)
    payment.token = token
    payment.status = paymentStatusTypes.sendToBank
    await payment.save()
    return { paymentLink, token, payment }
}

module.exports.verifyPayment = async (token, payment) => {
    //sending returning token to payment gateway for verifing the transaction
    const data = await gateway.verify({ transId: token })
    if (!data)
        throw new HasDataException(`verify Failed`, data)

    payment.tracking_code = data.transactionId
    payment.description = `شماره کارت : ${data.cardNumber}`
    const wallet = await walletRepo.getById(payment.wallet_id)

    //make transaction from payment to wallet
    const transaction = await transactionRepo.paymentToWallet(payment)
    //update wallet amount
    await walletRepo.updateAmount(wallet.id, Number(wallet.amount) + Number(payment.amount))
    return transaction
}

module.exports.getGatewayErrorByString = (errorCode) => {
    const errorList = {
        '0': 'درحال حاضر درگاه بانکی قطع شده و مشکل بزودی برطرف می شود',
        '-1': 'API Key ارسال نمی شود',
        '-2': 'Token ارسال نمی شود',
        '-3': 'API Key ارسال شده اشتباه است',
        '-4': 'امکان انجام تراکنش برای این پذیرنده وجود ندارد',
        '-5': 'تراکنش با خطا مواجه شده است',
        '-6': 'تراکنش تکراریست یا قبلا انجام شده',
        '-7': 'مقدار Token ارسالی اشتباه است',
        '-8': 'شماره تراکنش ارسالی اشتباه است',
        '-9': 'زمان مجاز برای انجام تراکنش تمام شده',
        '-10': 'مبلغ تراکنش ارسال نمی شود',
        '-11': 'مبلغ تراکنش باید به صورت عددی و با کاراکترهای لاتین باشد',
        '-12': 'مبلغ تراکنش می بایست عددی بین 10,000 و 500,000,000 ریال باشد',
        '-13': 'مقدار آدرس بازگشتی ارسال نمی شود',
        '-14': 'آدرس بازگشتی ارسالی با آدرس درگاه ثبت شده در شبکه پرداخت پی یکسان نیست',
        '-15': 'امکان وریفای وجود ندارد. این تراکنش پرداخت نشده است',
        '-16': 'یک یا چند شماره موبایل از اطلاعات پذیرندگان ارسال شده اشتباه است',
        '-17': 'میزان سهم ارسالی باید بصورت عددی و بین 1 تا 100 باشد',
        '-18': 'فرمت پذیرندگان صحیح نمی باشد',
        '-19': 'هر پذیرنده فقط یک سهم میتواند داشته باشد',
        '-20': 'مجموع سهم پذیرنده ها باید 100 درصد باشد',
        '-21': 'Reseller ID ارسالی اشتباه است',
        '-22': 'فرمت یا طول مقادیر ارسالی به درگاه اشتباه است',
        '-23': 'سوییچ PSP ( درگاه بانک ) قادر به پردازش درخواست نیست. لطفا لحظاتی بعد مجددا تلاش کنید',
        '-24': 'شماره کارت باید بصورت 16 رقمی، لاتین و چسبیده بهم باشد',
        '-25': 'امکان استفاده از سرویس در کشور مبدا شما وجود نداره',
        '-26': 'امکان انجام تراکنش برای این درگاه وجود ندارد',
    }

    return errorList[errorCode]
}