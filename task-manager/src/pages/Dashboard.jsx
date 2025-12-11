// src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import { Container, Grid, Card, CardContent, Typography, Avatar, Button } from "@mui/material";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import TaskCard from "../components/TaskCard";
import { sortTasks } from "../algo/scheduler";

export default function Dashboard() {
  const [allTasks, setAllTasks] = useState([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "tasks"), snap => {
      setAllTasks(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  const pending = allTasks.filter(t => !t.completed).length;
  const completed = allTasks.filter(t => t.completed).length;

  const todayISO = new Date().toISOString().slice(0, 10);
  const todayTasks = allTasks.filter(t =>
    t.deadline === todayISO || t.type === "today"
  ).slice(0, 3);

  const microTasks = allTasks.filter(t =>
    t.type === "micro" || (t.estimatedTime && t.estimatedTime <= 10)
  ).slice(0, 3);

  const recommended = sortTasks(allTasks).slice(0, 3);

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
              <Button variant="contained" href="/today" sx={{ mt: 2 }}>
                View Today’s Tasks
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 8 }}>
          <Typography variant="h6" sx={{ mt: 1 }}>Today's Top</Typography>
          {todayTasks.map(t => (
            <TaskCard key={t.id} task={t} hideActions />
          ))}

          <Typography variant="h6" sx={{ mt: 3 }}>Micro Tasks</Typography>
          {microTasks.map(t => (
            <TaskCard key={t.id} task={t} hideActions />
          ))}

          <Typography variant="h6" sx={{ mt: 3 }}>Recommended</Typography>
          {recommended.map(t => (
            <TaskCard key={t.id} task={t} hideActions />
          ))}
        </Grid>

      </Grid>
    </Container>
  );
}
