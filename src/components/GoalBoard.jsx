import { useState } from 'react';
import {
  PencilSketch,
  PlusSketch,
  PushPinSketch,
  TapeStrip,
  TrashSketch,
} from './SketchIcons.jsx';

const emptyGoalDraft = {
  title: '',
  description: '',
  color: '#3b82f6',
};

const presetColors = [
  '#3b82f6', // blue pencil
  '#10b981', // green pencil
  '#f59e0b', // amber pencil
  '#ef4444', // coral red
  '#8b5cf6', // purple crayon
  '#ec4899', // pink highlighter
  '#06b6d4', // cyan marker
];

export default function GoalBoard({ goals, onAddGoal, onDeleteGoal, onUpdateGoal }) {
  const [draft, setDraft] = useState(emptyGoalDraft);
  const [editingGoalId, setEditingGoalId] = useState('');
  const [editedGoal, setEditedGoal] = useState(emptyGoalDraft);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!draft.title.trim()) {
      return;
    }

    onAddGoal({
      id: crypto.randomUUID(),
      title: draft.title.trim(),
      description: draft.description.trim(),
      color: draft.color,
    });

    setDraft(emptyGoalDraft);
  };

  const startEditing = (goal) => {
    setEditingGoalId(goal.id);
    setEditedGoal({
      title: goal.title,
      description: goal.description,
      color: goal.color,
    });
  };

  const submitEdit = (goalId) => {
    if (!editedGoal.title.trim()) {
      return;
    }

    onUpdateGoal(goalId, {
      title: editedGoal.title.trim(),
      description: editedGoal.description.trim(),
      color: editedGoal.color,
    });

    setEditingGoalId('');
    setEditedGoal(emptyGoalDraft);
  };

  return (
    <section className="panel sketch-panel goal-board-panel">
      <TapeStrip angle={-2} width={90} height={22} className="panel-tape" />

      <div className="panel-header">
        <div>
          <span className="sketch-tag purple-tag">Vision Board</span>
          <h2 className="sketch-h2">Long-Term Goals</h2>
          <p className="sketch-subtext">
            Pin your high-level milestones here and tag daily tasks to them.
          </p>
        </div>
      </div>

      <form className="goal-form sketch-card new-goal-card" onSubmit={handleSubmit}>
        <div className="goal-form-fields">
          <input
            type="text"
            className="sketch-input"
            placeholder="🎯 Goal title (e.g. Master React, Run 5k)"
            value={draft.title}
            onChange={(event) =>
              setDraft((current) => ({ ...current, title: event.target.value }))
            }
          />
          <input
            type="text"
            className="sketch-input"
            placeholder="Short motivational note or target date..."
            value={draft.description}
            onChange={(event) =>
              setDraft((current) => ({ ...current, description: event.target.value }))
            }
          />
        </div>

        <div className="color-picker-row">
          <span className="sketch-label">Crayon Color:</span>
          <div className="preset-colors">
            {presetColors.map((color) => (
              <button
                key={color}
                type="button"
                className={`color-swatch-dot ${draft.color === color ? 'selected' : ''}`}
                style={{ backgroundColor: color }}
                onClick={() => setDraft((current) => ({ ...current, color }))}
                aria-label={`Select color ${color}`}
              />
            ))}
          </div>
          <button type="submit" className="sketch-btn primary">
            <PlusSketch size={18} />
            <span>Pin Goal</span>
          </button>
        </div>
      </form>

      <div className="goal-list sketch-corkboard">
        {goals.map((goal, index) => {
          const isEditing = editingGoalId === goal.id;
          const cardTilt = index % 2 === 0 ? -0.8 : 0.7;

          return (
            <div
              key={goal.id}
              className="goal-card sketch-pinned-card"
              style={{
                borderTopColor: goal.color,
                transform: `rotate(${cardTilt}deg)`,
              }}
            >
              <PushPinSketch className="goal-pin" color={goal.color} />

              {isEditing ? (
                <div className="goal-edit">
                  <input
                    type="text"
                    className="sketch-input"
                    value={editedGoal.title}
                    onChange={(event) =>
                      setEditedGoal((current) => ({ ...current, title: event.target.value }))
                    }
                  />
                  <input
                    type="text"
                    className="sketch-input"
                    value={editedGoal.description}
                    onChange={(event) =>
                      setEditedGoal((current) => ({
                        ...current,
                        description: event.target.value,
                      }))
                    }
                  />
                  <div className="color-picker-row">
                    <span className="sketch-label">Color:</span>
                    <div className="preset-colors">
                      {presetColors.map((color) => (
                        <button
                          key={color}
                          type="button"
                          className={`color-swatch-dot ${editedGoal.color === color ? 'selected' : ''
                            }`}
                          style={{ backgroundColor: color }}
                          onClick={() =>
                            setEditedGoal((current) => ({ ...current, color }))
                          }
                        />
                      ))}
                    </div>
                  </div>
                  <div className="card-actions">
                    <button
                      type="button"
                      className="sketch-btn secondary small"
                      onClick={() => submitEdit(goal.id)}
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      className="sketch-btn ghost small"
                      onClick={() => setEditingGoalId('')}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="goal-top-row">
                    <span
                      className="goal-dot sketch-bullet-dot"
                      style={{ background: goal.color }}
                    />
                    <h3 className="goal-title">{goal.title}</h3>
                  </div>
                  <p className="goal-desc">{goal.description || 'No notes added yet.'}</p>
                  <div className="card-actions">
                    <button
                      type="button"
                      className="sketch-icon-button"
                      onClick={() => startEditing(goal)}
                      title="Edit goal"
                      aria-label="Edit goal"
                    >
                      <PencilSketch size={16} />
                    </button>
                    <button
                      type="button"
                      className="sketch-icon-button delete"
                      onClick={() => onDeleteGoal(goal.id)}
                      title="Delete goal"
                      aria-label="Delete goal"
                    >
                      <TrashSketch size={16} />
                    </button>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
