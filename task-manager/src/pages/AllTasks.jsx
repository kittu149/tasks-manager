// src/pages/AllTasks.jsx
import { useEffect, useState } from "react";
import { Container, Typography, Button } from "@mui/material";
import { collection, onSnapshot, updateDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import TaskList from "../components/TaskList";
import { sortTasks } from "../algo/scheduler";
import SortTaskDialog from "../components/SortTaskDialog";
import AddTaskDialog from "../components/AddTaskDialog";
import EditTaskDialog from "../components/EditTaskDialog";

export default function AllTasks() {
  const [tasks, setTasks] = useState([]);
  const [openSort, setOpenSort] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [openEdit, setOpenEdit] = useState(false);

  useEffect(() => {
    const q = collection(db, "tasks");
    const unsub = onSnapshot(q, snap => {
      setTasks(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  const recommended = sortTasks(tasks);

  async function onDragEnd(newOrder) {
    // persist manualRank for manual ordering
    for (let i = 0; i < newOrder.length; i++) {
      const t = newOrder[i];
      try {
        await updateDoc(doc(db, "tasks", t.id), { manualRank: i });
      } catch (e) {
        console.error(e);
      }
    }
  }

  async function onToggleComplete(task) {
    await updateDoc(doc(db, "tasks", task.id), { completed: !task.completed });
  }

  return (
    <Container sx={{ mt: 10 }}>
      <Typography variant="h5">All Tasks</Typography>
      <Button variant="outlined" sx={{ mr: 1 }} onClick={() => setOpenSort(true)}>Sort</Button>
      <Button variant="contained" onClick={() => setOpenAdd(true)}>Add Task</Button>

      <TaskList tasks={recommended} onDragEnd={onDragEnd} onToggleComplete={onToggleComplete}
        onEdit={(t)=>{ setEditTask(t); setOpenEdit(true); }} onDelete={async (t)=>{ await updateDoc(doc(db,"tasks", t.id), { deleted: true }) }} />

      <SortTaskDialog open={openSort} onClose={() => setOpenSort(false)} tasks={tasks} />
      <AddTaskDialog open={openAdd} onClose={() => setOpenAdd(false)} defaults={{}} />
      <EditTaskDialog open={openEdit} onClose={() => setOpenEdit(false)} task={editTask} />
    </Container>
  );
}
