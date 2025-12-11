// src/components/SortTaskDialog.jsx
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import { sortTasks } from "../algo/scheduler";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

export default function SortTaskDialog({ open, onClose, tasks, persistManual = true }) {
  const [current, setCurrent] = useState([]);

  useEffect(() => {
    setCurrent(tasks || []);
  }, [tasks]);

  function applyRecommended() {
    const recommended = sortTasks(current);
    setCurrent(recommended);
  }

  async function saveManualOrder() {
    if (!persistManual) {
      onClose();
      return;
    }
    // Persist manualRank field
    for (let i = 0; i < current.length; i++) {
      const t = current[i];
      try {
        await updateDoc(doc(db, "tasks", t.id), { manualRank: i });
      } catch (e) {
        console.error("Failed to save manual rank for", t.id, e);
      }
    }
    onClose();
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Sort Tasks</DialogTitle>
      <DialogContent>
        <Button variant="outlined" onClick={applyRecommended} sx={{ mb: 2 }}>Apply Recommended Order</Button>
        <List>
          {current.map((t, i) => (
            <ListItem key={t.id} divider secondaryAction={<IconButton edge="end"><SaveIcon /></IconButton>}>
              <ListItemText primary={`${i + 1}. ${t.title}`} secondary={`Score: ${t._score?.toFixed ? t._score.toFixed(2) : "-"}`} />
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={saveManualOrder}>Save Order</Button>
      </DialogActions>
    </Dialog>
  );
}
