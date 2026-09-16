import { defaultSettings } from '../data/defaults';

export function formatDateKey(date = new Date()) {
  const safeDate = new Date(date);
  safeDate.setHours(0, 0, 0, 0);

  const year = safeDate.getFullYear();
  const month = String(safeDate.getMonth() + 1).padStart(2, '0');
  const day = String(safeDate.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export function formatDisplayDate(dateKey) {
  const date = new Date(`${dateKey}T00:00:00`);

  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  }).format(date);
}

export function isTaskActiveOnDate(task, dateKey) {
  // If task was created on this date, it is active
  if (task.date === dateKey) {
    return true;
  }

  // Specific goal tasks have a longer lifetime (persists across days until completed, up to 30 days)
  if (task.goalId) {
    // If completed on this specific date
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

export function getTasksForDay(tasks, dateKey) {
  return tasks.filter((task) => isTaskActiveOnDate(task, dateKey));
}

export function getTaskDaysActive(task, todayKey = formatDateKey(new Date())) {
  if (!task.date) return 1;
  const createdTime = new Date(`${task.date}T00:00:00`).getTime();
  const todayTime = new Date(`${todayKey}T00:00:00`).getTime();
  const diffDays = Math.max(1, Math.floor((todayTime - createdTime) / (1000 * 60 * 60 * 24)) + 1);
  return diffDays;
}

export function getDayStatus(tasksForDay, settings = defaultSettings) {
  const totalTasks = tasksForDay.length;
  const completedTasks = tasksForDay.filter((task) => task.completed).length;
  const requiredTasks = Math.max(1, Number(settings.dailyTaskTarget ?? 1));
  const threshold = Math.min(100, Math.max(0, Number(settings.completionPercentage ?? 0)));
  const completionRate = totalTasks === 0 ? 0 : (completedTasks / totalTasks) * 100;
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

export function getCurrentStreak(tasks, settings = defaultSettings) {
  const today = new Date();
  let streak = 0;

  for (let offset = 0; offset < 365; offset += 1) {
    const currentDate = new Date(today);
    currentDate.setDate(today.getDate() - offset);
    const dateKey = formatDateKey(currentDate);
    const dayTasks = getTasksForDay(tasks, dateKey);
    const status = getDayStatus(dayTasks, settings);

    if (!status.passes) {
      return streak;
    }

    streak += 1;
  }

  return streak;
}

export function getBestStreak(tasks, settings = defaultSettings) {
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
