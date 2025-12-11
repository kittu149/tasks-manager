// src/components/TaskList.jsx
import { DndContext, closestCenter } from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import TaskCard from "./TaskCard";

export default function TaskList({
  tasks,
  onDragEnd = () => {},
  onEdit = () => {},
  onDelete = () => {},
  onToggleComplete = () => {},
}) {

  function handleDragEnd(e) {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const oldIndex = tasks.findIndex(t => t.id === active.id);
    const newIndex = tasks.findIndex(t => t.id === over.id);
    const reordered = arrayMove(tasks, oldIndex, newIndex);
    onDragEnd(reordered);
  }

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={tasks.map(t => t.id)}>
        {tasks.map(t => (
          <TaskCard
            key={t.id}
            task={t}
            onEdit={() => onEdit(t)}
            onDelete={() => onDelete(t)}
            onToggle={() => onToggleComplete(t)}
          />
        ))}
      </SortableContext>
    </DndContext>
  );
}
