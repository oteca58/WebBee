const nodemailer = require("nodemailer");
const { options } = require("../app");

const sendEmail = options => {
    //1)create a transporter
    const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
        //activate in gmail "less security app" option
    })

    //2)define email options

    //3)send the email
}

