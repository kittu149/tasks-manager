// src/components/AddTaskDialog.jsx
import { useState, useEffect } from "react";
import {
  Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button, MenuItem, FormControlLabel, Switch
} from "@mui/material";

import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebase";
import { autoClassify } from "../algo/autoClassify";

export default function AddTaskDialog({ open, onClose, defaults = {} }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState(defaults.deadline || "");
  const [priority, setPriority] = useState(defaults.priority || 3);
  const [liking, setLiking] = useState(defaults.liking || 3);
  const [estimatedTime, setEstimatedTime] = useState(defaults.estimatedTime || "");
  const [type, setType] = useState(defaults.type || "other");
  const [setDateVisible, setSetDateVisible] = useState(!!defaults.deadline);
  const [auto, setAuto] = useState(defaults.auto !== false);

  useEffect(() => {
    if (open) {
      setTitle("");
      setDescription("");
      setDeadline(defaults.deadline || "");
      setPriority(defaults.priority || 3);
      setLiking(defaults.liking || 3);
      setEstimatedTime(defaults.estimatedTime || "");
      setType(defaults.type || "other");
      setSetDateVisible(!!defaults.deadline);
      setAuto(defaults.auto !== false);
    }
  }, [open, defaults]);

  const handleAdd = async () => {
    const payload = {
      title,
      description,
      deadline: setDateVisible ? deadline : null,
      priority: Number(priority),
      liking: Number(liking),
      estimatedTime: estimatedTime ? Number(estimatedTime) : null,
      subtasks: defaults.subtasks || [],
      type,
      completed: false,
      createdAt: new Date(),
      auto: !!auto,
    };

    // If auto classification allowed, run classifier to set type
    if (auto) {
      payload.type = autoClassify(payload);
    }

    try {
      await addDoc(collection(db, "tasks"), payload);
    } catch (e) {
      console.error("Add task failed", e);
    }

    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Add Task</DialogTitle>
      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
        <TextField label="Title" value={title} onChange={(e)=>setTitle(e.target.value)} fullWidth margin="normal" />
        <TextField label="Short description" value={description} onChange={(e)=>setDescription(e.target.value)} fullWidth multiline rows={2} margin="normal" />

        <FormControlLabel control={<Switch checked={setDateVisible} onChange={(e)=>setSetDateVisible(e.target.checked)} />} label="Set date" />
        {setDateVisible && <TextField label="Date" type="date" InputLabelProps={{ shrink: true }} value={deadline} onChange={(e)=>setDeadline(e.target.value)} fullWidth margin="normal" />}

        <TextField label="Type" select value={type} onChange={(e)=>setType(e.target.value)} fullWidth margin="normal">
          <MenuItem value="micro">Micro</MenuItem>
          <MenuItem value="today">Today</MenuItem>
          <MenuItem value="project">Project</MenuItem>
          <MenuItem value="other">Other</MenuItem>
        </TextField>

        <TextField label="Estimated Time (minutes)" type="number" value={estimatedTime} onChange={(e)=>setEstimatedTime(e.target.value)} fullWidth margin="normal" />
        <TextField label="Priority (1-5)" type="number" value={priority} onChange={(e)=>setPriority(e.target.value)} fullWidth margin="normal" />
        <TextField label="Liking (1-5)" type="number" value={liking} onChange={(e)=>setLiking(e.target.value)} fullWidth margin="normal" />

        <FormControlLabel control={<Switch checked={auto} onChange={(e)=>setAuto(e.target.checked)} />} label="Auto-classify this task" />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleAdd} disabled={!title.trim()}>Add</Button>
      </DialogActions>
    </Dialog>
  );
}
