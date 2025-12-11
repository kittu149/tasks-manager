// src/components/EditTaskDialog.jsx
import { useState, useEffect } from "react";
import {
  Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button, IconButton, Checkbox, Box, FormControlLabel, Switch
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

import { updateDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import { autoClassify } from "../algo/autoClassify";

export default function EditTaskDialog({ open, onClose, task }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [priority, setPriority] = useState(3);
  const [liking, setLiking] = useState(3);
  const [estimatedTime, setEstimatedTime] = useState("");
  const [subtasks, setSubtasks] = useState([]);
  const [auto, setAuto] = useState(true);
  const [type, setType] = useState("other");

  useEffect(() => {
    if (task) {
      setTitle(task.title || "");
      setDescription(task.description || "");
      setDeadline(task.deadline || "");
      setPriority(task.priority || 3);
      setLiking(task.liking || 3);
      setEstimatedTime(task.estimatedTime || "");
      setSubtasks(task.subtasks ? [...task.subtasks] : []);
      setAuto(task.auto !== false);
      setType(task.type || "other");
    }
  }, [task]);

  function addSubtask() {
    setSubtasks([...subtasks, { title: "", time: 5, completed: false }]);
  }

  function updateSubtask(i, key, value) {
    const copy = [...subtasks];
    copy[i][key] = value;
    setSubtasks(copy);
  }

  function removeSubtask(i) {
    setSubtasks(subtasks.filter((_, idx) => idx !== i));
  }

  function toggleSub(i) {
    const copy = [...subtasks];
    copy[i].completed = !copy[i].completed;
    setSubtasks(copy);
  }

  const save = async () => {
    const payload = {
      title,
      description,
      deadline: deadline || null,
      priority: Number(priority),
      liking: Number(liking),
      estimatedTime: estimatedTime ? Number(estimatedTime) : null,
      subtasks,
      auto: !!auto,
      type,
    };

    // If auto classification allowed, recompute type
    if (auto) {
      payload.type = autoClassify(payload);
    }

    try {
      await updateDoc(doc(db, "tasks", task.id), payload);
    } catch (e) {
      console.error("Failed to update task", e);
    }

    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Edit Task</DialogTitle>
      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
        <TextField label="Title" value={title} onChange={(e)=>setTitle(e.target.value)} fullWidth margin="normal" />
        <TextField label="Description" value={description} onChange={(e)=>setDescription(e.target.value)} fullWidth multiline rows={2} margin="normal" />
        <TextField label="Date" type="date" InputLabelProps={{ shrink: true }} value={deadline || ""} onChange={(e)=>setDeadline(e.target.value)} fullWidth margin="normal" />
        <TextField label="Estimated Time (minutes)" type="number" value={estimatedTime || ""} onChange={(e)=>setEstimatedTime(e.target.value)} fullWidth margin="normal" />
        <TextField label="Priority (1-5)" type="number" value={priority} onChange={(e)=>setPriority(e.target.value)} fullWidth margin="normal" />
        <TextField label="Liking (1-5)" type="number" value={liking} onChange={(e)=>setLiking(e.target.value)} fullWidth margin="normal" />

        <FormControlLabel control={<Switch checked={auto} onChange={(e)=>setAuto(e.target.checked)} />} label="Allow auto-classify" />

        <Box sx={{ mt: 1 }}>
          <Button variant="outlined" onClick={addSubtask}>Add Subtask</Button>
        </Box>

        {subtasks.map((st, idx) => (
          <Box key={idx} sx={{ display: "flex", gap: 1, alignItems: "center", mt: 1 }}>
            <Checkbox checked={!!st.completed} onChange={()=>toggleSub(idx)} />
            <TextField label="Subtask title" value={st.title} onChange={(e)=>updateSubtask(idx, "title", e.target.value)} fullWidth />
            <TextField label="Time (min)" type="number" value={st.time} onChange={(e)=>updateSubtask(idx, "time", Number(e.target.value))} sx={{ width: 120 }} />
            <IconButton onClick={()=>removeSubtask(idx)}><DeleteIcon /></IconButton>
          </Box>
        ))}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={save}>Save</Button>
      </DialogActions>
    </Dialog>
  );
}
