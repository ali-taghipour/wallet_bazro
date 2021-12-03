const express = require('express');
const router = express.Router();
const accessByToken = require("../middlewares/accessByToken");
const packetController = require("../controllers/packetController");

//create new item by system
router.post("/new", accessByToken.isSuperAdmin, packetController.create)

//get all items with filter and pagination
router.post("/", accessByToken.isSuperAdminOrAdmin, packetController.getAll)

//get one item by id
router.get("/:packetId", accessByToken.isSuperAdminOrAdmin, packetController.getById)

//update one item by id
router.post("/:packetId", accessByToken.isSuperAdminOrAdmin, packetController.update)




module.exports = router