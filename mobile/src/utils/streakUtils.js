import { formatKey } from './dateUtils';

export function isTaskActiveOnDate(task, dateKey) {
  // If task was created on this date, it is active
  if (task.date === dateKey) {
    return true;
  }

  // Specific goal tasks have a longer lifetime (persists across days up to 30 days until completed)
  if (task.goalId) {
    // If completed on this date
    if (task.completedAt?.startsWith(dateKey)) {
      return true;
    }
    // If incomplete and created on or before this date, it remains active!
    if (!task.completed && task.date <= dateKey) {
      const createdTime = new Date(`${task.date}T00:00:00`).getTime();
      const targetTime = new Date(`${dateKey}T00:00:00`).getTime();
      const diffDays = Math.floor((targetTime - createdTime) / (1000 * 60 * 60 * 24));
      return diffDays >= 0 && diffDays <= 30; // 30-day window for long-term goal tasks
    }
  }

  // Daily tasks (no goal) strictly have a 1-day lifetime for their creation date
  return false;
}

export function getTasksForDay(tasks = [], dateKey = formatKey(new Date())) {
  return tasks.filter((task) => isTaskActiveOnDate(task, dateKey));
}

export function getTaskDaysActive(task, todayKey = formatKey(new Date())) {
  if (!task.date) return 1;
  const createdTime = new Date(`${task.date}T00:00:00`).getTime();
  const todayTime = new Date(`${todayKey}T00:00:00`).getTime();
  return Math.max(1, Math.floor((todayTime - createdTime) / (1000 * 60 * 60 * 24)) + 1);
}

export function getDayStatus(tasksForDay, settings = {}) {
  const totalTasks = tasksForDay.length;
  const completedTasks = tasksForDay.filter((task) => task.completed).length;
  const requiredTasks = Math.max(1, Number(settings.dailyTaskTarget ?? 1));
  const threshold = Math.min(100, Math.max(10, Number(settings.completionPercentage ?? 75)));
  const completionRate = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);
  const meetsMinimum = totalTasks >= requiredTasks;
  const meetsGoalPercent = totalTasks > 0 && completionRate >= threshold;
  const passes = totalTasks > 0 && meetsMinimum && meetsGoalPercent;

  return {
    totalTasks,
    completedTasks,
    requiredTasks,
    threshold,
    completionRate,
    meetsMinimum,
    meetsGoalPercent,
    passes,
  };
}

export function getCurrentStreak(tasks = [], settings = {}) {
  const today = new Date();
  let streak = 0;

  for (let offset = 0; offset < 365; offset += 1) {
    const currentDate = new Date(today);
    currentDate.setDate(today.getDate() - offset);
    const dateKey = formatKey(currentDate);
    const dayTasks = getTasksForDay(tasks, dateKey);
    const status = getDayStatus(dayTasks, settings);

    if (!status.passes) {
      // If it's today and tasks haven't passed yet, don't break previous streak count
      if (offset === 0) continue;
      return streak;
    }

    streak += 1;
  }

  return streak;
}

export function getBestStreak(tasks = [], settings = {}) {
  const uniqueDates = [...new Set(tasks.map((task) => task.date))].sort((a, b) => b.localeCompare(a));
  let bestStreak = 0;
  let currentStreak = 0;

  for (const dateKey of uniqueDates) {
    const dayTasks = getTasksForDay(tasks, dateKey);
    const status = getDayStatus(dayTasks, settings);

    if (status.passes) {
      currentStreak += 1;
      bestStreak = Math.max(bestStreak, currentStreak);
    } else {
      currentStreak = 0;
    }
  }

  return bestStreak;
}

export function getLast7Days(tasks = []) {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const key = formatKey(d);
    const dayName = d.toLocaleDateString('en-US', { weekday: 'narrow' });
    const shortName = d.toLocaleDateString('en-US', { weekday: 'short' });

    const dayTasks = getTasksForDay(tasks, key);
    const total = dayTasks.length;
    const completed = dayTasks.filter((t) => t.completed).length;
    const rate = total === 0 ? 0 : Math.round((completed / total) * 100);

    return {
      key,
      dayName,
      shortName,
      total,
      completed,
      rate,
      isToday: i === 6,
    };
  });
}
