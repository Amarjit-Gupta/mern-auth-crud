import { MdOutlineMailOutline } from "react-icons/md";
import { TbLockPassword } from "react-icons/tb";
import { Link, useNavigate } from 'react-router';
import { useEffect, useState } from "react";
import { toast } from 'react-toastify';
import { BiLoaderAlt } from "react-icons/bi";
import { URL } from "../URL";

const Login = () => {

    const [inputValue, setInputValue] = useState({
        email: "",
        password: ""
    });

    const navigate = useNavigate();

    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        let auth = localStorage.getItem("KuiWPP)ptxfbTjUC1@S20P%1a");
        if (auth) {
            navigate("/");
        }
    }, []);

    const handleChange = (event) => {
        setInputValue({ ...inputValue, [event.target.name]: event.target.value });
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!inputValue.email || !inputValue.password) {
            setError(true);
            return;
        }
        else if (inputValue.email.trim() && inputValue.password.trim()) {
            setLoading(true);
            try {
                let data = await fetch(`${URL}/auth/login`, {
                    method: "post",
                    body: JSON.stringify(inputValue),
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
                <p className="heading1">Login</p>
                <p className="heading2">Login to your account</p>
                <form onSubmit={handleSubmit}>
                    <div className="input-box"><MdOutlineMailOutline className="icon" /><input type="email" placeholder="Enter email..." name="email" value={inputValue.email} onChange={handleChange} /></div>
                    {error && !inputValue.email && <p className="error-text">Enter Email Id</p>}
                    <div className="input-box"><TbLockPassword className="icon" /><input type="password" placeholder="Enter Password..." name="password" value={inputValue.password} onChange={handleChange} /></div>
                    {error && !inputValue.password && <p className="error-text">Enter Password</p>}
                    <button type="submit" className="submit-btn" disabled={loading}>{loading ? <span>Login...<BiLoaderAlt className="loading-icon" /></span> : "Login"}</button>
                </form>
                <div className="forgot-link"><Link to={'/forgot-password'} style={{ color: "red" }}>forgot password?</Link></div>
                <div className="already-text">Don't have an account? <Link to={'/signup'} style={{ color: "red" }}>SignUp</Link></div>
            </div>
    );
}

export default Login;