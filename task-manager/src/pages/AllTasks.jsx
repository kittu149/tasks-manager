import { useEffect, useState } from "react";
import { Container, Typography, Button } from "@mui/material";
import { collection, onSnapshot, updateDoc, doc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase";
import TaskList from "../components/TaskList";
import AddAllTaskDialog from "../components/all/AddAllTaskDialog";
import EditAllTaskDialog from "../components/all/EditAllTaskDialog";
import SortAllTasksDialog from "../components/all/SortAllTasksDialog";
import SearchFilterBar from "../components/SearchFilterBar";
import { sortTasks } from "../algo/scheduler";

export default function AllTasks() {
  const [all, setAll] = useState([]);
  const [visible, setVisible] = useState([]);
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [openSort, setOpenSort] = useState(false);

  useEffect(() => {
    const q = collection(db, "tasks");
    const unsub = onSnapshot(q, snap => setAll(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
    return () => unsub();
  }, []);

  useEffect(() => {
    setVisible(sortTasks(all));
  }, [all]);

  async function onToggleComplete(t) { await updateDoc(doc(db, "tasks", t.id), { completed: !t.completed }); }
  async function onDelete(t) { await deleteDoc(doc(db, "tasks", t.id)); }

  function onSearch(filters) {
    let list = [...all];
    if (filters.q) list = list.filter(x => x.title?.toLowerCase().includes(filters.q.toLowerCase()));
    if (filters.type) list = list.filter(x => x.type === filters.type);
    if (filters.priority) list = list.filter(x => Number(x.priority) === Number(filters.priority));
    setVisible(sortTasks(list));
  }

  return (
    <Container sx={{ mt: 10 }}>
      <Typography variant="h5">All Tasks</Typography>
      <SearchFilterBar onSearch={onSearch} />
      <Button variant="contained" sx={{ my:2, mr:1 }} onClick={() => setOpenAdd(true)}>Add Task</Button>
      <Button variant="outlined" sx={{ my:2 }} onClick={() => setOpenSort(true)}>Sort</Button>

      <TaskList tasks={visible} onToggleComplete={onToggleComplete} onEdit={(t)=>{ setEditTask(t); setOpenEdit(true); }} onDelete={onDelete} onDragEnd={async (newOrder)=> {
        for (let i=0;i<newOrder.length;i++) await updateDoc(doc(db,"tasks", newOrder[i].id), { manualRank: i });
      }} />

      <AddAllTaskDialog open={openAdd} onClose={() => setOpenAdd(false)} />
      <EditAllTaskDialog open={openEdit} onClose={() => setOpenEdit(false)} task={editTask} />
      <SortAllTasksDialog open={openSort} onClose={() => setOpenSort(false)} tasks={visible} />
    </Container>
  );
}
