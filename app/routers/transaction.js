const express = require('express');
const router = express.Router();
const accessByToken = require("../middlewares/accessByToken");
const transactionController = require("../controllers/transactionsController");



//get all items with filter and pagination 
//get all transactions for superadmin (bytoken)
//get all transactions with serviceId in admin (admin's user transactions & admin transaction) (bytoken)
//get all transactions with user_id for user (bytoken)
router.post("/", accessByToken.isLogin, transactionController.getAll)

router.get("/status-types", accessByToken.isLogin, transactionController.getAllTypes)

router.post("/need-action", accessByToken.isSuperAdminOrAdmin, transactionController.getAll)
router.post("/holds", accessByToken.isSuperAdminOrAdmin, transactionController.getAll)
router.post("/accepted", accessByToken.isSuperAdminOrAdmin, transactionController.getAll)
router.post("/rejected", accessByToken.isSuperAdminOrAdmin, transactionController.getAll)
router.post("/unpaied-taxes", accessByToken.isSuperAdminOrAdmin, transactionController.getAll)

router.post("/:transactionId/hold", accessByToken.isSuperAdminOrAdmin, transactionController.setAction)
router.post("/:transactionId/accept", accessByToken.isSuperAdminOrAdmin, transactionController.setAction)
router.post("/:transactionId/reject", accessByToken.isSuperAdminOrAdmin, transactionController.setAction)
router.post("/:transactionId/tax", accessByToken.isSuperAdminOrAdmin, transactionController.setAction)


//get one item by id 
router.get("/:transactionId", accessByToken.isLogin, transactionController.getById)






module.exports = router