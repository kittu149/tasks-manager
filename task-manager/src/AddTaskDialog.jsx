import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
} from "@mui/material";

export default function AddTaskDialog({ open, onClose, onAdd }) {
  const [title, setTitle] = useState("");
  const [deadline, setDeadline] = useState("");
  const [priority, setPriority] = useState("");
  const [liking, setLiking] = useState("");
  const [estimatedTime, setEstimatedTime] = useState("");

  const handleAdd = () => {
    onAdd({
      title,
      deadline,
      priority: Number(priority),
      liking: Number(liking),
      estimatedTime: Number(estimatedTime),
      subtasks: [],
      createdAt: new Date(),
    });

    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add New Task</DialogTitle>

      <DialogContent
        sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
      >
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
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleAdd}>
          Add Task
        </Button>
      </DialogActions>
    </Dialog>
  );
}
