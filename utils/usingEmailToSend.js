const nodeMailer = require('nodemailer')

const sendEmail = async (emailOptions) => {
    // 1- create transporter -> this is service or way will used to send email (Gmail , mailbox, mailgun,mailtrap, sendgrid,...)
    const transport = nodeMailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true, // true for 465, false for 587
        auth: {
            user: "kerlosmaged37@gmail.com",
            pass: "fmgr jrvp wrrl iepn"
        }
    });
    // 2- define email options like (from, to, subject, message,...)
    const mailOptions = {
        from: `E-Commerce App <kerlosmaged37@gmail.com>`,
        to: emailOptions.to,
        subject: emailOptions.subject,
        text: emailOptions.message,
        
    }
    // 3- send email
    await transport.sendMail(mailOptions)

    // return emailValue
}

module.exports = {
    sendEmail
}