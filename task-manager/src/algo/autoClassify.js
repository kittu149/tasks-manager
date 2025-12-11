// src/algo/autoClassify.js
export function autoClassify(task) {
  const est = Number(task.estimatedTime || 0);
  const subtasks = (task.subtasks || []).length;
  const priority = Number(task.priority || 0);

  const today = new Date().toISOString().slice(0, 10);
  const isToday = task.deadline === today;

  if (est && est <= 10) return "micro";
  if (isToday) return "today";
  if (subtasks >= 2 || est >= 45) return "project";
  if (priority >= 4) return "today";

  return "other";
}
