// src/algo/autoScheduleToday.js
import { sortTasks } from "./scheduler";

export function autoScheduleToday(tasks, opts = {}) {
  const dailyMinutes = opts.dailyMinutes ?? 180;
  const today = new Date().toISOString().slice(0, 10);

  const deadlines = tasks.filter(t => t.deadline === today);
  const explicitToday = tasks.filter(t => t.type === "today");
  const highPriority = tasks.filter(t => (t.priority || 0) >= 4);
  const micro = tasks.filter(t => t.estimatedTime && Number(t.estimatedTime) <= 10);

  let pool = [...deadlines, ...explicitToday, ...highPriority, ...micro];

  pool = Array.from(new Map(pool.map(t => [t.id, t])).values());
  pool = sortTasks(pool);

  let used = 0;
  const final = [];

  for (const t of pool) {
    const est = Number(t.estimatedTime || 20);
    if (used + est <= dailyMinutes || final.length === 0) {
      final.push(t);
      used += est;
    }
  }
  return final;
}
