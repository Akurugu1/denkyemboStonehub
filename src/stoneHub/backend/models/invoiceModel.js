const db = require("../config/dbPromise");


// =====================================================
// CREATE INVOICE RECORD
// =====================================================

const createInvoice = async (
    orderId,
    paymentId,
    invoiceFile
) => {

    const [result] = await db.query(
        `
        INSERT INTO invoice
        (
            order_id,
            payment_id,
            invoice_status,
            invoice_file
        )

        VALUES (?, ?, ?, ?)
        `,
        [
            orderId,
            paymentId,
            "Pending",
            invoiceFile
        ]
    );


    return result.insertId;

};



// =====================================================
// MARK INVOICE AS SENT
// =====================================================

const markInvoiceSent = async (
    invoiceId
) => {

    await db.query(
        `
        UPDATE invoice

        SET
            invoice_status = ?,
            sent_at = NOW()

        WHERE invoice_id = ?
        `,
        [
            "Sent",
            invoiceId
        ]
    );


    return {
        message:
            "Invoice marked as sent."
    };

};



// =====================================================
// MARK INVOICE AS FAILED
// =====================================================

const markInvoiceFailed = async (
    invoiceId,
    failureReason
) => {

    await db.query(
        `
        UPDATE invoice

        SET
            invoice_status = ?,
            failure_reason = ?

        WHERE invoice_id = ?
        `,
        [
            "Failed",
            failureReason,
            invoiceId
        ]
    );


    return {
        message:
            "Invoice marked as failed."
    };

};



// =====================================================
// GET INVOICE BY ORDER
// =====================================================

const getInvoiceByOrder = async (
    orderId
) => {

    const [rows] = await db.query(
        `
        SELECT *
        FROM invoice
        WHERE order_id = ?
        ORDER BY invoice_id DESC
        LIMIT 1
        `,
        [orderId]
    );


    return rows[0];

};



// =====================================================
// EXPORT
// =====================================================

module.exports = {

    createInvoice,
    markInvoiceSent,
    markInvoiceFailed,
    getInvoiceByOrder

};