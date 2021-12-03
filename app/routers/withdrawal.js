const express = require('express');
const router = express.Router();
const accessByToken = require("../middlewares/accessByToken");
const withdrawalController = require("../controllers/withdrawalController");

//create new item by system
router.post("/new", accessByToken.isLogin, withdrawalController.create)

//get all items with filter and pagination 
//get all withdrawals for superadmin (bytoken)
//get all withdrawals with serviceId in admin (admin's user withdrawals & admin's withdrawal) (bytoken)
//get all withdrawals with user_id for user (bytoken)
router.post("/", accessByToken.isLogin, withdrawalController.getAll)

//accept withdraw request
router.post("/:withdrawalId/accept", accessByToken.isSuperAdminOrAdmin, withdrawalController.accept)
//reject withdraw request
router.post("/:withdrawalId/reject", accessByToken.isSuperAdminOrAdmin, withdrawalController.reject)

//get one item by id 
router.get("/:withdrawalId", accessByToken.isLogin, withdrawalController.getById)

//update one item by id
router.post("/:withdrawalId", accessByToken.isLogin, withdrawalController.update)




module.exports = router