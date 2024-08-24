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
    console.log(`we moved from createTransport step`)
    // 2- define email options like (from, to, subject, message,...)
    const mailOptions = {
        from: `E-Commerce App <kerlosmaged37@gmail.com>`,
        to: emailOptions.to,
        subject: emailOptions.subject,
        text: emailOptions.message,
        
    }
    console.log(`we moved from mailOptions step`)
    // 3- send email
    await transport.sendMail(mailOptions)

    console.log(`we send email successfully`)
    // return emailValue
}

module.exports = {
    sendEmail
}