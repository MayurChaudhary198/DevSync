import { useState } from "react";
import axios from "axios";
import { TextField, Button } from "@mui/material";
import { Link } from "react-router-dom";

const Signup = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    });

    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const res = await axios.post("http://localhost:8080/api/auth/signup", formData);
            console.log("✅ Signup successful:", res.data);
            window.location.href = "/"; // Redirect to login
        } catch (err) {
            setError(err.response?.data?.message || "Signup failed");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-md shadow-blue-200">
                <h2 className="text-2xl font-semibold text-center text-blue-600 mb-4">Create your DevSync account</h2>

                {error && <p className="text-red-500 text-sm mb-2 text-center">{error}</p>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <TextField
                        fullWidth
                        label="Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        size="small"
                    />
                    <TextField
                        fullWidth
                        label="Email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        size="small"
                    />
                    <TextField
                        fullWidth
                        label="Password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        size="small"
                    />
                    <Button type="submit" variant="contained" fullWidth>
                        Sign Up
                    </Button>
                </form>

                <p className="text-sm mt-4 text-center">
                    Already have an account?{" "}
                    <Link to="/" className="text-blue-600 hover:underline font-medium">
                        Login
                    </Link>
                </p>

            </div>
        </div>
    );
};

export default Signup;