// src/algo/scheduler.js
// Simple scoring and sorting utilities.
// Tune weights here.

export function scoreTask(task, { today = new Date() } = {}) {
    const priority = Number(task.priority || 0);
    const liking = Number(task.liking || 0);
  
    const priorityWeight = priority * 2;
    const likingWeight = liking * 0.5;
  
    const deadline = task.deadline ? new Date(task.deadline) : null;
    let daysLeft = deadline ? (deadline - today) / (1000 * 60 * 60 * 24) : Infinity;
  
    let deadlineWeight = 0;
    if (deadline) {
      if (daysLeft <= 0) deadlineWeight = 100;
      else deadlineWeight = 50 / daysLeft;
    }
  
    const totalSubtaskTime = (task.subtasks || []).reduce((s, st) => s + (Number(st.time) || 0), 0);
    const effectiveTime = Number(task.estimatedTime) || totalSubtaskTime || 1;
    const timeWeight = 2 / effectiveTime;
  
    const microBonus = task.type === "micro" ? 1.5 : 0;
  
    return priorityWeight + likingWeight + deadlineWeight + timeWeight + microBonus;
  }
  
  export function sortTasks(tasks, opts = {}) {
    const today = opts.today || new Date();
    const scored = tasks.map(t => ({ ...t, _score: scoreTask(t, { today }) }));
    // manualRank overrides score if present
    scored.sort((a, b) => {
      const aKey = (typeof a.manualRank === "number") ? (1e6 - a.manualRank) : a._score;
      const bKey = (typeof b.manualRank === "number") ? (1e6 - b.manualRank) : b._score;
      return bKey - aKey;
    });
    return scored;
  }
  