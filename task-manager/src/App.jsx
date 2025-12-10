import { useState, useEffect } from "react";

// MUI
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Fab,
  List,
  ListItem,
  ListItemText,
  Divider,
  IconButton,
  Checkbox,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

// Components
import AddTaskDialog from "./AddTaskDialog";
import EditTaskDialog from "./EditTaskDialog";

// Firebase
import { db } from "./firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";

export default function App() {
  const [openAddTask, setOpenAddTask] = useState(false);
  const [openEditTask, setOpenEditTask] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [tasks, setTasks] = useState([]);

  // 🔥 LOAD TASKS (real-time) + APPLY SCHEDULING (Step 11)
  useEffect(() => {
    const q = query(collection(db, "tasks"), orderBy("createdAt"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // ----------------------------------
      // ⭐ Intelligent Scheduling (v3)
      // Includes estimatedTime + subtasks
      // ----------------------------------
      const scored = list.map((task) => {
        const today = new Date();
        const deadline = task.deadline ? new Date(task.deadline) : null;

        let daysLeft = deadline
          ? (deadline - today) / (1000 * 60 * 60 * 24)
          : Infinity;

        const priorityWeight = task.priority * 2;
        const likingWeight = task.liking * 0.5;

        let deadlineWeight = 0;
        if (deadline) {
          if (daysLeft <= 0) deadlineWeight = 100;
          else deadlineWeight = 50 / daysLeft;
        }

        // ⭐ Subtask contribution
        const totalSubtaskTime = task.subtasks?.reduce(
          (sum, st) => sum + (st.time || 0),
          0
        );

        const effectiveTime = task.estimatedTime || totalSubtaskTime || 1;

        const timeWeight = 2 / effectiveTime;

        const score =
          priorityWeight + likingWeight + deadlineWeight + timeWeight;

        return { ...task, score };
      });

      scored.sort((a, b) => b.score - a.score);

      setTasks(scored);
    });

    return () => unsubscribe();
  }, []);

  // ➕ Add task
  async function handleAddTask(taskData) {
    await addDoc(collection(db, "tasks"), taskData);
  }

  // ✏️ Update task (including subtasks)
  async function handleUpdateTask(id, updatedData) {
    await updateDoc(doc(db, "tasks", id), updatedData);
  }

  // ❌ Delete task
  async function handleDeleteTask(id) {
    await deleteDoc(doc(db, "tasks", id));
  }

  return (
    <>
      <AppBar position="fixed">
        <Toolbar>
          <Typography variant="h6">Task Manager</Typography>
        </Toolbar>
      </AppBar>

      <Toolbar />

      <Container sx={{ mt: 4 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Intelligent Task Order
        </Typography>

        <List>
          {tasks.map((task) => (
            <div key={task.id}>
              <ListItem
                alignItems="flex-start"
                secondaryAction={
                  <>
                    <IconButton
                      edge="end"
                      sx={{ mr: 1 }}
                      onClick={() => {
                        setSelectedTask(task);
                        setOpenEditTask(true);
                      }}
                    >
                      <EditIcon />
                    </IconButton>

                    <IconButton
                      edge="end"
                      onClick={() => handleDeleteTask(task.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </>
                }
              >
                <ListItemText
                  primary={
                    <>
                      <b>{task.title}</b>
                      <br />
                      Score: {task.score?.toFixed(2)}
                    </>
                  }
                  secondary={
                    <>
                      Deadline: {task.deadline || "None"} <br />
                      Priority: {task.priority} | Liking: {task.liking} <br />
                      Est. Time: {task.estimatedTime || "?"} min
                      <br />
                      {task.subtasks?.length > 0 && (
                        <>
                          <br />
                          <b>Subtasks:</b>
                          <br />
                          {task.subtasks.map((st, index) => (
                            <div key={index} style={{ display: "flex", alignItems: "center" }}>
                              <Checkbox checked={st.completed} disabled />
                              {st.title} ({st.time} min)
                            </div>
                          ))}
                        </>
                      )}
                    </>
                  }
                />
              </ListItem>

              <Divider />
            </div>
          ))}
        </List>
      </Container>

      <Fab
        color="primary"
        sx={{ position: "fixed", bottom: 20, right: 20 }}
        onClick={() => setOpenAddTask(true)}
      >
        <AddIcon />
      </Fab>

      {/* Dialogs */}
      <AddTaskDialog
        open={openAddTask}
        onClose={() => setOpenAddTask(false)}
        onAdd={handleAddTask}
      />

      <EditTaskDialog
        open={openEditTask}
        onClose={() => setOpenEditTask(false)}
        task={selectedTask}
        onUpdate={handleUpdateTask}
      />
    </>
  );
}
