import { useEffect, useState } from "react";
import { Container, Typography, Button } from "@mui/material";
import { collection, onSnapshot, updateDoc, doc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase";
import TaskList from "../components/TaskList";
import AddMicroTaskDialog from "../components/micro/AddMicroTaskDialog";
import EditMicroTaskDialog from "../components/micro/EditMicroTaskDialog";
import SortMicroTasksDialog from "../components/micro/SortMicroTasksDialog";
import { sortTasks } from "../algo/scheduler";

export default function MicroTasks() {
  const [all, setAll] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [openSort, setOpenSort] = useState(false);

  useEffect(() => {
    const q = collection(db, "tasks");
    const unsub = onSnapshot(q, snap => {
      const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setAll(docs);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    const filtered = all.filter(t => (t.type === "micro") || (t.estimatedTime && Number(t.estimatedTime) <= 10) || (t.deadline === today && t.type === "micro"));
    setTasks(sortTasks(filtered));
  }, [all]);

  async function onToggleComplete(t) {
    await updateDoc(doc(db, "tasks", t.id), { completed: !t.completed });
  }

  async function onDelete(t) {
    try {
      await deleteDoc(doc(db, "tasks", t.id));
    } catch (e) { console.error(e); }
  }

  return (
    <Container sx={{ mt: 10 }}>
      <Typography variant="h5">Micro Tasks</Typography>
      <Button variant="contained" sx={{ my: 2, mr: 1 }} onClick={() => setOpenAdd(true)}>Add Micro Task</Button>
      <Button variant="outlined" sx={{ my: 2 }} onClick={() => setOpenSort(true)}>Sort</Button>

      <TaskList tasks={tasks} onToggleComplete={onToggleComplete} onEdit={(t)=>{ setEditTask(t); setOpenEdit(true); }} onDelete={onDelete} onDragEnd={async (newOrder) => {
        // persist manual rank if user drags
        for (let i = 0; i < newOrder.length; i++) {
          const it = newOrder[i];
          await updateDoc(doc(db, "tasks", it.id), { manualRank: i });
        }
      }} />

      <AddMicroTaskDialog open={openAdd} onClose={() => setOpenAdd(false)} />
      <EditMicroTaskDialog open={openEdit} onClose={() => setOpenEdit(false)} task={editTask} />
      <SortMicroTasksDialog open={openSort} onClose={() => setOpenSort(false)} tasks={tasks} />
    </Container>
  );
}
