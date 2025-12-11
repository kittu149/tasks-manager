// src/pages/Dashboard.jsx
import { Container, Grid, Card, CardContent, Typography, Avatar, Box, Button } from "@mui/material";
import TaskCard from "../components/TaskCard";
import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, onSnapshot, query } from "firebase/firestore";
import { sortTasks } from "../algo/scheduler";

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "tasks"));
    const unsub = onSnapshot(q, snap => {
      setTasks(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  const pending = tasks.filter(t => !t.completed).length;
  const completed = tasks.filter(t => t.completed).length;

  const today = new Date().toISOString().slice(0, 10);
  const todayTasks = tasks.filter(t => (t.deadline === today) || (t.type === "today"));
  const micro = tasks.filter(t => t.type === "micro");
  const recommended = sortTasks(tasks).slice(0, 5);

  return (
    <Container sx={{ mt: 10 }}>
      <Grid container spacing={2}>
        
        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent>
              <Avatar sx={{ width: 56, height: 56, mb: 1 }}>GS</Avatar>
              <Typography variant="h6">Gunda Sushanth</Typography>
              <Typography>Pending: {pending}</Typography>
              <Typography>Completed: {completed}</Typography>
              <Box sx={{ mt: 2 }}>
                <Button href="/today" variant="contained">Open Today's Tasks</Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 8 }}>
          <Typography variant="h6">Today's Top</Typography>
          {todayTasks.slice(0, 3).map(t => (
            <TaskCard key={t.id} task={t} onToggleComplete={()=>{}} onEdit={()=>{}} onDelete={()=>{}} />
          ))}

          <Typography variant="h6" sx={{ mt: 2 }}>Quick Micro</Typography>
          {micro.slice(0, 3).map(t => (
            <TaskCard key={t.id} task={t} onToggleComplete={()=>{}} onEdit={()=>{}} onDelete={()=>{}} />
          ))}

          <Typography variant="h6" sx={{ mt: 2 }}>Recommended</Typography>
          {recommended.map(t => (
            <TaskCard key={t.id} task={t} onToggleComplete={()=>{}} onEdit={()=>{}} onDelete={()=>{}} />
          ))}
        </Grid>

      </Grid>
    </Container>
  );
}
