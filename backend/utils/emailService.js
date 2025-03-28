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
        subject: "EnrollX Password Reset Request",
        text: `Dear User,
    
    We received a request to reset your password for EnrollX. Here is your temporary password:
    
    🔑 ${tempPassword}
    
    Please do not share this password with anyone. For security reasons, we strongly recommend resetting it immediately after logging in.
    
    If you did not request this reset, please ignore this email.
    
    Best regards,  
    EnrollX Support Team`
    };
    

    await transporter.sendMail(mailOptions);
}

module.exports = sendResetEmail; // ✅ Correct Export
