import User from "../config/authdb.js";
import transporter from "../config/nodemailer.js";
import Jwt from 'jsonwebtoken';

// for signup
export const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: "please provide name, email and password..." });
        }
        let oldUser = await User.findOne({ email });
        if (oldUser && oldUser.isAccountVerified) {
            return res.status(400).json({ success: false, message: "Email already exist..." });
        }
        if (oldUser && !oldUser.isAccountVerified) {
            var otp = String(Math.floor(100000 + Math.random() * 900000));
            var expireAt = Date.now() + 10 * 60 * 1000;
            oldUser.verifyEmailOtp = otp;
            oldUser.verifyEmailOtpExpireAt = expireAt;
            oldUser.name = name;
            oldUser.password = password;
            await oldUser.save();
            
            const mailOptions = {
                from:"guptamantu775@gmail.com",
                to: oldUser.email,
                subject: "mern auth otp",
                text: `your otp for verify account is ${otp}.`
            }
            await transporter.sendMail(mailOptions);
            return res.status(200).json({ success: true, oldUser, message: "OTP send to yours same email id for verify account..." });
        }

        var otp = String(Math.floor(100000 + Math.random() * 900000));
        var expireAt = Date.now() + 10 * 60 * 1000;
        let data = new User({ name, email, password, verifyEmailOtp: otp, verifyEmailOtpExpireAt: expireAt });
        let result = await data.save();

        const mailOptions = {
            from: "guptamantu775@gmail.com",
            to: email,
            subject: "mern auth otp",
            text: `your otp for verify account is ${otp}.`
        }
        await transporter.sendMail(mailOptions);
        return res.status(200).json({ success: true, result, message: "OTP send to your email id for verify account..." });
    }
    catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
}

// send otp and save data for signup
export const verifyEmail = async (req, res) => {
    try {
        const { email, verifyEmailOtp } = req.body;
        if (!email || !verifyEmailOtp) {
            return res.status(400).json({ success: false, message: "please provide email and verifyEmailOtp..." });
        }
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: "Email not found..." });
        }
        if (user.verifyEmailOtp !== verifyEmailOtp || user.verifyEmailOtp === "") {
            return res.status(400).json({ success: false, message: "Invalid OTP, Please signup again......" });
        }
        if (user.verifyEmailOtpExpireAt < Date.now()) {
            return res.status(400).json({ success: false, message: "OTP Expired,, Please signup again......." });
        }

        user.verifyEmailOtp = "";
        user.verifyEmailOtpExpireAt = 0;
        user.isAccountVerified = true;
        await user.save();

        Jwt.sign({ user }, "jwtKey", (err, token) => {
            if (err) {
                return res.status(400).json({ success: false, message: "something went wrong in generate jwt token..." });
            }
            else {
                return res.status(200).json({ success: true, user, auth: token, message: "User signup successfully..." });
            }
        });
    }
    catch (err) {
        return res.status(500).json({ success: false, message: "something went wrong" });
    }
}


// login
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ success: false, message: "please provide email and password..." });
        }
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid Email..." });
        }
        if (user.password !== password) {
            return res.status(400).json({ success: false, message: "Invalid Password..." });
        }
        if (!user.isAccountVerified) {
            return res.status(400).json({ success: false, message: "this email is not verified..." });
        }

        Jwt.sign({ user }, "jwtKey", (err, token) => {
            if (err) {
                return res.status(400).json({ success: false, message: "something went wrong in generate jwt token..." });
            }
            else {
                return res.status(200).json({ success: true, user,auth:token, message: "User login successfully..." });
            }
        });
    }
    catch (err) {
        return res.status(500).json({ success: false, message: "something went wrong" });
    }
}

// send-otp
export const sendOtp = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ success: false, message: "please provide email..." });
        }
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: "Email not exist..." });
        }
        if (!user.isAccountVerified) {
            return res.status(400).json({ success: false, message: "you can not send otp because this Email not verified..." });
        }

        var otp = String(Math.floor(100000 + Math.random() * 900000));
        user.verifyOtp = otp;
        user.otpExpiredAt = Date.now() + 10 * 60 * 1000;
        await user.save();

        const mailOptions = {
            from:"guptamantu775@gmail.com",
            to: user.email,
            subject: "mern auth otp",
            text: `your otp for reset password is ${otp}.`
        }
        await transporter.sendMail(mailOptions);
        return res.status(200).json({ success: true, user, message: "OTP send successfully..." });
    }
    catch (err) {
        return res.status(500).json({ success: false, message: "something went wrong" });
    }
}

// update-password
export const updatePassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;
        if (!email, !otp, !newPassword) {
            return res.status(400).json({ success: false, message: "Please provide email, otp, newPassword..." });
        }
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: "Email not exist..." });
        }
        if (user.verifyOtp !== otp || user.verifyOtp === "") {
            return res.status(400).json({ success: false, message: "Invalid otp..." });
        }
        if (user.otpExpiredAt < Date.now()) {
            return res.status(400).json({ success: false, message: "OTP expired..." });
        }
        user.verifyOtp = "";
        user.otpExpiredAt = 0;
        user.password = newPassword;
        await user.save();
        return res.status(200).json({ success: true, user, message: "Password updated..." });
    }
    catch (err) {
        return res.status(500).json({ success: false, message: "something went wrong" });
    }
}
