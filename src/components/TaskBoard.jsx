import { useMemo, useState } from 'react';

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
    <section className="panel">
      <div className="panel-header">
        <h2>{title}</h2>
      </div>

      {isAddFormOpen && (
        <div className="task-modal-backdrop" role="presentation" onMouseDown={onCloseAddForm}>
          <form className="task-modal" onSubmit={(event) => { handleSubmit(event); onCloseAddForm(); }} onMouseDown={(event) => event.stopPropagation()}>
            <div className="panel-header">
              <h2>Add a task</h2>
              <button type="button" className="ghost-button" onClick={onCloseAddForm}>Close</button>
            </div>
            <input
              type="text"
              placeholder="Add a task for today"
              value={draft.title}
              onChange={(event) => setDraft((current) => ({ ...current, title: event.target.value }))}
              autoFocus
            />
            <select
              value={draft.goalId}
              onChange={(event) => setDraft((current) => ({ ...current, goalId: event.target.value }))}
            >
              {goalOptions.map((goal) => (
                <option key={goal.id || 'no-goal'} value={goal.id}>{goal.label}</option>
              ))}
            </select>
            <button type="submit" className="primary-button">Add task</button>
          </form>
        </div>
      )}

      <div className="task-list">
        {tasks.length === 0 ? (
          <p className="empty-state">No tasks yet. Add one to begin your streak.</p>
        ) : (
          tasks.map((task) => {
            const goal = goals.find((entry) => entry.id === task.goalId);

            return (
              <div key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
                <label className="task-check">
                  <input type="checkbox" checked={task.completed} onChange={() => onToggleTask(task.id)} />
                </label>

                {editingTaskId === task.id ? (
                  <div className="task-edit">
                    <input
                      type="text"
                      value={editingValue.title}
                      onChange={(event) => setEditingValue((current) => ({ ...current, title: event.target.value }))}
                    />
                    <select
                      value={editingValue.goalId}
                      onChange={(event) => setEditingValue((current) => ({ ...current, goalId: event.target.value }))}
                    >
                      {goalOptions.map((option) => (
                        <option key={option.id || 'no-goal'} value={option.id}>{option.label}</option>
                      ))}
                    </select>
                    <div className="card-actions">
                      <button type="button" className="secondary-button" onClick={() => saveEdit(task.id)}>Save</button>
                      <button type="button" className="ghost-button" onClick={() => setEditingTaskId('')}>Cancel</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="task-content">
                      <span className="task-title" onDoubleClick={() => beginEdit(task)}>{task.title}</span>
                      {goal && <span className="goal-badge" style={{ background: goal.color }}>{goal.title}</span>}
                    </div>

                    <div className="card-actions">
                      <button type="button" className="ghost-button" onClick={() => onDeleteTask(task.id)}>Delete</button>
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
