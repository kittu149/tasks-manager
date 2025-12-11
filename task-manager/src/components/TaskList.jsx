// src/components/TaskList.jsx
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Box } from "@mui/material";
import TaskCard from "./TaskCard";

function SortableItem({ item, index, onToggleComplete, onEdit, onDelete }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: item.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <div {...listeners}>
        <TaskCard task={item} onToggleComplete={onToggleComplete} onEdit={onEdit} onDelete={onDelete} />
      </div>
    </div>
  );
}

export default function TaskList({ tasks, onDragEnd, onToggleComplete, onEdit, onDelete }) {
  function handleDragEnd(event) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = tasks.findIndex(t => t.id === active.id);
    const newIndex = tasks.findIndex(t => t.id === over.id);
    const newTasks = arrayMove(tasks, oldIndex, newIndex);
    onDragEnd && onDragEnd(newTasks);
  }

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={tasks.map(t => t.id)} strategy={rectSortingStrategy}>
        <Box>
          {tasks.map((t, idx) => (
            <SortableItem key={t.id} item={t} index={idx} onToggleComplete={onToggleComplete} onEdit={onEdit} onDelete={onDelete} />
          ))}
        </Box>
      </SortableContext>
    </DndContext>
  );
}
