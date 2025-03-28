const nodemailer = require("nodemailer");

async function sendResetEmail(to, tempPassword) {
    const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject: "Password Reset Request",
        text: `Your temporary password is: ${tempPassword}`
    };

    await transporter.sendMail(mailOptions);
}

module.exports = sendResetEmail;  // Ensure it's exported correctly
