import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo2.jpeg";

const Navbar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/"); // Redirect to login
    };

    return (
        <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center sticky top-0 z-50">
            <Link to="/dashboard" className="flex items-center gap-2">
                <div className="h-8 w-12">
                    <img src={logo} alt="DevSync Logo" className="h-full w-full object-contain" />
                </div>
                <span className="text-blue-600 font-bold text-lg">DevSync</span>
            </Link>

            <div className="flex items-center gap-4">
              
                <Link
                    to="/dashboard"
                    className="text-sm text-gray-600 hover:text-blue-600"
                >
                    Projects
                </Link>
                <button
                    onClick={handleLogout}
                    className="bg-red-500 hover:bg-red-600 text-white text-sm px-4 py-2 rounded"
                >
                    Logout
                </button>
            </div>
        </nav>
    );
};

export default Navbar;