import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Footer from "./Footer";

const HomePage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token); // true if token exists
  }, []);

  return (
    <>
      <div className="min-h-screen bg-gradient-to-r from-blue-50 via-white to-blue-50 flex flex-col items-center px-6 py-12">
        {/* Hero Section */}
        <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
          <div className="space-y-8">
            <h1 className="text-5xl font-extrabold text-blue-700 leading-tight">
              Empower Your Development with <span className="text-blue-900">DevSync</span>
            </h1>
            <p className="text-lg text-gray-700 max-w-xl">
              Manage projects, assign tasks, and collaborate with your team in real-time — all in one powerful platform.
            </p>

            {/* ✅ Only show buttons if not logged in */}
            {!isAuthenticated && (
              <div className="flex space-x-6">
                <Link
                  to="/login"
                  className="bg-blue-700 text-white px-8 py-3 rounded-md shadow-lg hover:bg-blue-800 transition"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="border-2 border-blue-700 text-blue-700 px-8 py-3 rounded-md hover:bg-blue-700 hover:text-white transition"
                >
                  Signup
                </Link>
              </div>
            )}
          </div>

          <div className="flex justify-center">
            <img
              src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1350&q=80"
              alt="AI and collaboration"
              className="rounded-xl shadow-xl max-w-full h-auto"
            />
          </div>
        </div>

        {/* Features Section */}
        <div className="max-w-7xl w-full grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition">
            <h3 className="text-xl font-semibold text-blue-700 mb-3">Task Management</h3>
            <p className="text-gray-600">
              Easily create, update, and track your tasks to keep your project moving forward.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition">
            <h3 className="text-xl font-semibold text-blue-700 mb-3">Team Collaboration</h3>
            <p className="text-gray-600">
              Share projects, assign tasks, and stay connected with your team effortlessly.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition">
            <h3 className="text-xl font-semibold text-blue-700 mb-3">Real-time Updates</h3>
            <p className="text-gray-600">
              Get instant notifications and see live changes to keep everyone in sync.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default HomePage;