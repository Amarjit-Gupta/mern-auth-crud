import { useEffect, useRef, useState } from "react";
import { MdPermIdentity } from "react-icons/md";
import { MdOutlineMailOutline } from "react-icons/md";
import { TbLockPassword } from "react-icons/tb";
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router';
import { BiLoaderAlt } from "react-icons/bi";
import { URL } from "../URL";

const Signup = () => {

    const [emailSend, setEmailSend] = useState(true);
    const [time, setTime] = useState(600);
    const [start, setStart] = useState(false);

    const [inputValue, setInputValue] = useState({
        name: "",
        email: "",
        password: ""
    });

    const [otp1, setOtp1] = useState(new Array(6).fill(""));
    const inputRef = useRef([]);

    useEffect(() => {
        let auth = localStorage.getItem("KuiWPP)ptxfbTjUC1@S20P%1a");
        if (auth) {
            navigate("/");
        }
    }, []);

    const navigate = useNavigate();

    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (event) => {
        setInputValue({ ...inputValue, [event.target.name]: event.target.value });
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (event.type === "click") {
            setStart(true);
            setTime(600);
        }
        if (!inputValue.name || !inputValue.email || !inputValue.password) {
            setError(true);
            return;
        }
        else if (inputValue.name.length < 3) {
            toast.warn("name length must be greater than 3...");
            return;
        }
        else if (inputValue.password.length <= 4) {
            toast.warn("password length should be greater than 4...");
            return;
        }
        else if (inputValue.name.trim() && inputValue.email.trim() && inputValue.password.trim()) {
            setLoading(true);
            try {
                let data = await fetch(`${URL}/auth/signup`, {
                    method: "post",
                    body: JSON.stringify(inputValue),
                    headers: { "Content-Type": "application/json" }
                });
                let result = await data.json();
                if (result.success) {
                    toast.success(result.message);
                    setLoading(false);
                    setEmailSend(false);
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
        !emailSend && inputRef.current[0]?.focus();
    }, [emailSend]);

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

    let second = time % 60;
    let minute = Math.floor(time / 60);

    const handleOtpSubmit = async (e) => {
        e.preventDefault();
        let email = inputValue.email;
        let verifyEmailOtp = otp1.join("");
        if (!email || !verifyEmailOtp) {
            setError(true);
            return;
        }
        else if (email.trim() && verifyEmailOtp.trim()) {
            setLoading(true);
            try {
                let data = await fetch(`${URL}/auth/verify-email`, {
                    method: "post",
                    body: JSON.stringify({ email, verifyEmailOtp }),
                    headers: { "Content-Type": "application/json" }
                });
                let result = await data.json();
                if (result.success && result.user.isAccountVerified) {
                    let token = result.auth;
                    let user = result.user;
                    let name = user.name;
                    localStorage.setItem("KuiWPP)ptxfbTjUC1@S20P%1a", JSON.stringify({ token, name }));
                    toast.success(result.message);
                    setLoading(false);
                    navigate("/");
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
            <div className="signup">
                {emailSend ?
                    <>
                        <p className="heading1">Create Account</p>
                        <p className="heading2">create your account</p>
                        <form onSubmit={handleSubmit}>
                            <div className="input-box"><MdPermIdentity className="icon" /><input type="text" placeholder="Enter name..." name="name" value={inputValue.name} onChange={handleChange} /></div>
                            {error && !inputValue.name && <p className="error-text">Enter Name</p>}
                            <div className="input-box"><MdOutlineMailOutline className="icon" /><input type="email" placeholder="Enter email..." name="email" value={inputValue.email} onChange={handleChange} /></div>
                            {error && !inputValue.email && <p className="error-text">Enter Email Id</p>}
                            <div className="input-box"><TbLockPassword className="icon" /><input type="password" placeholder="Enter Password..." name="password" value={inputValue.password} onChange={handleChange} /></div>
                            {error && !inputValue.password && <p className="error-text">Enter Password</p>}
                            <button type="submit" className="submit-btn" disabled={loading}>{loading ? <span>Signupin...<BiLoaderAlt className="loading-icon" /></span> : "Signup"}</button>  
                        </form>
                        <div className="already-text">Already have an account? &nbsp;<Link to={'/login'} style={{ color: "red" }}>Login here</Link></div>
                    </>
                    :
                    <>
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
                            <span>{start ? "Resend in: " + (minute < 10 ? "0" + minute : minute) + ":" + (second < 10 ? "0" + second : second) : <button onClick={handleSubmit} className="resend-btn">Resend OTP</button>}</span>
                        </div>
                        <div className="already-text">Already have an account? <Link to={'/login'} style={{ color: "red" }}>Login here</Link></div>
                    </>
                }
            </div>
    );
}

export default Signup;
