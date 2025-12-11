// src/pages/MicroTasks.jsx
import { useEffect, useState } from "react";
import { Container, Typography } from "@mui/material";
import { collection, onSnapshot, addDoc } from "firebase/firestore";
import { db } from "../firebase";
import TaskList from "../components/TaskList";
import AddTaskDialog from "../components/AddTaskDialog";

export default function MicroTasks() {
  const [tasks, setTasks] = useState([]);
  const [openAdd, setOpenAdd] = useState(false);

  useEffect(() => {
    const q = collection(db, "tasks");
    const unsub = onSnapshot(q, snap => {
      const all = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      const today = new Date().toISOString().slice(0,10);
      const filtered = all.filter(t => (t.type === "micro") || (t.estimatedTime && Number(t.estimatedTime) <= 10) || (t.deadline === today && t.type === "micro"));
      setTasks(filtered);
    });
    return () => unsub();
  }, []);

  // onAdd is handled by AddTaskDialog itself (it calls addDoc inside)
  return (
    <Container sx={{ mt: 10 }}>
      <Typography variant="h5">Micro Tasks</Typography>
      <TaskList tasks={tasks} />
      <AddTaskDialog open={openAdd} onClose={() => setOpenAdd(false)} defaults={{ type: "micro" }} />
    </Container>
  );
}
