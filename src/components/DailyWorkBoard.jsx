import { useMemo, useState } from 'react';

const formatDateKey = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getWeekDates = () => {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const monday = new Date(today);
  monday.setDate(today.getDate() + mondayOffset);
  monday.setHours(0, 0, 0, 0);

  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + index);
    return {
      key: formatDateKey(date),
      label: date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
    };
  });
};

export default function DailyWorkBoard({ workItems, onAddWork, onToggleWork, onDeleteWork }) {
  const [draft, setDraft] = useState('');
  const dates = useMemo(getWeekDates, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    const title = draft.trim();

    if (!title) {
      return;
    }

    onAddWork(title);
    setDraft('');
  };

  return (
    <section className="panel daily-work-panel">
      <div className="panel-header">
        <div>
          <p className="eyebrow">Recurring routine</p>
          <h2>Daily work</h2>
        </div>
        <span className="daily-work-caption">Track the things you do every day</span>
      </div>

      <form className="daily-work-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Add daily work, like Brush teeth"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          aria-label="New daily work"
        />
        <button type="submit" className="primary-button">Add</button>
      </form>

      <div className="daily-work-grid" role="grid" aria-label="Daily work tracker">
        <div className="daily-work-header" role="row">
          <span className="daily-work-name-heading">Work</span>
          {dates.map((date) => <span key={date.key} role="columnheader">{date.label}</span>)}
          <span aria-hidden="true" />
        </div>

        {workItems.length === 0 ? (
          <p className="empty-state">Add a daily routine to start tracking it.</p>
        ) : (
          workItems.map((workItem) => (
            <div className="daily-work-row" role="row" key={workItem.id}>
              <span className="daily-work-name">{workItem.title}</span>
              {dates.map((date) => (
                <label className="daily-work-check" key={date.key}>
                  <input
                    type="checkbox"
                    checked={Boolean(workItem.completedBy?.[date.key])}
                    onChange={() => onToggleWork(workItem.id, date.key)}
                    aria-label={`${workItem.title} on ${date.label}`}
                  />
                </label>
              ))}
              <button
                type="button"
                className="daily-work-delete"
                onClick={() => onDeleteWork(workItem.id)}
                aria-label={`Delete ${workItem.title}`}
              >
                x
              </button>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
