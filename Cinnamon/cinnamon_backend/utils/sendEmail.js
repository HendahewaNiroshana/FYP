const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, message) => {
  try {
    
    const transporter = nodemailer.createTransport({
      service: "gmail", 
      auth: {
        user: process.env.EMAIL_USER,  
        pass: process.env.EMAIL_PASS,  
      },
    });

    
    const mailOptions = {
      from: `"Cinnamon Bridge" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text: message,
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (err) {
    console.error("❌ Email send failed:", err.message);
    return false;
  }
};

module.exports = sendEmail;
