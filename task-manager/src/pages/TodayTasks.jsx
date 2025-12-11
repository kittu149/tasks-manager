// src/pages/TodayTasks.jsx
import { useEffect, useState } from "react";
import { Container, Typography, Button } from "@mui/material";
import { collection, onSnapshot, updateDoc, doc, addDoc } from "firebase/firestore";
import { db } from "../firebase";
import TaskList from "../components/TaskList";
import AddTaskDialog from "../components/AddTaskDialog";
import EditTaskDialog from "../components/EditTaskDialog";
import { autoScheduleToday } from "../algo/autoScheduleToday";

export default function TodayTasks() {
  const [allTasks, setAllTasks] = useState([]);
  const [todayTasks, setTodayTasks] = useState([]);
  const [openAdd, setOpenAdd] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [openEdit, setOpenEdit] = useState(false);
  const [dailyMinutes, setDailyMinutes] = useState(180); // could be user preference later

  useEffect(() => {
    const q = collection(db, "tasks");
    const unsub = onSnapshot(q, snap => {
      const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setAllTasks(docs);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const scheduled = autoScheduleToday(allTasks, { dailyMinutes });
    // Also ensure micro tasks with deadline today are shown (they will be included by classifier or pool)
    setTodayTasks(scheduled);
  }, [allTasks, dailyMinutes]);

  async function onToggleComplete(task) {
    try {
      await updateDoc(doc(db, "tasks", task.id), { completed: !task.completed });
    } catch (e) { console.error(e); }
  }

  return (
    <Container sx={{ mt: 10 }}>
      <Typography variant="h5">Today's Tasks</Typography>
      <Button variant="contained" sx={{ my: 2 }} onClick={() => setOpenAdd(true)}>Add Task</Button>

      <TaskList
        tasks={todayTasks}
        onDragEnd={() => {}}
        onToggleComplete={onToggleComplete}
        onEdit={(t) => { setEditTask(t); setOpenEdit(true); }}
        onDelete={async (t) => { await updateDoc(doc(db,"tasks", t.id), { deleted: true }); }}
      />

      <AddTaskDialog
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        defaults={{ type: "today", deadline: new Date().toISOString().slice(0,10) }}
      />

      <EditTaskDialog
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        task={editTask}
      />
    </Container>
  );
}
