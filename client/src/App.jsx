import "./App.css";
import { BrowserRouter as Router, useLocation } from "react-router-dom";
import AppRoutes from "./routes";
import Navbar from "./components/Navbar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function AppContent() {
  const location = useLocation();
  const hideNavbar = location.pathname === "/login" || location.pathname === "/signup";

  return (
    <>
      {!hideNavbar && <Navbar />}
      <ToastContainer position="top-right" autoClose={3000} />
      <AppRoutes />
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;