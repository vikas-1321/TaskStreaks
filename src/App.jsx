import { useMemo, useState } from 'react';
import DailyWorkBoard from './components/DailyWorkBoard.jsx';
import GoalBoard from './components/GoalBoard.jsx';
import SettingsPanel from './components/SettingsPanel.jsx';
import {
  HandDrawnProgressRing,
  HandDrawnTrendChart,
} from './components/SketchCharts.jsx';
import {
  CheckmarkSketch,
  FlameSketch,
  PencilSketch,
  PlusSketch,
  TapeStrip,
  TargetSketch,
  TrophySketch,
} from './components/SketchIcons.jsx';
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

    const isGoalTask = Boolean(goalId);
    const newTask = {
      id: crypto.randomUUID(),
      title: title.trim(),
      goalId: goalId || null,
      lifetime: isGoalTask ? 'long-term' : 'daily',
      completed: false,
      date: todayKey,
      createdAt: new Date().toISOString(),
      completedAt: null,
    };

    setTasks((previousTasks) => [...previousTasks, newTask]);
  };

  const toggleTask = (taskId) => {
    setTasks((previousTasks) =>
      previousTasks.map((task) => {
        if (task.id !== taskId) {
          return task;
        }

        const nextCompleted = !task.completed;
        return {
          ...task,
          completed: nextCompleted,
          completedAt: nextCompleted ? new Date().toISOString() : null,
        };
      }),
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
    setWorkItems((previousItems) =>
      previousItems.map((workItem) => {
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
      }),
    );
  };

  const deleteWork = (workId) => {
    setWorkItems((previousItems) =>
      previousItems.filter((workItem) => workItem.id !== workId),
    );
  };

  return (
    <div className="notebook-wrapper">
      {/* Notebook Binder Spiral Rings along top */}
      <div className="notebook-spiral-header" aria-hidden="true">
        {Array.from({ length: 16 }).map((_, i) => (
          <div key={i} className="spiral-ring">
            <span className="spiral-wire" />
            <span className="spiral-hole" />
          </div>
        ))}
      </div>

      <div className="app-shell notebook-paper">
        {/* Decorative corner washi tape */}
        <TapeStrip angle={-4} width={110} height={28} className="corner-tape top-left" />
        <TapeStrip angle={3} width={100} height={26} className="corner-tape top-right" />

        <header className="topbar">
          <div className="title-area">
            <p className="eyebrow sketch-eyebrow">
              <span className="sketch-star">★</span> Hand-Crafted Habit Journal
            </p>
            <div className="logo-wrap">
              <h1 className="sketch-logo">TaskStreaks</h1>
              <span className="marker-underline" aria-hidden="true" />
            </div>
          </div>
          <div className="header-meta">
            <div className="today-stamp">
              <span className="stamp-pin">📌</span>
              <span className="stamp-text">{formatDisplayDate(todayKey)}</span>
            </div>
          </div>
        </header>

        {/* Hand-Drawn Bookmark Navigation Tabs */}
        <nav className="page-nav sketch-tabs" aria-label="Main navigation">
          <button
            type="button"
            className={`nav-tab-btn ${activePage === 'home' ? 'active' : ''}`}
            onClick={() => setActivePage('home')}
          >
            <span className="tab-icon">✏️</span>
            <span>Daily Studio</span>
          </button>
          <button
            type="button"
            className={`nav-tab-btn ${activePage === 'analytics' ? 'active' : ''}`}
            onClick={() => setActivePage('analytics')}
          >
            <span className="tab-icon">📊</span>
            <span>Sketch Analytics</span>
          </button>
          <button
            type="button"
            className={`nav-tab-btn ${activePage === 'manage' ? 'active' : ''}`}
            onClick={() => setActivePage('manage')}
          >
            <span className="tab-icon">🎯</span>
            <span>Goals &amp; Rules</span>
          </button>
        </nav>

        <main className="dashboard">
          {activePage === 'home' && (
            <>
              {/* Top Illustrated Statistics Panels */}
              <section className="stats-row" aria-label="Key streak statistics">
                {/* Stat 1: Current Streak */}
                <div className="stat-card sketch-card highlight-orange card-tilt-1">
                  <div className="stat-card-header">
                    <span className="stat-label">Current Streak</span>
                    <FlameSketch size={26} color="#ea580c" />
                  </div>
                  <strong className="stat-num">{currentStreak}</strong>
                  <small className="stat-sub">
                    {currentStreak === 1 ? 'day unbroken' : 'days in a row 🔥'}
                  </small>
                </div>

                {/* Stat 2: Best Streak */}
                <div className="stat-card sketch-card highlight-yellow card-tilt-2">
                  <div className="stat-card-header">
                    <span className="stat-label">Personal Best</span>
                    <TrophySketch size={26} color="#ca8a04" />
                  </div>
                  <strong className="stat-num">{bestStreak}</strong>
                  <small className="stat-sub">all-time record 🏆</small>
                </div>

                {/* Stat 3: Today's Tasks */}
                <div className="stat-card sketch-card highlight-blue card-tilt-3">
                  <div className="stat-card-header">
                    <span className="stat-label">Today&apos;s Score</span>
                    <CheckmarkSketch size={24} color="#0284c7" />
                  </div>
                  <strong className="stat-num">
                    {dayStatus.completedTasks}/{dayStatus.totalTasks}
                  </strong>
                  <small className="stat-sub">
                    {dayStatus.completedTasks === dayStatus.totalTasks && dayStatus.totalTasks > 0
                      ? 'all tasks checked! ✨'
                      : `${dayStatus.totalTasks - dayStatus.completedTasks} tasks remaining`}
                  </small>
                </div>

                {/* Stat 4: Day Status */}
                <div className="stat-card sketch-card highlight-green card-tilt-4">
                  <div className="stat-card-header">
                    <span className="stat-label">Status Check</span>
                    <TargetSketch size={24} color="#16a34a" />
                  </div>
                  <strong className="stat-num status-text">
                    {dayStatus.passes ? 'On Track! 🎯' : 'Keep Going! 💪'}
                  </strong>
                  <small className="stat-sub">
                    {Math.round(dayStatus.completionRate)}% today (min {settings.completionPercentage}%)
                  </small>
                </div>
              </section>

              {/* Visual Data Overview: Hand-Drawn Ring + Weekly Trend */}
              <section className="sketch-visual-row">
                <HandDrawnProgressRing
                  percentage={dayStatus.completionRate}
                  targetPercentage={settings.completionPercentage}
                  completedCount={dayStatus.completedTasks}
                  totalCount={dayStatus.totalTasks}
                />
                <HandDrawnTrendChart tasks={tasks} settings={settings} />
              </section>

              {/* Main Interactive Studio Grid */}
              <section className="home-content">
                <aside className="goal-sidebar sketch-sidebar">
                  <TapeStrip angle={-2} width={65} height={18} className="sidebar-tape" />
                  <div className="panel-header">
                    <h3 className="sidebar-title">
                      <span>🏷️</span> Long-Term Goals
                    </h3>
                  </div>

                  <div className="goal-nav-list">
                    <button
                      type="button"
                      className={`goal-menu-item sketch-goal-tab ${
                        selectedGoalId === '' ? 'active' : ''
                      }`}
                      onClick={() => setSelectedGoalId('')}
                    >
                      <span className="sketch-dot-icon">📓</span>
                      <span>Today&apos;s tasks</span>
                      <span className="goal-count-pill">{todayTasks.length}</span>
                    </button>

                    {goals.map((goal) => {
                      const count = tasks.filter((t) => t.goalId === goal.id).length;
                      return (
                        <button
                          type="button"
                          className={`goal-menu-item goal-draggable sketch-goal-tab ${
                            selectedGoalId === goal.id ? 'active' : ''
                          } ${draggedGoalId === goal.id ? 'dragging' : ''}`}
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
                          <span
                            className="goal-menu-dot sketch-crayon-dot"
                            style={{ backgroundColor: goal.color }}
                          />
                          <span className="goal-tab-title">{goal.title}</span>
                          <span className="goal-count-pill">{count}</span>
                        </button>
                      );
                    })}
                  </div>

                  {isAddingGoal ? (
                    <form className="new-goal-form" onSubmit={addQuickGoal}>
                      <input
                        type="text"
                        className="sketch-input small-input"
                        placeholder="New goal title..."
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
                      className="new-goal-button sketch-add-goal-btn"
                      onClick={() => setIsAddingGoal(true)}
                      title="Add new goal"
                      aria-label="Add new long-term goal"
                    >
                      <PlusSketch size={16} />
                      <span>New Goal</span>
                    </button>
                  )}
                </aside>

                <div className="main-board-stack">
                  <TaskBoard
                    tasks={visibleTasks}
                    goals={goals}
                    title={selectedGoal ? `${selectedGoal.title} Tasks` : "Today's Tasks"}
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
                </div>
              </section>

              {/* Floating Sketch Pencil Add Task Button */}
              <button
                type="button"
                className="add-task-button sketch-floating-btn"
                aria-label="Add a new task"
                onClick={() => setIsAddTaskOpen(true)}
              >
                <PencilSketch size={22} color="#ffffff" />
                <span>Sketch Task</span>
              </button>
            </>
          )}

          {activePage === 'analytics' && (
            <div className="analytics-view">
              <div className="analytics-header">
                <span className="sketch-tag blue-tag">Visual Intelligence</span>
                <h2 className="sketch-h2">Sketch Analytics &amp; Habit Trends</h2>
                <p className="sketch-subtext">
                  Hand-crafted metrics tracking your progress, consistency curve, and goal breakdown.
                </p>
              </div>

              <div className="analytics-grid">
                <div className="sketch-card analytics-card">
                  <HandDrawnTrendChart tasks={tasks} settings={settings} />
                </div>

                <div className="sketch-card analytics-card">
                  <HandDrawnProgressRing
                    percentage={dayStatus.completionRate}
                    targetPercentage={settings.completionPercentage}
                    completedCount={dayStatus.completedTasks}
                    totalCount={dayStatus.totalTasks}
                  />
                </div>
              </div>

              <div className="sketch-card goal-breakdown-card">
                <TapeStrip angle={-1} width={80} height={20} className="panel-tape" />
                <h3 className="sketch-h3">Goals &amp; Task Distribution</h3>
                <div className="goals-breakdown-list">
                  {goals.map((goal) => {
                    const goalTasks = tasks.filter((t) => t.goalId === goal.id);
                    const done = goalTasks.filter((t) => t.completed).length;
                    const pct = goalTasks.length > 0 ? Math.round((done / goalTasks.length) * 100) : 0;

                    return (
                      <div key={goal.id} className="goal-progress-row">
                        <div className="goal-progress-info">
                          <span className="sketch-crayon-dot" style={{ backgroundColor: goal.color }} />
                          <strong className="goal-progress-title">{goal.title}</strong>
                          <span className="goal-progress-count">
                            {done}/{goalTasks.length} tasks ({pct}%)
                          </span>
                        </div>
                        <div className="sketch-bar-track">
                          <div
                            className="sketch-bar-fill"
                            style={{
                              width: `${pct}%`,
                              backgroundColor: goal.color,
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {activePage === 'manage' && (
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
    </div>
  );
}

export default App;
