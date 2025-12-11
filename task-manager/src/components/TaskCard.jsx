// src/components/TaskCard.jsx
import { Card, CardContent, Typography, Checkbox, IconButton, Box } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export default function TaskCard({
  task,
  onToggle = () => {},
  onEdit = () => {},
  onDelete = () => {},
  hideActions = false,
}) {

  return (
    <Card sx={{ mb: 1 }}>
      <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        
        <Checkbox checked={!!task.completed} onChange={onToggle} />

        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="subtitle1">{task.title}</Typography>
          <Typography variant="body2" color="text.secondary">
            {task.description || "No description"}
          </Typography>
        </Box>

        {!hideActions && (
          <>
            <IconButton onClick={onEdit}><EditIcon /></IconButton>
            <IconButton onClick={onDelete}><DeleteIcon /></IconButton>
          </>
        )}
      </CardContent>
    </Card>
  );
}
