const express = require('express');
const router = express.Router();
const accessByToken = require("../middlewares/accessByToken");
const partController = require("../controllers/partController");

//create new item by system
router.post("/new", accessByToken.isSuperAdminOrAdmin, partController.create)

//get all items with filter and pagination 
//get all parts for superadmin (bytoken)
//get all parts with serviceId in admin (admin's user parts & admin's parts) (bytoken)
//get all parts with user_id for user (bytoken)
router.post("/", accessByToken.isLogin, partController.getAll)

//get one item by id 
router.get("/:partId", accessByToken.isLogin, partController.getById)

// spendFromPart
router.post("/:partId/spend", accessByToken.isSuperAdminOrAdmin, partController.spend)

//update one item by id
router.post("/:partId", accessByToken.isLogin, partController.update)





//remove part and return residual money to wallet
router.delete("/:partId", accessByToken.isSuperAdminOrAdmin, partController.delete)



module.exports = router