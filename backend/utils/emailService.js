const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, text) => {
    try {
        let transporter = nodemailer.createTransport({
            service: "Gmail", // Or use your SMTP settings
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        let mailOptions = {
            from: process.env.EMAIL_USER,
            to,
            subject,
            text
        };

        await transporter.sendMail(mailOptions);
        console.log("📩 Email sent successfully!");
    } catch (error) {
        console.error("❌ Error sending email:", error);
    }
};

module.exports = sendEmail;
