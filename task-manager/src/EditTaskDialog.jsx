import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  IconButton,
  Checkbox,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";

export default function EditTaskDialog({ open, onClose, task, onUpdate }) {
  const [title, setTitle] = useState("");
  const [deadline, setDeadline] = useState("");
  const [priority, setPriority] = useState("");
  const [liking, setLiking] = useState("");
  const [estimatedTime, setEstimatedTime] = useState("");

  // ⭐ Subtasks
  const [subtasks, setSubtasks] = useState([]);

  // Load values when opening dialog
  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDeadline(task.deadline);
      setPriority(task.priority);
      setLiking(task.liking);
      setEstimatedTime(task.estimatedTime);
      setSubtasks(task.subtasks || []);
    }
  }, [task]);

  // ➕ Add subtask
  function addSubtask() {
    setSubtasks([...subtasks, { title: "", completed: false, time: 0 }]);
  }

  // ✏️ Edit subtask title
  function updateSubtaskTitle(index, newTitle) {
    const newList = [...subtasks];
    newList[index].title = newTitle;
    setSubtasks(newList);
  }

  // ⏱ Edit subtask time
  function updateSubtaskTime(index, newTime) {
    const newList = [...subtasks];
    newList[index].time = Number(newTime);
    setSubtasks(newList);
  }

  // ✔ Toggle completion
  function toggleSubtask(index) {
    const newList = [...subtasks];
    newList[index].completed = !newList[index].completed;
    setSubtasks(newList);
  }

  // ❌ Delete subtask
  function deleteSubtask(index) {
    const newList = subtasks.filter((_, i) => i !== index);
    setSubtasks(newList);
  }

  // SAVE EDITS
  const handleUpdate = () => {
    onUpdate(task.id, {
      title,
      deadline,
      priority: Number(priority),
      liking: Number(liking),
      estimatedTime: Number(estimatedTime),
      subtasks,
    });

    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit Task</DialogTitle>

      <DialogContent
        sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
      >
        {/* Main task fields */}
        <TextField
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          fullWidth
          margin="normal"
        />

        <TextField
          label="Deadline"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          fullWidth
          margin="normal"
        />

        <TextField
          label="Priority (1–5)"
          type="number"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          fullWidth
          margin="normal"
        />

        <TextField
          label="Liking (1–5)"
          type="number"
          value={liking}
          onChange={(e) => setLiking(e.target.value)}
          fullWidth
          margin="normal"
        />

        <TextField
          label="Estimated Time (minutes)"
          type="number"
          value={estimatedTime}
          onChange={(e) => setEstimatedTime(e.target.value)}
          fullWidth
          margin="normal"
        />

        {/* ----------------------- */}
        {/* ⭐ SUBTASK SECTION     */}
        {/* ----------------------- */}
        <Button variant="outlined" onClick={addSubtask} sx={{ mt: 2 }}>
          Add Subtask
        </Button>

        {subtasks.map((st, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginTop: "10px",
            }}
          >
            <Checkbox
              checked={st.completed}
              onChange={() => toggleSubtask(index)}
            />

            <TextField
              label="Subtask Title"
              value={st.title}
              onChange={(e) => updateSubtaskTitle(index, e.target.value)}
              fullWidth
            />

            <TextField
              label="Time (min)"
              type="number"
              value={st.time}
              onChange={(e) => updateSubtaskTime(index, e.target.value)}
              sx={{ width: "100px" }}
            />

            <IconButton onClick={() => deleteSubtask(index)}>
              <DeleteIcon />
            </IconButton>
          </div>
        ))}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleUpdate}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
