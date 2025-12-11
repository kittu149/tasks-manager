import { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button, Box, IconButton, Checkbox } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { updateDoc, doc } from "firebase/firestore";
import { db } from "../../firebase";
import { autoClassify } from "../../algo/autoClassify";

export default function EditAllTaskDialog({ open, onClose, task }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [estimatedTime, setEstimatedTime] = useState("");
  const [subtasks, setSubtasks] = useState([]);
  const [priority, setPriority] = useState(3);
  const [liking, setLiking] = useState(3);
  const [auto, setAuto] = useState(true);

  useEffect(() => {
    if (task) {
      setTitle(task.title || "");
      setDescription(task.description || "");
      setDeadline(task.deadline || "");
      setEstimatedTime(task.estimatedTime || "");
      setSubtasks(task.subtasks ? [...task.subtasks] : []);
      setPriority(task.priority || 3);
      setLiking(task.liking || 3);
      setAuto(task.auto !== false);
    }
  }, [task]);

  function addSub() { setSubtasks([...subtasks, { title: "", time:10, completed:false }]); }
  function updateSub(i,k,v){ const c=[...subtasks]; c[i][k]=v; setSubtasks(c); }
  function removeSub(i){ setSubtasks(subtasks.filter((_,idx)=>idx!==i)); }
  function toggleSub(i){ const c=[...subtasks]; c[i].completed = !c[i].completed; setSubtasks(c); }

  async function save() {
    const payload = {
      title: title.trim(),
      description: description.trim(),
      deadline: deadline || null,
      estimatedTime: estimatedTime ? Number(estimatedTime) : null,
      subtasks,
      priority: Number(priority),
      liking: Number(liking),
      auto: !!auto,
    };
    if (auto) payload.type = autoClassify(payload);
    try { await updateDoc(doc(db,"tasks",task.id), payload); } catch (e) { console.error(e); }
    onClose();
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Edit Task</DialogTitle>
      <DialogContent sx={{ display:"flex", flexDirection:"column", gap:2, mt:1 }}>
        <TextField label="Title" value={title} onChange={(e)=>setTitle(e.target.value)} fullWidth margin="normal" />
        <TextField label="Description" value={description} onChange={(e)=>setDescription(e.target.value)} fullWidth multiline rows={2} margin="normal" />
        <TextField label="Date" type="date" InputLabelProps={{ shrink: true }} value={deadline||""} onChange={(e)=>setDeadline(e.target.value)} fullWidth margin="normal" />
        <TextField label="Estimated Time (min)" type="number" value={estimatedTime||""} onChange={(e)=>setEstimatedTime(e.target.value)} fullWidth margin="normal" />
        <Box><Button variant="outlined" onClick={addSub} sx={{ mb:1 }}>Add Subtask</Button></Box>
        {subtasks.map((st, i) => (
          <Box key={i} sx={{ display:"flex", gap:1, alignItems:"center", mb:1 }}>
            <Checkbox checked={!!st.completed} onChange={()=>toggleSub(i)} />
            <TextField value={st.title} onChange={(e)=>updateSub(i,"title",e.target.value)} fullWidth />
            <TextField type="number" value={st.time} onChange={(e)=>updateSub(i,"time",Number(e.target.value))} sx={{ width:110 }} />
            <IconButton onClick={()=>removeSub(i)}><DeleteIcon /></IconButton>
          </Box>
        ))}
        <TextField label="Priority (1-5)" type="number" value={priority} onChange={(e)=>setPriority(e.target.value)} fullWidth margin="normal" />
        <TextField label="Liking (1-5)" type="number" value={liking} onChange={(e)=>setLiking(e.target.value)} fullWidth margin="normal" />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={save}>Save</Button>
      </DialogActions>
    </Dialog>
  );
}
