import nodemailer from 'nodemailer';

// console.log("in config file: ",process.env.SMTP_EMAIL);
// console.log("in config file: ",process.env.SMTP_PASS);

const transporter = nodemailer.createTransport({
    host:"smtp.gmail.com",
    port:587,
    secure:false,
    auth:{
        user:process.env.SMTP_EMAIL,
        pass:process.env.SMTP_PASS,
    }
});
export default transporter;
