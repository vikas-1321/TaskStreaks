import { getTasksForDay } from './streakUtils';

export const getDailyProgress = (tasks, settings, todayKey) => {
  const todayTasks = getTasksForDay(tasks, todayKey);
  const completedToday = todayTasks.filter((task) => task.completed).length;
  const dailyTaskTarget = Math.max(1, Number(settings?.dailyTaskTarget) || 1);
  const completionTarget = Math.min(100, Math.max(10, Number(settings?.completionPercentage) || 75));
  const completion = todayTasks.length
    ? Math.round((completedToday / todayTasks.length) * 100)
    : 0;

  return {
    todayTasks,
    completedToday,
    dailyTaskTarget,
    completionTarget,
    taskTargetProgress: Math.min(100, Math.round((todayTasks.length / dailyTaskTarget) * 100)),
    completion,
  };
};
