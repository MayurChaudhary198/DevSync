import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "../axios"; 
import NewProjectForm from "../components/NewProjectForm";

const Dashboard = () => {
  const [myProjects, setMyProjects] = useState([]);
  const [sharedProjects, setSharedProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState("my");
  const [searchTerm, setSearchTerm] = useState("");

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:8080/api/projects", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMyProjects(res.data.myProjects || []);
      setSharedProjects(res.data.sharedProjects || []);
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

  const ProjectCard = ({ proj }) => (
    <Link to={`/projects/${proj._id}`}>
      <div className="border rounded-lg p-4 shadow-sm hover:shadow-lg transition cursor-pointer bg-white">
        <h2 className="text-lg font-semibold truncate">{proj.title}</h2>
        <p className="text-sm text-gray-600 mt-1 line-clamp-3">
          {proj.description || "No description provided."}
        </p>
        <p className="text-xs text-gray-400 mt-2">
          Created at: {new Date(proj.createdAt).toLocaleString()}
        </p>
      </div>
    </Link>
  );

  // Filtered list based on search
  const filteredMyProjects = myProjects.filter((p) =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const filteredSharedProjects = sharedProjects.filter((p) =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen flex justify-center">
      <div className="bg-white rounded-xl border border-blue-300 shadow-md shadow-blue-300 p-8 max-w-6xl w-full ">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-blue-600">DevSync Projects</h1>
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md text-sm transition"
            onClick={() => setShowForm(true)}
          >
            + New Project
          </button>
        </div>

        {showForm && (
          <NewProjectForm onClose={() => setShowForm(false)} onSuccess={fetchProjects} />
        )}

        {/* 🔍 Search + 📊 Stats */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <input
            type="text"
            placeholder="🔍 Search projects..."
            className="border px-4 py-2 rounded-md w-full md:w-1/2"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <div className="flex gap-4">
            <div className="bg-blue-100 text-blue-700 font-medium text-sm px-4 py-2 rounded">
              My: {myProjects.length}
            </div>
            <div className="bg-purple-100 text-purple-700 font-medium text-sm px-4 py-2 rounded">
              Shared: {sharedProjects.length}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-gray-100 rounded-md p-3 mb-8 flex space-x-6 max-w-md">
          <button
            className={`px-5 py-2 rounded-md font-semibold text-sm transition ${
              activeTab === "my"
                ? "border-b-4 border-blue-600 text-blue-600"
                : "text-gray-600 hover:text-gray-800"
            }`}
            onClick={() => setActiveTab("my")}
          >
            My Projects
          </button>
          <button
            className={`px-5 py-2 rounded-md font-semibold text-sm transition ${
              activeTab === "shared"
                ? "border-b-4 border-blue-600 text-blue-600"
                : "text-gray-600 hover:text-gray-800"
            }`}
            onClick={() => setActiveTab("shared")}
          >
            Shared With Me
          </button>
        </div>

        {/* Status messages */}
        {loading && <p className="text-center text-gray-600">Loading projects...</p>}
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        {!loading && activeTab === "my" && filteredMyProjects.length === 0 && (
          <p className="text-gray-500 mb-4">
            You haven’t created any projects yet.{" "}
            <button
              className="text-blue-600 underline"
              onClick={() => setShowForm(true)}
            >
              Create your first project!
            </button>
          </p>
        )}

        {!loading && activeTab === "shared" && filteredSharedProjects.length === 0 && (
          <p className="text-gray-500 mb-4">No shared projects found.</p>
        )}

        {/* Project Grid */}
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {activeTab === "my" &&
            filteredMyProjects.map((proj) => <ProjectCard key={proj._id} proj={proj} />)}

          {activeTab === "shared" &&
            filteredSharedProjects.map((proj) => <ProjectCard key={proj._id} proj={proj} />)}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;