// src/algo/autoClassify.js
export function autoClassify(task) {
    // task: object with estimatedTime (minutes), deadline (YYYY-MM-DD or null), subtasks array, priority
    const est = Number(task.estimatedTime || 0);
    const subtasks = (task.subtasks || []).length;
    const priority = Number(task.priority || 0);
  
    const today = new Date().toISOString().slice(0, 10);
    const hasDeadlineToday = task.deadline === today;
  
    // 1) Micro task: super short or explicitly micro
    if (task.type === "micro" || (est && est <= 10)) return "micro";
  
    // 2) Deadline today -> today's list
    if (hasDeadlineToday) return "today";
  
    // 3) Projects (long tasks or many subtasks)
    if (subtasks >= 2 || est >= 45) return "project";
  
    // 4) High priority -> put into today
    if (priority >= 4) return "today";
  
    // Default
    return task.type || "other";
  }
  