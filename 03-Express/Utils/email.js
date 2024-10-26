const nodemailer = require('nodemailer');

const sendEmail = async options => {
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST, port: process.env.EMAIL_PORT, auth: {
            user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS
        }
    })

    // options
    const mailOptions = {
        from: "Ahmed Hany ahmed.work.gmail.com",
        to: 'hanyahmd600@gmail.com',
        subject: options.subject,
        text: options.message,
    }
    // send the email to the user
    await transporter.sendMail(mailOptions);
}

module.exports = sendEmail;