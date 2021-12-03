const express = require('express');
const router = express.Router();
const accessByToken = require("../middlewares/accessByToken");
const creditcardController = require("../controllers/creditcardController");

//create new item by system
router.post("/new", accessByToken.isSuperAdminOrAdmin, creditcardController.createCreditCard)
router.post("/giftcard/new", accessByToken.isSuperAdminOrAdmin, creditcardController.createGiftcard)

//get all items with filter and pagination 
//get all creditcards for superadmin (bytoken)
//get all creditcards with serviceId in admin (admin's user creditcards & admin creditcard) (bytoken)
//get all creditcards with user_id for user (bytoken)
router.post("/", accessByToken.isLogin, creditcardController.getAll)


router.post("/:creditcardId/spend", accessByToken.isSuperAdminOrAdmin, creditcardController.spendFromCreditCard)
router.post("/giftcard/:creditcardId/spend", accessByToken.isSuperAdminOrAdmin, creditcardController.spendFromGiftCard)


//get one item by id
router.get("/:creditcardId", accessByToken.isLogin, creditcardController.getById)

router.delete("/:creditcardId", accessByToken.isSuperAdminOrAdmin, creditcardController.delete)

module.exports = router