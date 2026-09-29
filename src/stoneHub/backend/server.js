
const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const adminAuthRoutes = require("./routes/adminAuthRoutes");
const adminDashboardRoutes = require("./routes/adminDashboardRoutes");
const adminRoutes = require("./routes/adminRoutes");
const productRoutes = require("./routes/productRoutes");
const adminProductRoutes = require("./routes/adminProductRoutes");
const cartRoutes = require("./routes/cartRoutes");
const shippingRoutes = require("./routes/shippingRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const trackingRoutes = require("./routes/trackingRoutes");
const orderRoutes = require("./routes/orderRoutes");
const customerRoutes = require("./routes/customerRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const adminPaymentRoutes = require("./routes/adminpaymentRoutes");
const reportRoutes = require("./routes/reportRoutes");
const adminProfileRoutes = require("./routes/adminProfileRoutes");
const contactRoutes = require("./routes/contactRoutes");
const quoteRoutes = require("./routes/quoteRoutes");
const invoiceRoutes = require("./routes/invoiceRoutes");


const app = express();

app.use(cors());
app.use(express.json());



app.use(
    "/uploads",
    express.static(path.join(__dirname, "uploads"))
);

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminAuthRoutes);
app.use("/api/admin/dashboard", adminDashboardRoutes)
app.use("/api/admin", adminRoutes);
app.use("/api/products", productRoutes);
app.use("/api/admin/products", adminProductRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/shipping", shippingRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/tracking", trackingRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin/customers", customerRoutes);
app.use("/api/admin/reviews", reviewRoutes);
app.use("/api/admin/payments", adminPaymentRoutes);
app.use("/api/admin/reports", reportRoutes);
app.use("/api/admin", adminProfileRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/quotes", quoteRoutes);
app.use("/api/invoice", invoiceRoutes);

app.get("/", (req, res) => {
    res.json({
        message: "StoneHub Backend API running"
    });
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
