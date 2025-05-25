import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";

const ProjectDetails = () => {
    const { id } = useParams();
    const [project, setProject] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        status: "Pending",
    });

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

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    }


    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");

        try {
            console.log("🚀 Submitting formData:", {
                ...formData,
                projectId: id
            });
            await axios.post("http://localhost:8080/api/tasks", {
                ...formData,
                projectId: id,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            }
            )
            setFormData({ title: "", description: "", status: "Pending" });
            setShowForm(false);
            fetchData();
        } catch (err) {
            console.error("❌ Failed to create task:", err);
        }
    }
    const handleStatusChange = async (taskId, newStatus) => {
        const token = localStorage.getItem("token");

        try {
            const res = await axios.put(
                `http://localhost:8080/api/tasks/${taskId}`,
                { status: newStatus },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            // Update tasks state directly
            setTasks(prevTasks =>
                prevTasks.map(task =>
                    task._id === taskId ? { ...task, status: newStatus } : task
                )
            );

            console.log("✅ Task status updated:", res.data.task.status);
        } catch (err) {
            console.error("❌ Failed to update task status:", err);
        }
    };

    useEffect(() => {
        fetchData();
    }, [id]);

    if (loading) return <div className="p-6">Loading...</div>;
    if (error) return <div className="p-6 text-red-500">{error}</div>;

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="max-w-5xl mx-auto">
                {/* Full Project Card */}
                <div className="bg-white rounded-xl shadow-md p-6 border border-blue-200">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="text-3xl font-bold text-blue-600">{project.title}</h1>
                        <Link
                            to="/dashboard"
                            className="text-sm text-blue-500 underline"
                        >
                            ← Back to Dashboard
                        </Link>
                    </div>
                    <p className="text-sm text-gray-500 mb-6">
                        Created at:{" "}
                        <span className="font-medium text-gray-700">
                            {new Date(project.createdAt).toLocaleString()}
                        </span>
                    </p>

                    {/* Description */}
                    <p className="text-gray-700 mb-6 text-base">
                        {project.description || "No description provided for this project."}
                    </p>

                    {/* Tasks */}
                    <h2 className="text-xl font-semibold mb-4">Tasks</h2>

                    {tasks.length === 0 ? (
                        <p className="text-gray-500 italic">No tasks found. Start by adding one!</p>
                    ) : (
                        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
                            {tasks.map((task) => (
                                <div
                                    key={task._id}
                                    className="bg-gray-100 rounded-lg p-4 border-l-4 border-blue-400 shadow-sm"
                                >
                                    <div className="flex justify-between items-center mb-1">
                                        <h3 className="text-md font-semibold text-gray-800">{task.title}</h3>
                                       
                                            <Select
                                                value={task.status}
                                                onChange={(e) => handleStatusChange(task._id, e.target.value)}
                                                size="small"
                                                sx={{ minWidth: 140}}

                                            >
                                                <MenuItem value="Pending">Pending🕓</MenuItem>
                                                <MenuItem value="In Progress">In Progress🔁</MenuItem>
                                                <MenuItem value="Completed">Completed✅</MenuItem>
                                            </Select>
                                      

                                    </div>
                                    <p className="text-sm text-gray-600">
                                        {task.description || "No description."}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}

                </div>
                {/* Toggle Button */}
                <div className="pt-4 flex justify-end">
                    <Button
                        onClick={() => setShowForm(!showForm)}
                        variant="contained"
                        color={showForm ? "error" : "primary"}
                        sx={{ mb: 2 }}
                    >
                        {showForm ? "Cancel" : "+ Add New Task"}
                    </Button>
                </div>

                {showForm && (
                    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-6 grid gap-4">
                        <TextField
                            label="Task Title"
                            name="title"
                            variant="outlined"
                            fullWidth
                            required
                            value={formData.title}
                            onChange={handleChange}
                        />
                        <TextField
                            label="Description"
                            name="description"
                            multiline
                            rows={3}
                            variant="outlined"
                            fullWidth
                            value={formData.description}
                            onChange={handleChange}
                        />

                        <Select
                            label="Status"
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            fullWidth
                        >
                            <MenuItem value="Pending">Pending</MenuItem>
                            <MenuItem value="In-progress">In Progress</MenuItem>
                            <MenuItem value="Completed">Completed</MenuItem>
                        </Select>
                        <div className="flex justify-end">
                            <Button type="submit" variant="contained" color="success"  >
                                Create Task
                            </Button>
                        </div>
                    </form>
                )}
            </div>

        </div>
    );
};

export default ProjectDetails;