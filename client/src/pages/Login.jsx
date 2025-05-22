/* eslint-disable no-undef */
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useState } from 'react';
import axios from "axios";
import { Link } from "react-router-dom";


const Login = () => {

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
        // console.log(formData);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const res = await axios.post("http://localhost:8080/api/auth/login", formData);
            console.log("✅ Logged in:", res.data);
            // TODO: Save token & redirect
            localStorage.setItem("token", res.data.jwtToken);
            window.location.href = "/dashboard";
        } catch (err) {
            setError(err.response?.data?.message || "Login failed");
        }
    }


    return (
        <div className=" min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full bg-white p-6 rounded-lg  shadow-md shadow-blue-200">
                <h1 className="text-2xl text-center font-semibold text-blue-600 mb-4">Sign in to your DevSync account</h1>

                {error && (
                    <p className="text-red-500 text-sm mb-2 text-center">{error}</p>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <TextField
                        label="Email"
                        name='email'
                        variant="outlined"
                        onChange={handleChange}
                        value={formData.email}
                        fullWidth
                    />
                    <TextField
                        label="Password"
                        name="password"
                        type="password"
                        variant="outlined"
                        onChange={handleChange}
                        value={formData.password}
                        fullWidth
                    />
                    <Button
                        variant="contained"
                        fullWidth
                        type="submit"
                    >Login</Button>
                </form>

                <p className="text-sm mt-4 text-center">
                    Don’t have an account?{" "}
                    <Link to="/signup" className="text-blue-600 hover:underline font-medium">
                        Sign up
                    </Link>
                </p>

            </div>
        </div>
    )
}

export default Login;