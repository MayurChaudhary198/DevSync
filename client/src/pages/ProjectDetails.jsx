/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "../axios"; 
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import TaskModal from "../components/TaskModal";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { CSVLink } from "react-csv";

const ProjectDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // All states needed for the page
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const csvData = tasks.map((task) => ({
    Title: task.title,
    Description: task.description || "No description",
    Status: task.status,
    AssignedTo: task.assignedTo?.email || "Unassigned",
    CreatedAt: new Date(task.createdAt).toLocaleString(),
  }));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "Pending",
  });

  const [openModal, setOpenModal] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);

  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteMsg, setInviteMsg] = useState("");

  const [dashboard, setDashboard] = useState(null);

  const [summary, setSummary] = useState("");
  const [generating, setGenerating] = useState(false);

  // AI summary from OpenRouter API
  const handleGenerateSummary = async () => {
    const token = localStorage.getItem("token");
    if (!tasks || tasks.length === 0) {
      toast.error("No tasks available to summarize.");
      return;
    }

    setGenerating(true);
    try {
      const res = await axios.post(
        `http://localhost:8080/api/projects/${id}/summary`,
        { tasks },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setSummary(res.data.summary);
      toast.success("AI Summary generated!");
    } catch (err) {
      toast.error("Failed to generate summary.");
      console.error("AI Summary Error:", err);
    } finally {
      setGenerating(false);
    }
  };

  // Fetch project and its tasks
  const fetchData = async () => {
    const token = localStorage.getItem("token");
    try {
      const projectRes = await axios.get(
        `http://localhost:8080/api/projects/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setProject(projectRes.data.project);
    } catch (err) {
      console.error("Project fetch error:", err);
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
      console.warn("⚠️ Tasks not found or error:", err);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch dashboard counts like total, pending, etc.
  const fetchDashboard = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get(
        `http://localhost:8080/api/projects/${id}/dashboard`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setDashboard(res.data);
    } catch (err) {
      console.error("❌ Failed to fetch dashboard:", err);
    }
  };

  // Handle task creation form submission
  const fetchTasks = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get(`http://localhost:8080/api/tasks/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTasks(res.data.tasks);
    } catch (err) {
      console.error("❌ Failed to fetch tasks:", err);
    }
  };

  // Delete the project
  const handleDeleteProject = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this project?"
    );
    if (!confirmDelete) return;

    const token = localStorage.getItem("token");

    try {
      await axios.delete(`http://localhost:8080/api/projects/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Project Deleted successfully!");
      navigate("/dashboard");
    } catch (err) {
      console.error("❌ Failed to delete project:", err);
      toast.error("Failed to delete project. Try again.");
      alert("Something went wrong while deleting project.");
    }
  };

  // Invite a team member to this project
  const handleInvite = async () => {
    const token = localStorage.getItem("token");

    if (!inviteEmail.trim()) {
      toast.error("Email is required to invite");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(inviteEmail)) {
      toast.error("Invalid email format");
      return;
    }

    try {
      const res = await axios.post(
        `http://localhost:8080/api/projects/${id}/invite`,
        { email: inviteEmail },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("🎉 User invited successfully!");
      setInviteEmail("");
      fetchData();
    } catch (err) {
      const msg = err.response?.data?.message || "Unknown error";
      toast.error("❌ Invitation failed: " + msg);
    }
  };

  useEffect(() => {
    fetchData();
    fetchDashboard();
  }, [id]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Handle task creation form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!formData.title.trim()) {
      toast.error("Task title is required");
      return;
    }

    if (!["Pending", "In-progress", "Completed"].includes(formData.status)) {
      toast.error("Please select a valid status");
      return;
    }

    try {
      await axios.post(
        "http://localhost:8080/api/tasks",
        {
          ...formData,
          projectId: id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setFormData({ title: "", description: "", status: "Pending" });
      toast.success("Task created sucessfully!");
      setShowForm(false);
      fetchTasks();
    } catch (err) {
      console.error("❌ Failed to create task:", err);
      toast.error("Failed to create task.");
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-xl shadow-md p-6 border border-blue-300">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold text-blue-600">
              {project.title}
            </h1>
            <Link to="/dashboard" className="text-sm text-blue-500 underline">
              ← Back to Dashboard
            </Link>
          </div>

          <p className="text-sm text-gray-500 mb-6">
            Created at:{" "}
            <span className="font-medium text-gray-700">
              {new Date(project.createdAt).toLocaleString()}
            </span>
          </p>

          <p className="text-gray-700 mb-6 text-base">
            {project.description || "No description provided for this project."}
          </p>

          {/* Project Dashboard Summary */}
          {dashboard && (
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 my-6 text-center">
              <div className="bg-blue-100 p-4 rounded-lg shadow">
                <h3 className="text-sm text-gray-600">Total Tasks</h3>
                <p className="text-xl font-bold text-blue-700">
                  {dashboard.totalTasks}
                </p>
              </div>
              <div className="bg-yellow-100 p-4 rounded-lg shadow">
                <h3 className="text-sm text-gray-600">Pending</h3>
                <p className="text-xl font-bold text-yellow-700">
                  {dashboard.pending}
                </p>
              </div>
              <div className="bg-blue-200 p-4 rounded-lg shadow">
                <h3 className="text-sm text-gray-600">In Progress</h3>
                <p className="text-xl font-bold text-blue-800">
                  {dashboard.inProgress}
                </p>
              </div>
              <div className="bg-green-100 p-4 rounded-lg shadow">
                <h3 className="text-sm text-gray-600">Completed</h3>
                <p className="text-xl font-bold text-green-700">
                  {dashboard.completed}
                </p>
              </div>
            </div>
          )}

          {/* Tasks */}

          <h2 className="text-xl font-semibold mb-4">Tasks</h2>

          {tasks.length === 0 ? (
            <p className="text-gray-500 italic">
              No tasks found. Start by adding one!
            </p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
              {tasks.map((task) => (
                <div
                  key={task._id}
                  className="bg-gray-100 rounded-lg p-4 border-l-4 border-blue-400 shadow-sm cursor-pointer"
                  onClick={() => {
                    setSelectedTaskId(task._id);
                    setOpenModal(true);
                  }}
                >
                  <div className="flex justify-between items-center mb-1">
                    <h3 className="text-md font-semibold text-gray-800">
                      {task.title}
                    </h3>
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full ${
                        task.status === "Pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : task.status === "In Progress"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {task.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {task.description || "No description."}
                  </p>
                  {task.assignedTo && (
                    <p className="text-xs text-gray-500 mt-1">
                      Assigned to:{" "}
                      {task.assignedTo.name || task.assignedTo.email}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Team Members */}
        <div className="my-6 bg-white rounded shadow p-4">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Invite a Team Member
          </h3>
          <div className="flex items-center gap-2">
            <input
              type="email"
              placeholder="Enter user's email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              className="border px-3 py-2 rounded w-full"
            />
            <button
              onClick={handleInvite}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Invite
            </button>
          </div>
          {inviteMsg && (
            <p className="text-sm mt- ̰2 text-green-600">{inviteMsg}</p>
          )}
        </div>

        <div className="mt-4">
          <h3 className="text-md font-semibold mb-2">Team Members</h3>
          <ul className="list-disc pl-6 text-sm text-gray-700">
            {project.teamMembers.map((member) => (
              <li key={member._id}>{member.name || member.email}</li>
            ))}
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 flex justify-end gap-2">
          <CSVLink
            data={csvData}
            filename={`${project.title.replace(/\s+/g, "_")}_tasks.csv`}
            className="bg-green-600 hover:bg-green-700 text-white h-9 px-4 py-2 rounded text-sm ml-2"
          >
            ⬇ Export Tasks as CSV
          </CSVLink>

          <button
            onClick={handleGenerateSummary}
            className="bg-purple-600 text-white px-4 py-2 h-9 rounded hover:bg-purple-700 text-sm"
          >
            {generating ? "Generating..." : "🧠 Generate AI Summary"}
          </button>

          <Button
            onClick={() => setShowForm(!showForm)}
            variant="contained"
            color={showForm ? "error" : "primary"}
            sx={{ mb: 2 }}
          >
            {showForm ? "Cancel" : "+ Add New Task"}
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={handleDeleteProject}
            className="mt-4"
            size="small"
            sx={{ mb: 2 }}
          >
            Delete Project
          </Button>
        </div>

        {/* AI Summary Box */}
        {summary && (
          <div className="bg-white border-l-4 border-purple-500 shadow p-4 my-6 rounded-md">
            <h2 className="text-lg font-semibold text-purple-700 mb-2">
              🧠 Project Summary
            </h2>
            <p className="text-gray-700 whitespace-pre-line text-sm leading-relaxed">
              {summary}
            </p>
          </div>
        )}


        {/* Create Task Form */}
        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="bg-white p-4 rounded shadow mb-6 grid gap-4"
          >
            <TextField
              label="Task Title"
              name="title"
              variant="outlined"
              fullWidth
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
              name="status"
              value={formData.status}
              onChange={handleChange}
              fullWidth
            >
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="In Progress">In Progress</MenuItem>
              <MenuItem value="Completed">Completed</MenuItem>
            </Select>
            <div className="flex justify-end">
              <Button type="submit" variant="contained" color="success">
                Create Task
              </Button>
            </div>
          </form>
        )}

        {/* Task Modal */}
        <TaskModal
          open={openModal}
          onClose={() => setOpenModal(false)}
          taskId={selectedTaskId}
          onUpdate={fetchTasks}
          teamMembers={project.teamMembers}
        />
      </div>
    </div>
  );
};

export default ProjectDetails;
