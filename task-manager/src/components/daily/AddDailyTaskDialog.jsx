import { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button, Box } from "@mui/material";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../../firebase";
import { autoClassify } from "../../algo/autoClassify";
import Typography from "@mui/material/Typography";

export default function AddDailyTaskDialog({ open, onClose, defaults = {} }) {
  const todayISO = new Date().toISOString().slice(0, 10);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [estimatedTime, setEstimatedTime] = useState(defaults.estimatedTime || "");
  const [subtaskCount, setSubtaskCount] = useState(0);
  const [subtasks, setSubtasks] = useState([]);
  const [priority, setPriority] = useState(defaults.priority || 3);
  const [liking, setLiking] = useState(defaults.liking || 3);
  const [auto, setAuto] = useState(true);

  useEffect(() => {
    if (open) {
      setTitle(""); setDescription(""); setEstimatedTime(defaults.estimatedTime || ""); setSubtaskCount(0); setSubtasks([]); setPriority(defaults.priority || 3); setLiking(defaults.liking || 3); setAuto(true);
    }
  }, [open, defaults]);

  useEffect(() => {
    const count = Number(subtaskCount) || 0;
    const copy = [...subtasks];
    if (copy.length < count) {
      for (let i = copy.length; i < count; i++) copy.push({ title: "", time: Math.max(5, Number(estimatedTime) ? Math.round(Number(estimatedTime)/Math.max(1,count)) : 5), completed:false });
    } else if (copy.length > count) copy.length = count;
    setSubtasks(copy);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subtaskCount]);

  function updateSub(i, k, v) { const c = [...subtasks]; c[i][k] = v; setSubtasks(c); }
  function addSub() { setSubtasks([...subtasks, { title: "", time: 5, completed: false }]); setSubtaskCount(subtasks.length+1); }

  const handleAdd = async () => {
    const payload = {
      title: title.trim(),
      description: description.trim(),
      estimatedTime: estimatedTime ? Number(estimatedTime) : null,
      subtasks,
      deadline: todayISO, // fixed to today
      priority: Number(priority),
      liking: Number(liking),
      auto: !!auto,
      completed: false,
      createdAt: new Date()
    };
    if (auto) payload.type = autoClassify(payload);
    else payload.type = "today";

    try {
      await addDoc(collection(db, "tasks"), payload);
    } catch (e) { console.error(e); }
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Add Today's Task</DialogTitle>
      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
        <TextField label="Title" value={title} onChange={(e)=>setTitle(e.target.value)} fullWidth margin="normal" />
        <TextField label="Short description" value={description} onChange={(e)=>setDescription(e.target.value)} fullWidth multiline rows={2} margin="normal" />
        <TextField label="Estimated Time (min)" type="number" value={estimatedTime} onChange={(e)=>setEstimatedTime(e.target.value)} fullWidth margin="normal" />
        <TextField label="Number of subtasks" type="number" value={subtaskCount} onChange={(e)=>setSubtaskCount(e.target.value)} fullWidth margin="normal" />
        {subtasks.map((st, idx)=>(
          <Box key={idx} sx={{ display:"flex", gap:1, alignItems:"center" }}>
            <TextField value={st.title} onChange={(e)=>updateSub(idx,"title",e.target.value)} fullWidth />
            <TextField type="number" value={st.time} onChange={(e)=>updateSub(idx,"time",Number(e.target.value))} sx={{ width: 110 }} />
          </Box>
        ))}
        <Box sx={{ display:"flex", gap:1 }}>
          <Button variant="outlined" onClick={addSub}>Add Subtask</Button>
        </Box>
        <TextField label="Priority (1-5)" type="number" value={priority} onChange={(e)=>setPriority(e.target.value)} fullWidth margin="normal" />
        <TextField label="Liking (1-5)" type="number" value={liking} onChange={(e)=>setLiking(e.target.value)} fullWidth margin="normal" />
        <Typography variant="caption">Date is set to today: {todayISO}</Typography>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleAdd} disabled={!title.trim()}>Add</Button>
      </DialogActions>
    </Dialog>
  );
}
