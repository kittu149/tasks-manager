// src/algo/scheduler.js
export function scoreTask(task) {
  const priority = Number(task.priority || 0);
  const liking = Number(task.liking || 0);

  const priorityWeight = priority * 2;
  const likingWeight = liking * 0.5;

  const today = new Date();
  const deadline = task.deadline ? new Date(task.deadline) : null;
  let deadlineWeight = 0;

  if (deadline) {
    const diff = (deadline - today) / (1000 * 60 * 60 * 24);
    if (diff <= 0) deadlineWeight = 100;
    else deadlineWeight = 50 / diff;
  }

  const subtasks = (task.subtasks || []).reduce((s, st) => s + Number(st.time || 0), 0);
  const effectiveTime = Number(task.estimatedTime || subtasks || 1);
  const timeWeight = 2 / effectiveTime;

  const microBonus = task.type === "micro" ? 1.5 : 0;

  return priorityWeight + likingWeight + deadlineWeight + timeWeight + microBonus;
}

export function sortTasks(tasks) {
  const scored = tasks.map(t => ({ ...t, _score: scoreTask(t) }));
  scored.sort((a, b) => {
    const aRank = a.manualRank ?? a._score;
    const bRank = b.manualRank ?? b._score;
    return bRank - aRank;
  });
  return scored;
}
