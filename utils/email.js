const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config({ path: "./config/config.env" });

const sendEmail = async options => {
    //1)create a transporter
    console.log(process.env.EMAIL_HOST, "host");
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        PORT: process.env.EMAIL_PORT,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        },
    });

    //2)define email options
    const mailOptions = {
        from: "Elinor Wilkinson <elinor.wilkinson@ethereal.email>",
        to: options.email,
        subject: options.subject,
        text: options.message,
        html: "<b>Hello world?</b>"
    };

    //3)send the email
    await transporter.sendMail(mailOptions);
};

module.export = sendEmail;