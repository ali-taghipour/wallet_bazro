const express = require('express');
const router = express.Router();
const accessByToken = require("../middlewares/accessByToken");
const lockedController = require("../controllers/lockedController");

//create new item by system
router.post("/new", accessByToken.isSuperAdminOrAdmin, lockedController.create)

//get all items with filter and pagination 
//get all lockeds for superadmin (bytoken)
//get all lockeds with serviceId in admin (admin's user lockeds & admin locked) (bytoken)
//get all lockeds with user_id for user (bytoken)
router.post("/", accessByToken.isLogin, lockedController.getAll)

//unlocked with/without deducting money from wallet
router.post("/:lockedId/unlocked", accessByToken.isSuperAdminOrAdmin, lockedController.unlocked)
//deducting money from wallet without unlocked
router.post("/:lockedId/deduct-money", accessByToken.isSuperAdminOrAdmin, lockedController.deductMoneyWithoutUnlocked)

//get one item by id 
router.get("/:lockedId", accessByToken.isLogin, lockedController.getById)

//update one item by id
router.post("/:lockedId", accessByToken.isLogin, lockedController.update)






module.exports = router