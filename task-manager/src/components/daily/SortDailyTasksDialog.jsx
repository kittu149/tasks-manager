import { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, List, ListItem, ListItemText } from "@mui/material";
import { sortTasks } from "../../algo/scheduler";
import { writeBatch, doc } from "firebase/firestore";
import { db } from "../../firebase";

export default function SortDailyTasksDialog({ open, onClose, tasks = [] }) {
  const [list, setList] = useState([]);

  useEffect(() => { setList(tasks || []); }, [tasks]);

  function applyRecommended() {
    setList(sortTasks(list));
  }

  async function saveOrder() {
    const batch = writeBatch(db);
    list.forEach((t,i) => batch.update(doc(db, "tasks", t.id), { manualRank: i }));
    try { await batch.commit(); } catch (e) { console.error(e); }
    onClose();
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Sort Today's Tasks</DialogTitle>
      <DialogContent>
        <Button variant="outlined" onClick={applyRecommended} sx={{ mb: 2 }}>Apply Recommended</Button>
        <List>
          {list.map((t,i) => <ListItem key={t.id} divider><ListItemText primary={`${i+1}. ${t.title}`} secondary={`Est: ${t.estimatedTime || "?"}m`} /></ListItem>)}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={saveOrder}>Save Order</Button>
      </DialogActions>
    </Dialog>
  );
}
