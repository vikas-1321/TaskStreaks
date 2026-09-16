import { useMemo, useState } from 'react';
import {
  CheckmarkSketch,
  PlusSketch,
  TapeStrip,
  TrashSketch,
} from './SketchIcons.jsx';

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

  const todayKey = formatDateKey(today);

  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + index);
    const key = formatDateKey(date);
    return {
      key,
      dayName: date.toLocaleDateString('en-US', { weekday: 'narrow' }),
      shortName: date.toLocaleDateString('en-US', { weekday: 'short' }),
      dateNum: date.getDate(),
      isToday: key === todayKey,
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
    <section className="panel sketch-panel daily-work-panel">
      <TapeStrip angle={1.8} width={80} height={20} className="panel-tape right" />

      <div className="panel-header">
        <div>
          <span className="sketch-tag green-tag">Bullet Journal Tracker</span>
          <h2 className="sketch-h2">Daily Routines &amp; Habits</h2>
          <span className="daily-work-caption">
            Tick off your daily rituals to maintain unbroken weekly streaks.
          </span>
        </div>
      </div>

      <form className="daily-work-form sketch-form" onSubmit={handleSubmit}>
        <input
          type="text"
          className="sketch-input"
          placeholder="✏️ Add a daily habit (e.g. Read 20 mins, Drink 2L water, Stretch)..."
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          aria-label="New daily work"
        />
        <button type="submit" className="sketch-btn primary">
          <PlusSketch size={18} />
          <span>Add Routine</span>
        </button>
      </form>

      <div className="daily-work-grid-wrap">
        <div className="daily-work-grid sketch-table" role="grid" aria-label="Daily work tracker">
          <div className="daily-work-header sketch-tr" role="row">
            <span className="daily-work-name-heading" role="columnheader">
              Habit / Routine
            </span>
            {dates.map((date) => (
              <span
                key={date.key}
                role="columnheader"
                className={`daily-work-col-header ${date.isToday ? 'today-col' : ''}`}
                title={date.shortName}
              >
                <span className="col-day">{date.shortName}</span>
                <span className="col-num">{date.dateNum}</span>
                {date.isToday && <span className="today-badge">today</span>}
              </span>
            ))}
            <span className="daily-work-stat-heading">Done</span>
            <span aria-hidden="true" className="daily-work-del-col" />
          </div>

          {workItems.length === 0 ? (
            <div className="empty-state sketch-empty-state">
              <p className="empty-title">No habits logged yet!</p>
              <p className="empty-subtitle">
                Add daily micro-habits like reading, meditating, or coding to track your consistency.
              </p>
            </div>
          ) : (
            workItems.map((workItem) => {
              const weekCompletedCount = dates.filter(
                (d) => workItem.completedBy?.[d.key],
              ).length;

              return (
                <div className="daily-work-row sketch-tr" role="row" key={workItem.id}>
                  <div className="daily-work-name-cell">
                    <span className="daily-work-bullet">○</span>
                    <span className="daily-work-name">{workItem.title}</span>
                  </div>

                  {dates.map((date) => {
                    const isChecked = Boolean(workItem.completedBy?.[date.key]);
                    return (
                      <div className="daily-work-cell" key={date.key}>
                        <button
                          type="button"
                          className={`sketch-habit-box ${isChecked ? 'checked' : ''} ${
                            date.isToday ? 'is-today' : ''
                          }`}
                          onClick={() => onToggleWork(workItem.id, date.key)}
                          aria-label={`${workItem.title} on ${date.shortName} ${date.dateNum}`}
                        >
                          {isChecked && <CheckmarkSketch size={16} color="#059669" />}
                        </button>
                      </div>
                    );
                  })}

                  <div className="daily-work-stat-cell">
                    <span className="habit-score-pill">
                      {weekCompletedCount}/7
                    </span>
                  </div>

                  <div className="daily-work-action-cell">
                    <button
                      type="button"
                      className="sketch-icon-button delete"
                      onClick={() => onDeleteWork(workItem.id)}
                      aria-label={`Delete ${workItem.title}`}
                      title="Delete habit"
                    >
                      <TrashSketch size={15} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}
