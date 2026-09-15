import { useMemo, useState } from 'react';
import DailyWorkBoard from './components/DailyWorkBoard.jsx';
import GoalBoard from './components/GoalBoard.jsx';
import SettingsPanel from './components/SettingsPanel.jsx';
import TaskBoard from './components/TaskBoard.jsx';
import { defaultGoals, defaultSettings } from './data/defaults.js';
import { useLocalStorage } from './hooks/useLocalStorage.js';
import {
  formatDateKey,
  formatDisplayDate,
  getBestStreak,
  getCurrentStreak,
  getDayStatus,
  getTasksForDay,
} from './utils/streakUtils.js';

const goalColors = ['#2563eb', '#0891b2', '#16a34a', '#ca8a04', '#ea580c', '#db2777'];

function App() {
  const [activePage, setActivePage] = useState('home');
  const [selectedGoalId, setSelectedGoalId] = useState('');
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [isAddingGoal, setIsAddingGoal] = useState(false);
  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [draggedGoalId, setDraggedGoalId] = useState('');
  const [settings, setSettings] = useLocalStorage('taskstreaks.settings', defaultSettings);
  const [goals, setGoals] = useLocalStorage('taskstreaks.goals', defaultGoals);
  const [tasks, setTasks] = useLocalStorage('taskstreaks.tasks', []);
  const [workItems, setWorkItems] = useLocalStorage('taskstreaks.dailyWork', []);

  const todayKey = formatDateKey(new Date());
  const todayTasks = useMemo(() => getTasksForDay(tasks, todayKey), [tasks, todayKey]);
  const selectedGoal = goals.find((goal) => goal.id === selectedGoalId);
  const visibleTasks = selectedGoal
    ? tasks.filter((task) => task.goalId === selectedGoal.id)
    : todayTasks;
  const dayStatus = getDayStatus(todayTasks, settings);
  const currentStreak = getCurrentStreak(tasks, settings);
  const bestStreak = getBestStreak(tasks, settings);

  const addGoal = (goal) => {
    setGoals((previousGoals) => [...previousGoals, goal]);
  };

  const addQuickGoal = (event) => {
    event.preventDefault();
    const title = newGoalTitle.trim();

    if (!title) {
      return;
    }

    const goal = {
      id: crypto.randomUUID(),
      title,
      description: '',
      color: goalColors[Math.floor(Math.random() * goalColors.length)],
    };

    addGoal(goal);
    setSelectedGoalId(goal.id);
    setNewGoalTitle('');
    setIsAddingGoal(false);
  };

  const moveGoal = (targetGoalId = '') => {
    if (!draggedGoalId || draggedGoalId === targetGoalId) {
      return;
    }

    setGoals((previousGoals) => {
      const draggedGoal = previousGoals.find((goal) => goal.id === draggedGoalId);
      if (!draggedGoal) {
        return previousGoals;
      }

      const remainingGoals = previousGoals.filter((goal) => goal.id !== draggedGoalId);
      const targetIndex = targetGoalId
        ? remainingGoals.findIndex((goal) => goal.id === targetGoalId)
        : remainingGoals.length;

      if (targetIndex < 0) {
        return previousGoals;
      }

      remainingGoals.splice(targetIndex, 0, draggedGoal);
      return remainingGoals;
    });
  };

  const updateGoal = (goalId, nextGoal) => {
    setGoals((previousGoals) =>
      previousGoals.map((goal) => (goal.id === goalId ? { ...goal, ...nextGoal } : goal)),
    );
  };

  const deleteGoal = (goalId) => {
    setGoals((previousGoals) => previousGoals.filter((goal) => goal.id !== goalId));
    setTasks((previousTasks) =>
      previousTasks.map((task) =>
        task.goalId === goalId ? { ...task, goalId: null } : task,
      ),
    );
  };

  const addTask = ({ title, goalId }) => {
    if (!title.trim()) {
      return;
    }

    const newTask = {
      id: crypto.randomUUID(),
      title: title.trim(),
      goalId: goalId || null,
      completed: false,
      date: todayKey,
      createdAt: new Date().toISOString(),
    };

    setTasks((previousTasks) => [...previousTasks, newTask]);
  };

  const toggleTask = (taskId) => {
    setTasks((previousTasks) =>
      previousTasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task,
      ),
    );
  };

  const editTask = (taskId, updates) => {
    setTasks((previousTasks) =>
      previousTasks.map((task) =>
        task.id === taskId ? { ...task, ...updates } : task,
      ),
    );
  };

  const deleteTask = (taskId) => {
    setTasks((previousTasks) => previousTasks.filter((task) => task.id !== taskId));
  };

  const addWork = (title) => {
    setWorkItems((previousItems) => [
      ...previousItems,
      { id: crypto.randomUUID(), title, completedBy: {} },
    ]);
  };

  const toggleWork = (workId, dateKey) => {
    setWorkItems((previousItems) => previousItems.map((workItem) => {
      if (workItem.id !== workId) {
        return workItem;
      }

      return {
        ...workItem,
        completedBy: {
          ...workItem.completedBy,
          [dateKey]: !workItem.completedBy?.[dateKey],
        },
      };
    }));
  };

  const deleteWork = (workId) => {
    setWorkItems((previousItems) => previousItems.filter((workItem) => workItem.id !== workId));
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Habit tracker</p>
          <h1>TaskStreaks</h1>
        </div>
        <div className="today-pill">{formatDisplayDate(todayKey)}</div>
      </header>

      <nav className="page-nav" aria-label="Main navigation">
        <button
          type="button"
          className={`nav-button ${activePage === 'home' ? 'active' : ''}`}
          onClick={() => setActivePage('home')}
        >
          Home
        </button>
        <button
          type="button"
          className={`nav-button ${activePage === 'manage' ? 'active' : ''}`}
          onClick={() => setActivePage('manage')}
        >
          Goals &amp; rules
        </button>
      </nav>

      <main className="dashboard">
        {activePage === 'home' ? (
          <>
            <div className="daily-progress" aria-label={`Daily progress: ${Math.round(dayStatus.completionRate)}% complete`}>
              <span className="progress-label">Daily progress</span>
              <div className="progress-track" role="progressbar" aria-valuenow={Math.round(dayStatus.completionRate)} aria-valuemin="0" aria-valuemax="100">
                <span className="progress-value" style={{ width: `${dayStatus.completionRate}%` }} />
              </div>
              <span className="progress-percent">{Math.round(dayStatus.completionRate)}%</span>
            </div>

            <section className="stats-row">
              <div className="stat-card highlight">
                <span>Current streak</span>
                <strong>{currentStreak}</strong>
                <small>days in a row</small>
              </div>
              <div className="stat-card">
                <span>Best streak</span>
                <strong>{bestStreak}</strong>
                <small>personal record</small>
              </div>
              <div className="stat-card">
                <span>Today</span>
                <strong>{dayStatus.completedTasks}/{dayStatus.totalTasks}</strong>
                <small>completed tasks</small>
              </div>
              <div className="stat-card status-card">
                <span>Status</span>
                <strong>{dayStatus.passes ? 'On track' : 'Needs attention'}</strong>
                <small>{Math.round(dayStatus.completionRate)}% complete</small>
              </div>
            </section>

            <section className="home-content">
              <aside className="goal-sidebar">
                <div className="panel-header">
                  <h2>Long-term goals</h2>
                </div>
                <button
                  type="button"
                  className={`goal-menu-item ${selectedGoalId === '' ? 'active' : ''}`}
                  onClick={() => setSelectedGoalId('')}
                >
                  Today&apos;s tasks
                </button>
                {goals.map((goal) => (
                  <button
                    type="button"
                    className={`goal-menu-item goal-draggable ${selectedGoalId === goal.id ? 'active' : ''} ${draggedGoalId === goal.id ? 'dragging' : ''}`}
                    key={goal.id}
                    draggable="true"
                    onDragStart={() => setDraggedGoalId(goal.id)}
                    onDragOver={(event) => event.preventDefault()}
                    onDrop={() => {
                      moveGoal(goal.id);
                      setDraggedGoalId('');
                    }}
                    onDragEnd={() => setDraggedGoalId('')}
                    onClick={() => setSelectedGoalId(goal.id)}
                  >
                    <span className="goal-menu-dot" style={{ background: goal.color }} />
                    <span>{goal.title}</span>
                  </button>
                ))}
                {isAddingGoal ? (
                  <form className="new-goal-form" onSubmit={addQuickGoal}>
                    <input
                      type="text"
                      className="new-goal-input"
                      placeholder="New long-term goal"
                      value={newGoalTitle}
                      onChange={(event) => setNewGoalTitle(event.target.value)}
                      aria-label="New long-term goal"
                      autoFocus
                      onKeyDown={(event) => {
                        if (event.key === 'Escape') {
                          setNewGoalTitle('');
                          setIsAddingGoal(false);
                        }
                      }}
                    />
                  </form>
                ) : (
                  <button
                    type="button"
                    className="new-goal-button"
                    onClick={() => setIsAddingGoal(true)}
                    onDragOver={(event) => event.preventDefault()}
                    onDrop={(event) => {
                      event.preventDefault();
                      moveGoal();
                      setDraggedGoalId('');
                    }}
                  >
                    <span aria-hidden="true">+</span>
                  </button>
                )}
              </aside>

              <TaskBoard
                tasks={visibleTasks}
                goals={goals}
                title={selectedGoal ? `${selectedGoal.title} tasks` : "Today's tasks"}
                isAddFormOpen={isAddTaskOpen}
                onCloseAddForm={() => setIsAddTaskOpen(false)}
                onAddTask={addTask}
                onToggleTask={toggleTask}
                onDeleteTask={deleteTask}
                onEditTask={editTask}
              />

              <DailyWorkBoard
                workItems={workItems}
                onAddWork={addWork}
                onToggleWork={toggleWork}
                onDeleteWork={deleteWork}
              />
            </section>
            <button
              type="button"
              className="add-task-button"
              aria-label="Add a new task"
              onClick={() => setIsAddTaskOpen(true)}
            >
              <span aria-hidden="true">+</span>
              <span>Add task</span>
            </button>
          </>
        ) : (
          <div className="content-grid">
            <div className="main-column">
              <GoalBoard
                goals={goals}
                onAddGoal={addGoal}
                onDeleteGoal={deleteGoal}
                onUpdateGoal={updateGoal}
              />
            </div>
            <div className="side-column">
              <SettingsPanel settings={settings} onChange={setSettings} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
