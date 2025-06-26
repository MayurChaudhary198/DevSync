import { useEffect, useState } from "react";
import axios from "../axios"; 
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { toast } from "react-toastify";

const TaskModal = ({ open, onClose, taskId, onUpdate, teamMembers  }) => {
    const [taskData, setTaskData] = useState({
        title: "",
        description: "",
        status: "Pending",
        assignedTo: "",
    });
    const [loading, setLoading] = useState(false);

    // Fetch the task when modal opens
    useEffect(() => {
        const fetchTask = async () => {
            if (!taskId) return;

            const token = localStorage.getItem("token");
            try {
                const res = await axios.get(`http://localhost:8080/api/tasks/single/${taskId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const { title, description, status } = res.data.task;
                setTaskData({ title, description, status });
            } catch (err) {
                console.error("Error fetching task:", err);
            }
        };

        if (open) fetchTask();
    }, [open, taskId]);

    const handleChange = (e) => {
        setTaskData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleUpdate = async () => {
        const token = localStorage.getItem("token");

        try {
            setLoading(true);
            await axios.put(
                `http://localhost:8080/api/tasks/${taskId}`,
                taskData,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            toast.success("Task updated!");
            onClose();
            onUpdate();
        } catch (err) {
            console.error(" Failed to update task:", err);
            toast.error("Failed to update task");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        const confirm = window.confirm("Are you sure you want to delete this task?");
        if (!confirm) return;

        const token = localStorage.getItem("token");
        try {
            setLoading(true);
            await axios.delete(`http://localhost:8080/api/tasks/${taskId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            toast.success("Task Deleted Sucessfully!");
            onClose();      
            onUpdate();     
        } catch (err) {
            console.error("❌ Failed to delete task:", err);
            toast.success("Failed to delete task");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle className="text-blue-600 font-semibold">Update Task</DialogTitle>

            <DialogContent className="space-y-4 mt-2 ">
                <TextField
                    autoFocus
                    label="Title"
                    name="title"
                    value={taskData.title || ""}
                    onChange={handleChange}
                    fullWidth
                    sx={{
                        marginTop: 2
                    }}

                />
                <TextField
                    label="Description"
                    name="description"
                    value={taskData.description || ""}
                    onChange={handleChange}
                    fullWidth
                    multiline
                    rows={3}


                />
                <Select
                    name="status"
                    value={taskData.status || "Pending"}
                    onChange={handleChange}
                    fullWidth
                >
                    <MenuItem value="Pending">Pending</MenuItem>
                    <MenuItem value="In Progress">In Progress</MenuItem>
                    <MenuItem value="Completed">Completed</MenuItem>
                </Select>

                <Select
                    name="assignedTo"
                    value={taskData.assignedTo}
                    onChange={handleChange}
                    displayEmpty
                    fullWidth
                >
                    <MenuItem value="">Unassigned</MenuItem>
                    {teamMembers?.map((member) => (
                        <MenuItem key={member._id} value={member._id}>
                            {member.name || member.email}
                        </MenuItem>
                    ))}
                </Select>
            </DialogContent>

            <DialogActions>
                <div className="flex justify-between mt-4 gap-2">
                    <Button onClick={onClose} color="inherit">
                        Cancel
                    </Button>
                    <Button onClick={handleUpdate} variant="contained" disabled={loading}>
                        {loading ? "Updating..." : "Update"}
                    </Button>
                    <Button
                        variant="outlined"
                        color="error"
                        onClick={handleDelete}
                        disabled={loading}
                    >
                        Delete Task
                    </Button>
                </div>
            </DialogActions>
        </Dialog>
    );
};

export default TaskModal;