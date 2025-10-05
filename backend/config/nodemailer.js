import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host:"smtp.gmail.com",
    port:587,
    secure:false,
    auth:{
        user:"guptamantu775@gmail.com",
        pass:"xvjucjcqxmtqezra",
    }
});
export default transporter;