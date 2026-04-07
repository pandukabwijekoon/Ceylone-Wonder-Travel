const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Send an email with a common template
 * @param {string} to  - Recipient email address
 * @param {string} subject - Email subject
 * @param {string} title - Main header title (e.g. "Verify Success")
 * @param {string} content - Main text body content 
 * @param {string} highlight - Highlighted code or reference (e.g. "123456")
 * @param {string} footer - Small sub-text at bottom
 */
const sendEmail = async ({ to, subject, title, content, highlight, footer }) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn(`\n[EMAIL_SIMULATOR] Skipping real email to ${to} (credentials missing in .env). Highlights: ${highlight}\n`);
    return false;
  }

  const mailOptions = {
    from: `"Ceylon Wonders" <${process.env.EMAIL_USER}>`,
    to,
    subject: `${subject} - Ceylon Wonders`,
    html: `
      <div style="font-family: 'Arial', sans-serif; max-width: 600px; margin: auto; padding: 0; background: #050D10; color: #E8D5B0; border: 1px solid #1A6B7A; overflow: hidden; border-radius: 8px;">
        <div style="background: linear-gradient(135deg, #0B3D45, #1A6B7A); padding: 30px 20px; text-align: center; border-bottom: 3px solid #C9A84C;">
          <h1 style="color: #fff; font-family: 'Cinzel', serif; margin: 0; font-size: 28px;">${title}</h1>
          <p style="color: #C9A84C; margin-top: 5px; font-size: 14px; letter-spacing: 2px;">CEYLON WONDERS TRAVEL</p>
        </div>
        
        <div style="padding: 30px;">
          <p style="color: #8BA8AE; line-height: 1.6; font-size: 16px;">${content}</p>
          
          ${highlight ? `
          <div style="background: rgba(201,168,76,0.1); border: 2px dashed #C9A84C; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 12px; color: #C9A84C; margin: 25px 0;">
            ${highlight}
          </div>
          ` : ''}
          
          <p style="color: #8BA8AE; line-height: 1.6; text-align: center; margin-top: 30px; font-size: 14px;">
            ${footer || 'If you have any questions, feel free to reply to this email.'}
          </p>
        </div>
        
        <div style="background: #000; padding: 15px; text-align: center; font-size: 11px; color: rgba(255,255,255,0.4);">
          &copy; ${new Date().getFullYear()} Ceylon Wonders. All rights reserved.
        </div>
      </div>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`[MAILER] Real email sent to ${to}: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error(`[MAILER] Failed to send email to ${to}:`, error.message);
    return false;
  }
};

module.exports = { sendEmail, transporter };
