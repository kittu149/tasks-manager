import { useState, useEffect } from "react";
import {
  Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button, Box, IconButton, Checkbox
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

import { updateDoc, doc } from "firebase/firestore";
import { db } from "../../firebase";
import { autoClassify } from "../../algo/autoClassify";

export default function EditMicroTaskDialog({ open, onClose, task }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [estimatedTime, setEstimatedTime] = useState("");
  const [subtasks, setSubtasks] = useState([]);
  const [deadline, setDeadline] = useState("");
  const [liking, setLiking] = useState(3);
  const [auto, setAuto] = useState(true);

  useEffect(() => {
    if (task) {
      setTitle(task.title || "");
      setDescription(task.description || "");
      setEstimatedTime(task.estimatedTime || "");
      setSubtasks(task.subtasks ? [...task.subtasks] : []);
      setDeadline(task.deadline || "");
      setLiking(task.liking || 3);
      setAuto(task.auto !== false);
    }
  }, [task]);

  function addSubtask() {
    setSubtasks([...subtasks, { title: "", time: 5, completed: false }]);
  }
  function updateSubtask(i, key, value) {
    const c = [...subtasks]; c[i] = { ...c[i], [key]: value }; setSubtasks(c);
  }
  function removeSubtask(i) {
    setSubtasks(subtasks.filter((_, idx) => idx !== i));
  }
  function toggleCompleted(i) {
    const c = [...subtasks]; c[i].completed = !c[i].completed; setSubtasks(c);
  }

  async function save() {
    const payload = {
      title: title.trim(),
      description: description.trim(),
      estimatedTime: estimatedTime ? Number(estimatedTime) : null,
      subtasks,
      deadline: deadline || null,
      liking: Number(liking || 3),
      auto: !!auto,
    };

    if (auto) payload.type = autoClassify({ ...payload, type: "micro" }) || "micro";
    else payload.type = "micro";

    try {
      await updateDoc(doc(db, "tasks", task.id), payload);
    } catch (e) {
      console.error("Failed to update micro task", e);
    }
    onClose();
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Edit Micro Task</DialogTitle>
      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
        <TextField label="Title" value={title} onChange={(e)=>setTitle(e.target.value)} fullWidth margin="normal" />
        <TextField label="Short description" value={description} onChange={(e)=>setDescription(e.target.value)} fullWidth multiline rows={2} margin="normal" />
        <TextField label="Estimated Time (min)" type="number" value={estimatedTime || ""} onChange={(e)=>setEstimatedTime(e.target.value)} fullWidth margin="normal" />
        <TextField label="Date (optional)" type="date" InputLabelProps={{ shrink: true }} value={deadline || ""} onChange={(e)=>setDeadline(e.target.value)} fullWidth margin="normal" />
        <TextField label="Liking (1-5)" type="number" value={liking} onChange={(e)=>setLiking(e.target.value)} fullWidth margin="normal" />

        <Box>
          <Button variant="outlined" onClick={addSubtask} sx={{ mb: 1 }}>Add Subtask</Button>
          {subtasks.map((st, i) => (
            <Box key={i} sx={{ display: "flex", gap: 1, alignItems: "center", mb: 1 }}>
              <Checkbox checked={!!st.completed} onChange={() => toggleCompleted(i)} />
              <TextField value={st.title} onChange={(e)=>updateSubtask(i, "title", e.target.value)} placeholder={`Subtask ${i+1}`} fullWidth />
              <TextField type="number" value={st.time} onChange={(e)=>updateSubtask(i, "time", Number(e.target.value))} sx={{ width: 110 }} />
              <IconButton onClick={() => removeSubtask(i)}><DeleteIcon /></IconButton>
            </Box>
          ))}
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={save}>Save</Button>
      </DialogActions>
    </Dialog>
  );
}
