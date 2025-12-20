
import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

interface InvoiceData {
    invoiceNumber: string;
    customerName: string;
    customerEmail: string;
    amount: number;
    date: Date;
    planName: string;
    paymentMethod: string;
    transactionId: string;
}

/**
 * Generate PDF Invoice
 * returns a Buffer containing the PDF data
 */
export async function generateInvoice(data: InvoiceData): Promise<Buffer> {
    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument({ margin: 0, size: 'A4' });
            const buffers: Buffer[] = [];

            doc.on('data', buffers.push.bind(buffers));
            doc.on('end', () => {
                const pdfData = Buffer.concat(buffers);
                resolve(pdfData);
            });

            // Layout Constants
            const PAGE_WIDTH = doc.page.width;
            const PAGE_HEIGHT = doc.page.height;
            const MARGIN_X = 50;
            const CONTENT_WIDTH = PAGE_WIDTH - (MARGIN_X * 2);

            // Neumorphic Brand Tokens
            const BG_COLOR = '#1a1a1a';       // Main background
            const CARD_BG = '#151515';        // Inset/Card background
            const PRIMARY_ORANGE = '#FF8C42';
            const ACCENT_TEAL = '#6CA3A2';
            const TEXT_MAIN = '#f5f5f5';
            const TEXT_SECONDARY = '#e5e5e5';
            const TEXT_MUTED = '#999999';
            const BORDER_DARK = '#333333';

            // --- 1. Background Fill (Dark Mode) ---
            doc.rect(0, 0, PAGE_WIDTH, PAGE_HEIGHT).fill(BG_COLOR);

            // --- 2. Header Section ---
            // Gradient-like Top Bar (Simulated with simple rect for PDF)
            doc.rect(0, 0, PAGE_WIDTH, 6).fill(PRIMARY_ORANGE);

            // Logo Image
            const logoPath = path.join(process.cwd(), 'public', 'one_report_icon.png');
            if (fs.existsSync(logoPath)) {
                doc.image(logoPath, MARGIN_X, 50, { width: 32 });
            }

            // Brand Name
            doc.fillColor(TEXT_MAIN)
                .fontSize(24)
                .font('Helvetica-Bold')
                .text('OneReport', MARGIN_X + 44, 50);

            // Tagline (Teal Accent)
            doc.fontSize(9)
                .font('Helvetica')
                .fillColor(ACCENT_TEAL)
                .text('Advanced Client Reporting', MARGIN_X + 44, 78);

            // "PAID" Badge (Neumorphic Style)
            const badgeW = 90;
            const badgeH = 24;
            const badgeX = PAGE_WIDTH - MARGIN_X - badgeW;
            const badgeY = 54;

            // Badge Background (Darker inset)
            doc.roundedRect(badgeX, badgeY, badgeW, badgeH, 12).fill(CARD_BG);
            doc.lineWidth(1).strokeColor(PRIMARY_ORANGE).stroke(); // Orange ring

            doc.fillColor(PRIMARY_ORANGE)
                .fontSize(10)
                .font('Helvetica-Bold')
                .text('PAID', badgeX, badgeY + 7, { align: 'center', width: badgeW });

            // --- 3. Invoice Meta Grid ---
            const metaY = 110;
            const metaWidth = CONTENT_WIDTH;

            // Meta Container (Soft Background)
            doc.roundedRect(MARGIN_X, metaY - 10, metaWidth, 50, 8).fill(CARD_BG);

            // Columns
            doc.fillColor(TEXT_MUTED).fontSize(8).font('Helvetica-Bold');
            doc.text('INVOICE NO', MARGIN_X + 20, metaY + 8);
            doc.text('DATE', MARGIN_X + 180, metaY + 8);
            doc.text('TOTAL AMOUNT', PAGE_WIDTH - MARGIN_X - 120, metaY + 8, { align: 'right', width: 100 });

            doc.fillColor(TEXT_MAIN).fontSize(10).font('Helvetica');
            doc.text(data.invoiceNumber, MARGIN_X + 20, metaY + 24);
            doc.text(data.date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }), MARGIN_X + 180, metaY + 24);
            doc.fillColor(PRIMARY_ORANGE).font('Helvetica-Bold')
                .text(`INR ${data.amount.toFixed(2)}`, PAGE_WIDTH - MARGIN_X - 120, metaY + 24, { align: 'right', width: 100 });

            // --- 4. Billing Columns ---
            const colsY = 190;
            const colWidth = (CONTENT_WIDTH / 2) - 20;

            // FROM Column
            doc.fillColor(TEXT_MUTED).fontSize(9).font('Helvetica-Bold').text('BILLED FROM', MARGIN_X, colsY);
            doc.rect(MARGIN_X, colsY + 14, 30, 2).fill(ACCENT_TEAL);

            doc.fillColor(TEXT_SECONDARY).fontSize(10).font('Helvetica-Bold').text('One Client Report', MARGIN_X, colsY + 28);
            doc.fillColor(TEXT_MUTED).fontSize(9).font('Helvetica')
                .text('25/314, Netaji Nagar, Wanowrie', MARGIN_X, colsY + 44)
                .text('Pune - 411040, Maharashtra, India', MARGIN_X, colsY + 58)
                .text('support@oneclientreport.com', MARGIN_X, colsY + 72);

            // TO Column
            const rightColX = PAGE_WIDTH / 2 + 20;
            doc.fillColor(TEXT_MUTED).fontSize(9).font('Helvetica-Bold').text('BILLED TO', rightColX, colsY);
            doc.rect(rightColX, colsY + 14, 30, 2).fill(ACCENT_TEAL);

            doc.fillColor(TEXT_SECONDARY).fontSize(10).font('Helvetica-Bold').text(data.customerName, rightColX, colsY + 28);
            doc.fillColor(TEXT_MUTED).fontSize(9).font('Helvetica')
                .text(data.customerEmail, rightColX, colsY + 44);

            // --- 5. Line Items Table ---
            const tableTop = 320;

            // Header
            doc.roundedRect(MARGIN_X, tableTop, CONTENT_WIDTH, 35, 6).fill(CARD_BG);
            doc.fillColor(TEXT_SECONDARY).fontSize(9).font('Helvetica-Bold');
            doc.text('DESCRIPTION', MARGIN_X + 20, tableTop + 12);
            doc.text('RATE', PAGE_WIDTH - MARGIN_X - 200, tableTop + 12, { align: 'right', width: 80 });
            doc.text('AMOUNT', PAGE_WIDTH - MARGIN_X - 100, tableTop + 12, { align: 'right', width: 80 });

            // Row
            const rowY = tableTop + 50;
            doc.fillColor(TEXT_MAIN).fontSize(10).font('Helvetica-Bold');
            doc.text(`Subscription - ${data.planName}`, MARGIN_X + 20, rowY);
            doc.fontSize(9).font('Helvetica').fillColor(TEXT_MUTED)
                .text('Monthly Access', MARGIN_X + 20, rowY + 15);

            doc.fillColor(TEXT_MAIN).fontSize(10);
            doc.text(`INR ${data.amount.toFixed(2)}`, PAGE_WIDTH - MARGIN_X - 200, rowY, { align: 'right', width: 80 });
            doc.text(`INR ${data.amount.toFixed(2)}`, PAGE_WIDTH - MARGIN_X - 100, rowY, { align: 'right', width: 80 });

            // Divider Line
            doc.moveTo(MARGIN_X + 20, rowY + 35).lineTo(PAGE_WIDTH - MARGIN_X - 20, rowY + 35)
                .strokeColor(BORDER_DARK).stroke();

            // --- 6. Summary ---
            const summaryY = rowY + 50;
            const summaryLabelX = PAGE_WIDTH - MARGIN_X - 220;
            const summaryValueX = PAGE_WIDTH - MARGIN_X - 100;

            const drawSummary = (label: string, val: string, isTotal = false) => {
                doc.fontSize(isTotal ? 12 : 9).font(isTotal ? 'Helvetica-Bold' : 'Helvetica')
                    .fillColor(isTotal ? TEXT_MAIN : TEXT_MUTED)
                    .text(label, summaryLabelX, doc.y, { align: 'right', width: 100 });

                doc.fillColor(isTotal ? PRIMARY_ORANGE : TEXT_MAIN)
                    .text(val, summaryValueX, doc.y - (isTotal ? 14 : 11), { align: 'right', width: 80 });

                doc.moveDown(0.6);
            };

            doc.y = summaryY;
            drawSummary('Subtotal', `INR ${data.amount.toFixed(2)}`);
            drawSummary('Tax (0%)', 'INR 0.00');

            doc.moveDown(0.5); // Spacer
            drawSummary('Total', `INR ${data.amount.toFixed(2)}`, true);

            // --- 7. Footer / Payment Details ---
            const footerY = PAGE_HEIGHT - 100;

            // Payment Box
            doc.roundedRect(MARGIN_X, footerY, PAGE_WIDTH / 2, 60, 8).strokeColor(BORDER_DARK).stroke();

            doc.fillColor(TEXT_SECONDARY).fontSize(9).font('Helvetica-Bold')
                .text('Payment Information', MARGIN_X + 15, footerY + 10);

            doc.fillColor(TEXT_MUTED).fontSize(9).font('Helvetica')
                .text(`Method: ${data.paymentMethod}`, MARGIN_X + 15, footerY + 28)
                .text(`Transaction ID: ${data.transactionId}`, MARGIN_X + 15, footerY + 42);

            // Legal Footer
            doc.fontSize(8).fillColor('#333333')
                .text('OneReport Inc. | This is a computer generated invoice.',
                    0, PAGE_HEIGHT - 30, { align: 'center', width: PAGE_WIDTH });

            doc.end();

        } catch (error) {
            reject(error);
        }
    });
}
