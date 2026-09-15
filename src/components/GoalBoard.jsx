  import { useState } from 'react';

const emptyGoalDraft = {
  title: '',
  description: '',
  color: '#8b5cf6',
};

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
    <section className="panel">
      <div className="panel-header">
        <h2>Long-term goals</h2>
      </div>

      <form className="goal-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Goal title"
          value={draft.title}
          onChange={(event) => setDraft((current) => ({ ...current, title: event.target.value }))}
        />
        <input
          type="text"
          placeholder="Short description"
          value={draft.description}
          onChange={(event) => setDraft((current) => ({ ...current, description: event.target.value }))}
        />
        <div className="color-picker">
          <label>Color</label>
          <input
            type="color"
            value={draft.color}
            onChange={(event) => setDraft((current) => ({ ...current, color: event.target.value }))}
          />
        </div>
        <button type="submit" className="primary-button">Add goal</button>
      </form>

      <div className="goal-list">
        {goals.map((goal) => (
          <div key={goal.id} className="goal-card" style={{ borderLeftColor: goal.color }}>
            {editingGoalId === goal.id ? (
              <div className="goal-edit">
                <input
                  type="text"
                  value={editedGoal.title}
                  onChange={(event) => setEditedGoal((current) => ({ ...current, title: event.target.value }))}
                />
                <input
                  type="text"
                  value={editedGoal.description}
                  onChange={(event) => setEditedGoal((current) => ({ ...current, description: event.target.value }))}
                />
                <div className="color-picker">
                  <label>Color</label>
                  <input
                    type="color"
                    value={editedGoal.color}
                    onChange={(event) => setEditedGoal((current) => ({ ...current, color: event.target.value }))}
                  />
                </div>
                <div className="card-actions">
                  <button type="button" className="secondary-button" onClick={() => submitEdit(goal.id)}>Save</button>
                  <button type="button" className="ghost-button" onClick={() => setEditingGoalId('')}>Cancel</button>
                </div>
              </div>
            ) : (
              <>
                <div className="goal-top-row">
                  <span className="goal-dot" style={{ background: goal.color }} />
                  <h3>{goal.title}</h3>
                </div>
                <p>{goal.description || 'No description yet'}</p>
                <div className="card-actions">
                  <button type="button" className="secondary-button" onClick={() => startEditing(goal)}>Edit</button>
                  <button type="button" className="ghost-button" onClick={() => onDeleteGoal(goal.id)}>Delete</button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
