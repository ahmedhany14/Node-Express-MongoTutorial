const nodemailer = require('nodemailer');

module.exports = class Email {

    constructor(user, url) {
        this.user = user;
        this.f_name = user.name.split()[0];
        this.to = user.email;
        this.from = "Ahmed Hany ahmed.work.gmail.com";
        this.url = url;
    }

    createNewTransport() {
        if (process.env.NODE_ENV === 'production')
            return 1

        return nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        })
    }

    async send(subject, message) {

        const mailOptions = {
            from: this.from,
            to: this.to,
            subject,
            text: message,
        }

        await this.createNewTransport().sendMail(mailOptions);
    }

    async sendWelcome(subject, message) {
        console.log("I don't know why this is not working so I will try to fix it later, but now I will just print the message")
        console.log(message, subject)
        return
        //await this.send(subject, message)
    }

    async sendRestPasswordToken(subject, message) {
        await this.send(subject, message)
    }
}