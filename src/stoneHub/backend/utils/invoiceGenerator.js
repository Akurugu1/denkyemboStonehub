const PDFDocument = require("pdfkit");
const fs = require("fs");


const generateInvoicePDF = (invoiceData) => {

    return new Promise((resolve, reject) => {

        const fileName =
            `invoice_${invoiceData.orderId}.pdf`;

        const doc = new PDFDocument({
            margin: 50
        });

        const stream =
            fs.createWriteStream(fileName);


        // Handle file errors
        stream.on("error", reject);

        doc.on("error", reject);


        // When PDF has completely finished writing
        stream.on("finish", () => {

            resolve(fileName);

        });


        doc.pipe(stream);


        // =====================================================
        // HEADER
        // =====================================================

        doc
            .fontSize(24)
            .text("STONEHUB", {
                align: "center"
            });


        doc
            .fontSize(12)
            .text(
                "Denkyembo Marble & Granite Company Ltd.",
                {
                    align: "center"
                }
            );


        doc.moveDown();


        doc
            .fontSize(20)
            .text("INVOICE", {
                align: "center"
            });


        doc.moveDown(2);


        // =====================================================
        // ORDER INFORMATION
        // =====================================================

        doc
            .fontSize(12)
            .text(
                `Invoice Number: SH-${String(invoiceData.orderId).padStart(6, "0")}`
            );

        doc.text(
            `Order ID: ${invoiceData.orderId}`
        );

        doc.text(
            `Customer: ${invoiceData.customerName}`
        );

        doc.text(
            `Email: ${invoiceData.email}`
        );

        doc.text(
            `Payment Method: ${invoiceData.paymentMethod}`
        );

        doc.text(
            `Payment Status: PAID`
        );


        doc.moveDown();


        // =====================================================
        // PRODUCTS
        // =====================================================

        doc
            .fontSize(14)
            .text("Order Details");


        doc.moveDown();


        invoiceData.items.forEach(item => {

            const itemTotal =
                Number(item.price) *
                Number(item.quantity);


            doc
                .fontSize(11)
                .text(
                    `${item.product_name} | ` +
                    `Qty: ${item.quantity} | ` +
                    `Unit Price: GHS ${Number(item.price).toFixed(2)} | ` +
                    `Total: GHS ${itemTotal.toFixed(2)}`
                );

        });


        doc.moveDown();


        // =====================================================
        // TOTAL
        // =====================================================

        doc
            .fontSize(14)
            .text(
                `TOTAL: GHS ${Number(invoiceData.totalAmount).toFixed(2)}`,
                {
                    align: "right"
                }
            );


        doc.moveDown(2);


        // =====================================================
        // FOOTER
        // =====================================================

        doc
            .fontSize(11)
            .text(
                "Thank you for shopping with StoneHub.",
                {
                    align: "center"
                }
            );


        doc.text(
            "This invoice was generated automatically.",
            {
                align: "center"
            }
        );


        // Finish PDF
        doc.end();

    });

};


module.exports = generateInvoicePDF;