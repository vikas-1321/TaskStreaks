import { useMemo, useState } from 'react';
import { getTaskDaysActive } from '../utils/streakUtils.js';
import {
  CheckmarkSketch,
  CloseSketch,
  PencilSketch,
  PlusSketch,
  TapeStrip,
  TrashSketch,
} from './SketchIcons.jsx';

const emptyDraft = {
  title: '',
  goalId: '',
};

export default function TaskBoard({
  tasks,
  goals,
  title = "Today's tasks",
  isAddFormOpen,
  onCloseAddForm,
  onAddTask,
  onToggleTask,
  onDeleteTask,
  onEditTask,
}) {
  const [draft, setDraft] = useState(emptyDraft);
  const [editingTaskId, setEditingTaskId] = useState('');
  const [editingValue, setEditingValue] = useState(emptyDraft);

  const goalOptions = useMemo(
    () => [{ id: '', label: 'No long-term goal' }, ...goals.map((goal) => ({ id: goal.id, label: goal.title }))],
    [goals],
  );

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!draft.title.trim()) {
      return;
    }

    onAddTask({
      title: draft.title.trim(),
      goalId: draft.goalId || null,
    });

    setDraft(emptyDraft);
  };

  const beginEdit = (task) => {
    setEditingTaskId(task.id);
    setEditingValue({ title: task.title, goalId: task.goalId || '' });
  };

  const saveEdit = (taskId) => {
    if (!editingValue.title.trim()) {
      return;
    }

    onEditTask(taskId, {
      title: editingValue.title.trim(),
      goalId: editingValue.goalId || null,
    });

    setEditingTaskId('');
    setEditingValue(emptyDraft);
  };

  return (
    <section className="panel sketch-panel task-panel-card">
      <TapeStrip angle={-1.5} width={75} height={20} className="panel-tape" />

      <div className="panel-header">
        <div className="sketch-title-wrap">
          <span className="sketch-doodle-star">★</span>
          <h2>{title}</h2>
          <span className="sketch-counter-badge">{tasks.length}</span>
        </div>
      </div>

      {isAddFormOpen && (
        <div className="task-modal-backdrop" role="presentation" onMouseDown={onCloseAddForm}>
          <form
            className="task-modal sketch-card"
            onSubmit={(event) => {
              handleSubmit(event);
              onCloseAddForm();
            }}
            onMouseDown={(event) => event.stopPropagation()}
          >
            <TapeStrip angle={1.2} width={85} height={24} className="modal-tape" />
            <div className="panel-header">
              <div className="sketch-title-wrap">
                <PencilSketch size={20} color="#2563eb" />
                <h2>Add to your sketchbook</h2>
              </div>
              <button
                type="button"
                className="sketch-icon-button"
                onClick={onCloseAddForm}
                aria-label="Close modal"
              >
                <CloseSketch size={18} />
              </button>
            </div>

            <div className="modal-field">
              <label className="sketch-label" htmlFor="task-title-input">
                What will you accomplish today?
              </label>
              <input
                id="task-title-input"
                type="text"
                className="sketch-input"
                placeholder="e.g., Draw wireframes, practice code..."
                value={draft.title}
                onChange={(event) =>
                  setDraft((current) => ({ ...current, title: event.target.value }))
                }
                autoFocus
              />
            </div>

            <div className="modal-field">
              <label className="sketch-label" htmlFor="task-goal-select">
                Target / Goal
              </label>
              <select
                id="task-goal-select"
                className="sketch-select"
                value={draft.goalId}
                onChange={(event) =>
                  setDraft((current) => ({ ...current, goalId: event.target.value }))
                }
              >
                {goalOptions.map((goal) => (
                  <option key={goal.id || 'no-goal'} value={goal.id}>
                    {goal.label}
                  </option>
                ))}
              </select>
              <div className="task-lifetime-hint">
                {draft.goalId ? (
                  <span className="lifetime-badge goal-lifetime">
                    ⏳ <strong>Long-term Lifetime:</strong> Stays active in this goal across days until completed.
                  </span>
                ) : (
                  <span className="lifetime-badge daily-lifetime">
                    ⏱️ <strong>1-Day Lifetime:</strong> Active for today only.
                  </span>
                )}
              </div>
            </div>

            <div className="modal-actions">
              <button type="button" className="sketch-btn ghost" onClick={onCloseAddForm}>
                Cancel
              </button>
              <button type="submit" className="sketch-btn primary">
                <PlusSketch size={18} />
                <span>Sketch Task</span>
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="task-list">
        {tasks.length === 0 ? (
          <div className="empty-state sketch-empty-state">
            <div className="empty-doodle">
              <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                <rect
                  x="12"
                  y="10"
                  width="40"
                  height="46"
                  rx="4"
                  stroke="#94a3b8"
                  strokeWidth="2.5"
                  strokeDasharray="4 4"
                />
                <line x1="20" y1="22" x2="44" y2="22" stroke="#cbd5e1" strokeWidth="2.5" strokeLinecap="round" />
                <line x1="20" y1="32" x2="38" y2="32" stroke="#cbd5e1" strokeWidth="2.5" strokeLinecap="round" />
                <line x1="20" y1="42" x2="30" y2="42" stroke="#cbd5e1" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M42 40L48 46M48 46L54 40M48 46V30" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <p className="empty-title">Your page is completely blank!</p>
            <p className="empty-subtitle">
              Add your first task below to start building today&apos;s streak.
            </p>
          </div>
        ) : (
          tasks.map((task, idx) => {
            const goal = goals.find((entry) => entry.id === task.goalId);
            const isEditing = editingTaskId === task.id;
            // Slight alternating organic tilt for index-card feel
            const cardTilt = idx % 2 === 0 ? -0.3 : 0.4;

            return (
              <div
                key={task.id}
                className={`task-item sketch-item ${task.completed ? 'completed' : ''}`}
                style={{ transform: `rotate(${cardTilt}deg)` }}
              >
                {/* Hand-drawn checkbox */}
                <button
                  type="button"
                  className={`sketch-checkbox ${task.completed ? 'checked' : ''}`}
                  onClick={() => onToggleTask(task.id)}
                  aria-label={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
                >
                  {task.completed && <CheckmarkSketch size={18} color="#16a34a" />}
                </button>

                {isEditing ? (
                  <div className="task-edit">
                    <input
                      type="text"
                      className="sketch-input"
                      value={editingValue.title}
                      onChange={(event) =>
                        setEditingValue((current) => ({
                          ...current,
                          title: event.target.value,
                        }))
                      }
                      autoFocus
                    />
                    <select
                      className="sketch-select"
                      value={editingValue.goalId}
                      onChange={(event) =>
                        setEditingValue((current) => ({
                          ...current,
                          goalId: event.target.value,
                        }))
                      }
                    >
                      {goalOptions.map((option) => (
                        <option key={option.id || 'no-goal'} value={option.id}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <div className="card-actions">
                      <button
                        type="button"
                        className="sketch-btn secondary small"
                        onClick={() => saveEdit(task.id)}
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        className="sketch-btn ghost small"
                        onClick={() => setEditingTaskId('')}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="task-content">
                      <span
                        className="task-title"
                        title="Double-click to edit"
                        onDoubleClick={() => beginEdit(task)}
                      >
                        {task.title}
                        {task.completed && <span className="pencil-scratch-line" />}
                      </span>
                      <div className="task-meta-badges">
                        {goal ? (
                          <span
                            className="goal-badge sketch-goal-badge"
                            style={{
                              borderColor: goal.color,
                              backgroundColor: `${goal.color}15`,
                              color: goal.color,
                            }}
                          >
                            <span
                              className="goal-badge-dot"
                              style={{ backgroundColor: goal.color }}
                            />
                            {goal.title}
                            <span className="task-lifetime-text">
                              • Day {getTaskDaysActive(task)}
                            </span>
                          </span>
                        ) : (
                          <span className="daily-task-badge">
                            ⏱️ 1-day task
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="card-actions">
                      <button
                        type="button"
                        className="sketch-icon-button"
                        onClick={() => beginEdit(task)}
                        title="Edit task"
                        aria-label="Edit task"
                      >
                        <PencilSketch size={16} />
                      </button>
                      <button
                        type="button"
                        className="sketch-icon-button delete"
                        onClick={() => onDeleteTask(task.id)}
                        title="Erase task"
                        aria-label="Delete task"
                      >
                        <TrashSketch size={16} />
                      </button>
                    </div>
                  </>
                )}
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
