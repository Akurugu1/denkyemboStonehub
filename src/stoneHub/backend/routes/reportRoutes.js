const express = require("express");

const router = express.Router();

const reportController =
    require("../controllers/reportController");


router.get(
    "/summary",
    reportController.getReportSummary
);

router.get(
    "/customers",
    reportController.getCustomerOverview
);

router.get(
    "/orders/status",
    reportController.getOrderStatus
);

router.get(
    "/products/top",
    reportController.getTopProducts
);

router.get(
    "/sales",
    reportController.getSalesOverview
);

module.exports = router;