import { useEffect, useState} from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import NewProjectForm from "../components/NewProjectForm";


const Dashboard = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showForm, setShowForm] = useState(false);

    const fetchProjects = async () => {
        try {
            const token = localStorage.getItem("token");
            // console.log("Token before request:", token);
            const res = await axios.get("http://localhost:8080/api/projects", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            // console.log("Token after request:", token);
            setProjects(res.data.projects);
        } catch (err) {
            console.error("❌ Failed to fetch projects:", err);
            setError("Something went wrong while fetching your projects.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-blue-600">Your Projects</h1>
                <button
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm"
                    onClick={() => setShowForm(true)}
                >
                    + New Project
                </button>
            </div>

            {showForm && (
                <NewProjectForm
                    onClose={() => setShowForm(false)}
                    onSuccess={fetchProjects}
                />
            )}

            {loading && <p className="text-gray-600">Loading projects...</p>}

            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

            {!loading && projects.length === 0 && (
                <p className="text-gray-500">You haven’t created any projects yet.</p>
            )}


            
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 ">
                    {projects.map((proj) => (
                        <Link to={`/projects/${proj._id}`} key={proj._id}>
                        <div
                            key={proj._id}
                            className="border rounded-lg p-4 shadow hover:shadow-md transition bg-blue-100"
                        >
                            <h2 className="text-lg font-semibold">{proj.title}</h2>
                            <p className="text-sm text-gray-600 mt-1">
                                {proj.description || "No description provided."}
                            </p>
                            <p className="text-xs text-gray-400 mt-2">
                                Created at: {new Date(proj.createdAt).toLocaleString()}
                            </p>
                        </div>
                        </Link>
                    ))}
                </div>
            
        </div >
    );
};

export default Dashboard;