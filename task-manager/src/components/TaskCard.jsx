// src/components/TaskCard.jsx
import { Card, CardContent, Typography, Checkbox, IconButton, Box } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export default function TaskCard({ task, onToggleComplete, onEdit, onDelete }) {
  return (
    <Card variant="outlined" sx={{ mb: 1 }}>
      <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Checkbox checked={!!task.completed} onChange={() => onToggleComplete(task)} />
        <Box sx={{ flex: 1 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{task.title}</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: "pre-wrap" }}>
            {task.description || ""}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {task.deadline ? `Due: ${task.deadline} • ` : ""} Est: {task.estimatedTime || "?"}m • P:{task.priority || "-"} • L:{task.liking || "-"}
          </Typography>
        </Box>

        <IconButton size="small" onClick={() => onEdit(task)}>
          <EditIcon />
        </IconButton>
        <IconButton size="small" onClick={() => onDelete(task)}>
          <DeleteIcon />
        </IconButton>
      </CardContent>
    </Card>
  );
}
