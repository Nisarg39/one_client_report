
import nodemailer from 'nodemailer';

interface EmailOptions {
    to: string;
    subject: string;
    html: string;
    attachments?: {
        filename: string;
        content: Buffer;
    }[];
}

const transporter = nodemailer.createTransport({
    // Configure with your email provider variables
    // For development, we can mock or use a service like Ethereal or specific SMTP
    host: process.env.EMAIL_SERVER_HOST || 'smtp.example.com',
    port: parseInt(process.env.EMAIL_SERVER_PORT || '587'),
    auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
    },
    secure: process.env.EMAIL_SERVER_SECURE === 'true',
});

export async function sendEmail({ to, subject, html, attachments }: EmailOptions) {
    if (!process.env.EMAIL_SERVER_USER) {
        console.warn('Email server not configured. Skipping email send.');
        // In dev, maybe log the email content?
        console.log(`[Mock Email] To: ${to}, Subject: ${subject}`);
        return;
    }

    try {
        const info = await transporter.sendMail({
            from: process.env.EMAIL_FROM || '"One Client Report" <noreply@oneclientreport.com>',
            to,
            subject,
            html,
            attachments,
        });
        console.log('Message sent: %s', info.messageId);
        return info;
    } catch (error) {
        console.error('Error sending email:', error);
        // Don't throw error to avoid breaking the main flow, just log it
        // Unless we want strict failure
    }
}

export function getSubscriptionSuccessEmailHtml(customerName: string, planName: string, amount: number) {
    return `
    <div style="font-family: Arial, sans-serif; color: #333;">
      <h1>Welcome to One Client Report!</h1>
      <p>Hi ${customerName},</p>
      <p>Thank you for subscribing to the <strong>${planName}</strong> plan.</p>
      <p>We have received your payment of <strong>₹${amount}</strong>.</p>
      <p>Your invoice is attached to this email.</p>
      <br/>
      <p>Best regards,</p>
      <p>The One Client Report Team</p>
    </div>
  `;
}
