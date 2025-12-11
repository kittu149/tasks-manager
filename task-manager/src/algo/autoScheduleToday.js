// src/algo/autoScheduleToday.js
import { sortTasks } from "./scheduler";

/**
 * autoScheduleToday(tasks, opts)
 * - tasks: array of all tasks (unsorted), each task has estimatedTime, priority, deadline, type, subtasks
 * - opts.dailyMinutes: number (default 180)
 *
 * Returns array of tasks chosen for today's plan (ordered)
 */
export function autoScheduleToday(tasks = [], opts = {}) {
  const dailyMinutes = opts.dailyMinutes ?? 180;
  const todayISO = new Date().toISOString().slice(0, 10);

  // Candidate pools
  const deadlines = tasks.filter(t => t.deadline === todayISO);
  const explicitToday = tasks.filter(t => t.type === "today");
  const microShort = tasks.filter(t => (t.estimatedTime || 0) > 0 && Number(t.estimatedTime) <= 10);
  const highPriority = tasks.filter(t => (t.priority || 0) >= 4);

  // Merge candidates with priority: deadlines, explicitToday, highPriority, microShort
  let pool = [
    ...deadlines,
    ...explicitToday,
    ...highPriority,
    ...microShort,
  ];

  // Deduplicate by id preserving first occurrence
  pool = Array.from(new Map(pool.map(t => [t.id, t])).values());

  // Score & sort using scheduler to order by importance
  pool = sortTasks(pool);

  // Fit tasks into dailyMinutes
  const final = [];
  let used = 0;
  for (const t of pool) {
    const est = Number(t.estimatedTime || t.subtasks?.reduce((s, st) => s + (Number(st.time) || 0), 0) || 20);
    if (used + est <= dailyMinutes || final.length === 0) {
      final.push(t);
      used += est;
    } else {
      // skip if over capacity
    }
  }

  return final;
}
