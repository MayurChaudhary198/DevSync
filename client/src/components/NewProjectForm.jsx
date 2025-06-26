import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const NewProjectForm = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({ title: "", description: "" });
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
     if (!formData.title.trim()) {
    toast.error("Project title is required");
    return;
  }

    try {
      await axios.post("http://localhost:8080/api/projects", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setFormData({ title: "", description: "" });
      toast.success("Project created successfully!");
      onSuccess();
      onClose();
    } catch (err) {
      console.error("Failed to create project:", err);
      setError("Unable to create project.");
      toast.error("Unable to create project.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-6 bg-white p-4 rounded-md shadow-md space-y-4"
    >
      {error && <p className="text-red-500 text-sm">{error}</p>}

      <input
        type="text"
        name="title"
        placeholder="Project Title"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        className="w-full border px-3 py-2 rounded"
      />
      <textarea
        name="description"
        placeholder="Project Description (optional)"
        value={formData.description}
        onChange={(e) =>
          setFormData({ ...formData, description: e.target.value })
        }
        className="w-full border px-3 py-2 rounded"
      />
      <div className="flex gap-2">
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded text-sm"
        >
          Create
        </button>
        <button
          type="button"
          className="text-sm text-gray-500"
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default NewProjectForm;
