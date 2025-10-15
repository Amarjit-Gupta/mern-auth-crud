import { MdOutlineMailOutline } from "react-icons/md";
import { TbLockPassword } from "react-icons/tb";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import { BiLoaderAlt } from "react-icons/bi";
import { URL } from "../URL";

const ForgotPassword = () => {

    const [time, setTime] = useState(600);
    const [start, setStart] = useState(false);

    const [sendEmail, setSendEmail] = useState(false);
    const [filledOtp, setFilledOtp] = useState(false);

    const [inputValue, setInputValue] = useState({
        email: "",
        newPassword: ""
    });

    const navigate = useNavigate();

    useEffect(() => {
        let auth = localStorage.getItem("KuiWPP)ptxfbTjUC1@S20P%1a");
        if (auth) {
            navigate("/");
        }
    }, []);

    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (event) => {
        setInputValue({ ...inputValue, [event.target.name]: event.target.value });
    }

    const handleSendOtp = async (event) => {
        event.preventDefault();
        if (!inputValue.email) {
            setError(true);
            return;
        }
        else if (inputValue.email.trim()) {
            setLoading(true);
            try {
                let data = await fetch(`${URL}/auth/send-otp`, {
                    method: "post",
                    body: JSON.stringify(inputValue),
                    headers: { "Content-Type": "application/json" }
                });
                let result = await data.json();
                if (result.success && result.user.email) {
                    toast.success(result.message);
                    setLoading(false);
                    setSendEmail(true);
                }
                else {
                    toast.error(result.message);
                    setLoading(false);
                }
            }
            catch (err) {
                toast.error("something went wrong...");
                setLoading(false);
            }
        }
        else {
            toast.warn("white space is not allowed.");
        }
    }

    // for otp
    const [otp1, setOtp1] = useState(new Array(6).fill(""));

    const inputRef = useRef([]);

    const handleChangeOtp = (value, index) => {
        if (isNaN(value)) {
            return false;
        }
        const newOtp = [...otp1];
        newOtp[index] = value;
        setOtp1(newOtp);
        if (value && index < inputRef.current.length - 1) {
            inputRef.current[index + 1].focus();
        }
    }

    const handleKeyDown = (e, index) => {
        if (e.key == "Backspace" && e.target.value == "" && index > 0) {
            inputRef.current[index - 1].focus();
        }
    }


    const handlePaste = (e, index) => {
        let pasteData = e.clipboardData.getData('text').slice(0, 6).split("");
        let val = pasteData.every((v) => !isNaN(v) && v !== "");
        if (pasteData.length == 6 && val) {
            setOtp1(pasteData);
            inputRef.current[5].focus();
        }
    }

    useEffect(() => {
        sendEmail && inputRef.current[0]?.focus();
    }, [sendEmail]);

    // for time
    useEffect(() => {
        if (!start) return;

        let interval = setInterval(() => {
            setTime((prev) => {
                if (prev <= 1) {
                    setStart(false);
                    return 0;
                }
                else {
                    return (prev - 1);
                }
            });
        }, 1000);

        return () => {
            clearInterval(interval);
        }
    }, [start]);

    const handleResend = () => {
        setStart(true);
        setTime(600);
    }

    let second = time % 60;
    let minute = Math.floor(time / 60);

    const handleOtpSubmit = (e) => {
        e.preventDefault();
        setFilledOtp(true);
    }

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        let otp = otp1.join("");
        let email = inputValue.email;
        let newPassword = inputValue.newPassword;

        if (!email && !otp && !newPassword) {
            toast.warn("please enter OTP and newPassword...");
            return;
        }
        else if (newPassword.length <= 4) {
            toast.warn("password length should be greater than 4...");
            return;
        }
        else if (email.trim() && otp.trim() && newPassword.trim()) {
            setLoading(true);
            try {
                let data = await fetch(`${URL}/auth/update-password`, {
                    method: "post",
                    body: JSON.stringify({ email, otp, newPassword }),
                    headers: { "Content-Type": "application/json" }
                });
                let result = await data.json();
                if (result.success) {
                    toast.success(result.message);
                    setLoading(false);
                    navigate("/login");
                }
                else {
                    toast.error(result.message);
                    setLoading(false);
                }
            }
            catch (err) {
                toast.error("something went wrong...");
                setLoading(false);
            }
        }
        else {
            toast.warn("white space is not allowed.");
        }
    }

    return (
        <>
            {/* email */}
            {!sendEmail && <div className="signup">
                <p className="heading1">Reset Password</p>
                <p className="heading2">Enter Your registered email address</p>
                <form onSubmit={handleSendOtp}>
                    <div className="input-box"><MdOutlineMailOutline className="icon" /><input type="email" placeholder="Enter email..." name="email" value={inputValue.email} onChange={handleChange} /></div>
                    {error && !inputValue.email && <p className="error-text">Enter Email Id</p>}
                    <button type="submit" className="submit-btn" disabled={loading}>{loading ? <span>Sending...<BiLoaderAlt className="loading-icon" /></span> : "Send OTP"}</button>
                </form>
                <div className="forgot-link"><Link to={'/login'} style={{ color: "red" }}>Back to Login</Link></div>
            </div>}

            {/* otp */}
            {sendEmail && !filledOtp &&
                <div className="signup">
                    <p className="heading1">Reset Password OTP</p>
                    <p className="heading2">Enter the 6-digit code sent to your email</p>
                    <form onSubmit={handleOtpSubmit}>
                        <div className="otp-main">
                            {otp1?.map((v, index) => {
                                return (
                                    <input
                                        type="text"
                                        className="otp-input"
                                        key={index}
                                        value={otp1[index]}
                                        onChange={(e) => handleChangeOtp(e.target.value, index)}
                                        maxLength={'1'}
                                        ref={(input) => inputRef.current[index] = input}
                                        onKeyDown={(e) => handleKeyDown(e, index)}
                                        onPaste={(e) => handlePaste(e, index)}
                                    />
                                );
                            })}
                        </div>
                        <button type="submit" className="submit-otp-btn" disabled={!otp1.every((v) => v !== "")}>Submit OTP</button>
                    </form>
                    <div className="forgot-link">
                        <Link to={'/login'} style={{ color: "red" }}>Back to Login</Link>
                        <span>{start ? "Resend in: " + (minute < 10 ? "0" + minute : minute) + ":" + (second < 10 ? "0" + second : second) : <button onClick={handleResend} className="resend-btn">Resend OTP</button>}</span>
                    </div>
                </div>}

            {/* newPassword */}
            {sendEmail && filledOtp && <div className="signup">
                <p className="heading1">New Password</p>
                <p className="heading2">Enter the new password below</p>
                <form onSubmit={handleUpdatePassword}>
                    <div className="input-box"><TbLockPassword className="icon" /><input type="password" placeholder="Enter Password..." name="newPassword" value={inputValue.newPassword} onChange={handleChange} /></div>
                    <button type="submit" className="submit-btn" disabled={loading}>{loading ? <span>Reseting...<BiLoaderAlt className="loading-icon" /></span> : "Reset Password"}</button>
                </form>
                <div className="forgot-link"><Link to={'/login'} style={{ color: "red" }}>Back to Login</Link></div>
            </div>}
        </>
    );
}

export default ForgotPassword;