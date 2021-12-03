const express = require('express');
const router = express.Router();
const accessByToken = require("../middlewares/accessByToken");
const paymentController = require("../controllers/paymentController");

//create new item by system
router.post("/new", accessByToken.isLogin, paymentController.create)

//get all items with filter and pagination 
//get all payments for superadmin (bytoken)
//get all payments with serviceId in admin (admin's user payments & admin payment) (bytoken)
//get all payments with user_id for user (bytoken)
router.post("/", accessByToken.isLogin, paymentController.getAll)


//all payment statuses
router.get("/status-types", accessByToken.isLogin, paymentController.getAllStatusTypes)

//get one item by id 
router.get("/:paymentId", accessByToken.isLogin, paymentController.getById)







module.exports = router