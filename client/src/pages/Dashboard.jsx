import { useEffect, useState } from "react";
import axios from "axios";

const Dashboard = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

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
            <h1 className="text-2xl font-bold text-blue-600  mb-6">Your Projects</h1>

            {loading && <p className="text-gray-600">Loading projects...</p>}

            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

            {!loading && projects.length === 0 && (
                <p className="text-gray-500">You haven’t created any projects yet.</p>
            )}

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 ">
                {projects.map((proj) => (
                    <div
                        key={proj._id}
                        className="border bg-white rounded-lg p-4 shadow hover:shadow-md transition bg-blue-100"
                    >
                        <h2 className="text-lg font-semibold">{proj.title}</h2>
                        <p className="text-sm text-gray-600 mt-1">
                            {proj.description || "No description provided."}
                        </p>
                        <p className="text-xs text-gray-400 mt-2">
                            Created at: {new Date(proj.createdAt).toLocaleString()}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;