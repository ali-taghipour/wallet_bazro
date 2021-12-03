const express = require('express');
const router = express.Router();
const accessByToken = require("../middlewares/accessByToken");
const walletController = require("../controllers/walletController");

//create new item by system
router.post("/new", accessByToken.isSuperAdmin, walletController.create)

//get all items with filter and pagination 
//get all wallets for superadmin (bytoken)
//get all wallets with serviceId in admin (admin's user Wallets & admin Wallet) (bytoken)
//get all wallets with user_id for user (bytoken)
router.post("/", accessByToken.isLogin, walletController.getAll)

//charge wallet without GateWay 
router.post("/:walletId/charge", accessByToken.isSuperAdminOrAdmin, walletController.charge)

//get one item by id 
router.get("/:walletId", accessByToken.isLogin, walletController.getById)

//update one item by id
router.post("/:walletId", accessByToken.isLogin, walletController.update)




module.exports = router