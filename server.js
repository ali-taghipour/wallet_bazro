require('dotenv').config()
const log = require('./app/helpers/logHelper');
const cron = require('node-cron');
const { removeAllExpiredCreditGiftCard } = require('./app/services/creditcardService');

cron.schedule('0 */1 * * *', async () => { //every hour
  log.info('------ per 1 hour -------');
  await removeAllExpiredCreditGiftCard()
})

const port = process.env.PORT || 3009
require("./app").listen(port, () => {
  log.info(`Server running on port: ${port}`)
})
