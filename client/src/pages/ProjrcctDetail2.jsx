import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const ProjectDetails = () => {
    const { id } = useParams();
    const [project, setProject] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // ✅ Fetch project & tasks
    const fetchData = async () => {
        const token = localStorage.getItem("token");

        try {
            const projectRes = await axios.get(`http://localhost:8080/api/projects/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setProject(projectRes.data.project);
        } catch (err) {
            console.error(" Error loading project:", err.response?.data || err.message);
            setError("Unable to load project.");
            setLoading(false);
            return;
        }

        try {
            const taskRes = await axios.get(`http://localhost:8080/api/tasks/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setTasks(taskRes.data.tasks);
        } catch (err) {
            console.warn("⚠️ No tasks found or task fetch failed:", err.response?.data || err.message);
            setTasks([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [id]);

    if (loading) return <div className="p-6">Loading...</div>;
    if (error) return <div className="p-6 text-red-500">{error}</div>;

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold text-blue-600">{project.title}</h1>
                <Link to="/dashboard" className="text-sm text-blue-500 underline">← Back to Dashboard</Link>
            </div>

            <p className="text-gray-700 mb-6">{project.description || "No description provided."}</p>

            <h2 className="text-xl font-semibold mb-2">Tasks</h2>

            {tasks.length === 0 ? (
                <p className="text-gray-500 italic">
                    This project has no tasks yet. Start by creating one!
                </p>
            ) : (
                <ul className="space-y-2">
                    {tasks.map((task) => (
                        <li
                            key={task._id}
                            className="bg-white p-3 rounded shadow text-sm flex justify-between"
                        >
                            <div>
                                <strong>{task.title}</strong>
                                <p className="text-xs text-gray-500">{task.description}</p>
                            </div>
                            <span className="text-xs px-2 py-1 rounded bg-gray-200">
                                {task.status}
                            </span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ProjectDetails;