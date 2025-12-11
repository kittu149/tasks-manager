import { useEffect, useState } from "react";
import { Container, Typography, Button } from "@mui/material";
import { collection, onSnapshot, updateDoc, doc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase";
import TaskList from "../components/TaskList";
import AddDailyTaskDialog from "../components/daily/AddDailyTaskDialog";
import EditDailyTaskDialog from "../components/daily/EditDailyTaskDialog";
import SortDailyTasksDialog from "../components/daily/SortDailyTasksDialog";
import { autoScheduleToday } from "../algo/autoScheduleToday";

export default function TodayTasks() {
  const [all, setAll] = useState([]);
  const [today, setToday] = useState([]);
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [openSort, setOpenSort] = useState(false);
  const [dailyMinutes] = useState(180);

  useEffect(() => {
    const q = collection(db, "tasks");
    const unsub = onSnapshot(q, snap => {
      setAll(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    setToday(autoScheduleToday(all, { dailyMinutes }));
  }, [all, dailyMinutes]);

  async function toggleComplete(t) {
    await updateDoc(doc(db, "tasks", t.id), { completed: !t.completed });
  }
  async function remove(t) {
    try { await deleteDoc(doc(db, "tasks", t.id)); } catch (e) { console.error(e); }
  }

  return (
    <Container sx={{ mt: 10 }}>
      <Typography variant="h5">Today's Tasks</Typography>
      <Button variant="contained" sx={{ my: 2, mr: 1 }} onClick={() => setOpenAdd(true)}>Add Today's Task</Button>
      <Button variant="outlined" sx={{ my: 2 }} onClick={() => setOpenSort(true)}>Sort</Button>

      <TaskList tasks={today} onToggleComplete={toggleComplete} onEdit={(t)=>{ setEditTask(t); setOpenEdit(true); }} onDelete={remove} onDragEnd={async (newOrder)=> {
        for (let i=0;i<newOrder.length;i++) await updateDoc(doc(db,"tasks", newOrder[i].id), { manualRank: i });
      }} />

      <AddDailyTaskDialog open={openAdd} onClose={() => setOpenAdd(false)} />
      <EditDailyTaskDialog open={openEdit} onClose={() => setOpenEdit(false)} task={editTask} />
      <SortDailyTasksDialog open={openSort} onClose={() => setOpenSort(false)} tasks={today} />
    </Container>
  );
}
