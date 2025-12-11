import { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, List, ListItem, ListItemText } from "@mui/material";
import { sortTasks } from "../../algo/scheduler";
import { writeBatch, doc } from "firebase/firestore";
import { db } from "../../firebase";

export default function SortMicroTasksDialog({ open, onClose, tasks = [] }) {
  const [current, setCurrent] = useState([]);

  useEffect(() => {
    setCurrent(tasks || []);
  }, [tasks]);

  function applyRecommended() {
    const recommended = sortTasks(current);
    setCurrent(recommended);
  }

  async function saveManualOrder() {
    try {
      const batch = writeBatch(db);
      current.forEach((t, i) => {
        const d = doc(db, "tasks", t.id);
        batch.update(d, { manualRank: i });
      });
      await batch.commit();
    } catch (e) {
      console.error("Failed to save manual order", e);
    }
    onClose();
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Sort Micro Tasks</DialogTitle>
      <DialogContent>
        <Button variant="outlined" onClick={applyRecommended} sx={{ mb: 2 }}>Apply Recommended Order</Button>
        <List>
          {current.map((t, i) => (
            <ListItem key={t.id} divider>
              <ListItemText primary={`${i+1}. ${t.title}`} secondary={`Est: ${t.estimatedTime || "?"}m`} />
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
