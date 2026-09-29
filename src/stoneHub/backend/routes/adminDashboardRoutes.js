const express = require("express");
const router = express.Router();

const dashboardController = require("../controllers/dashboardController");

router.get("/stats", dashboardController.getDashboardStats);
router.get("/sales", dashboardController.getSalesData);
router.get("/recent-orders", dashboardController.getRecentOrders);
router.get("/recent-customers", dashboardController.getRecentCustomers);
router.get("/low-stock", dashboardController.getLowStockProducts);

module.exports = router;