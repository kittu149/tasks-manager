import { useState, useEffect } from "react";
import {
  Dialog, DialogTitle, DialogContent, TextField, DialogActions,
  Button, FormControlLabel, Switch, Box
} from "@mui/material";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../../firebase";
import { autoClassify } from "../../algo/autoClassify";

export default function AddMicroTaskDialog({ open, onClose }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [estimatedTime, setEstimatedTime] = useState("");
  const [liking, setLiking] = useState(3);
  const [subtaskCount, setSubtaskCount] = useState(0);
  const [auto, setAuto] = useState(true);

  useEffect(() => {
    if (open) {
      setTitle("");
      setDescription("");
      setDeadline("");
      setEstimatedTime("");
      setLiking(3);
      setSubtaskCount(0);
      setAuto(true);
    }
  }, [open]);

  function buildSubtasks(count, defaultTime = 5) {
    const arr = [];
    for (let i = 0; i < count; i++) arr.push({ title: "", time: defaultTime, completed: false });
    return arr;
  }

  async function handleAdd() {
    if (!title.trim()) return;
    const payload = {
      title: title.trim(),
      description: description.trim() || "",
      deadline: deadline || null,
      estimatedTime: estimatedTime ? Number(estimatedTime) : null,
      liking: Number(liking),
      priority: null,
      subtasks: buildSubtasks(Number(subtaskCount || 0)),
      auto: !!auto,
      completed: false,
      createdAt: new Date(),
    };

    // force type via classifier (we won't ask user)
    if (payload.auto) payload.type = autoClassify(payload);
    else payload.type = "micro"; // if user turned off auto but using micro dialog, set micro

    try {
      await addDoc(collection(db, "tasks"), payload);
    } catch (e) {
      console.error("AddMicroTask failed", e);
    }

    onClose();
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Add Micro Task</DialogTitle>
      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
        <TextField label="Title" value={title} onChange={e=>setTitle(e.target.value)} fullWidth margin="normal" />
        <TextField label="Short description" value={description} onChange={e=>setDescription(e.target.value)} fullWidth multiline rows={2} margin="normal" />
        <TextField label="Estimated Time (min)" type="number" value={estimatedTime} onChange={e=>setEstimatedTime(e.target.value)} fullWidth margin="normal" />
        <TextField label="Number of subtasks" type="number" value={subtaskCount} onChange={e=>setSubtaskCount(e.target.value)} fullWidth margin="normal" />
        <TextField label="Date (optional)" type="date" InputLabelProps={{ shrink: true }} value={deadline} onChange={e=>setDeadline(e.target.value)} fullWidth margin="normal" />
        <TextField label="Liking (1-5)" type="number" value={liking} onChange={e=>setLiking(e.target.value)} fullWidth margin="normal" />
        <FormControlLabel control={<Switch checked={auto} onChange={e=>setAuto(e.target.checked)} />} label="Auto-classify this task" />
        <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
          <Button onClick={onClose}>Cancel</Button>
          <Button variant="contained" onClick={handleAdd} disabled={!title.trim()}>Add</Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
