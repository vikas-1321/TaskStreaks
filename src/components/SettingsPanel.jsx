import { TapeStrip, TargetSketch } from './SketchIcons.jsx';

export default function SettingsPanel({ settings, onChange }) {
  const handleChange = (event) => {
    const { name, value } = event.target;
    const nextValue =
      name === 'dailyTaskTarget' ? Math.max(1, Number(value) || 1) : Number(value);
    onChange({ ...settings, [name]: nextValue });
  };

  return (
    <section className="panel sketch-panel settings-sketch-panel">
      <TapeStrip angle={2.2} width={75} height={20} className="panel-tape right" />

      <div className="panel-header">
        <div className="sketch-title-wrap">
          <TargetSketch size={22} color="#0284c7" />
          <h2 className="sketch-h2">Streak Rules</h2>
        </div>
      </div>

      <div className="settings-grid">
        <div className="field sketch-field-card">
          <label htmlFor="daily-task-target" className="sketch-label">
            <span>Daily Minimum Tasks</span>
            <span className="field-hint">Target to activate streak count</span>
          </label>
          <div className="stepper-wrap">
            <button
              type="button"
              className="sketch-step-btn"
              onClick={() =>
                onChange({
                  ...settings,
                  dailyTaskTarget: Math.max(1, settings.dailyTaskTarget - 1),
                })
              }
              aria-label="Decrease target"
            >
              -
            </button>
            <input
              id="daily-task-target"
              type="number"
              name="dailyTaskTarget"
              min="1"
              max="20"
              className="sketch-input number-input"
              value={settings.dailyTaskTarget}
              onChange={handleChange}
            />
            <button
              type="button"
              className="sketch-step-btn"
              onClick={() =>
                onChange({
                  ...settings,
                  dailyTaskTarget: Math.min(20, settings.dailyTaskTarget + 1),
                })
              }
              aria-label="Increase target"
            >
              +
            </button>
          </div>
        </div>

        <div className="field sketch-field-card">
          <label htmlFor="completion-slider" className="sketch-label">
            <span>Pass Threshold</span>
            <span className="field-hint">Min % of tasks completed</span>
          </label>
          <div className="input-with-suffix">
            <input
              id="completion-slider"
              type="range"
              name="completionPercentage"
              min="10"
              max="100"
              step="5"
              className="sketch-range-slider"
              value={settings.completionPercentage}
              onChange={handleChange}
            />
            <strong className="sketch-badge percent-badge">
              {settings.completionPercentage}%
            </strong>
          </div>
        </div>
      </div>

      <div className="sketch-rule-note">
        <h4 className="note-title">📝 Habit Manifesto</h4>
        <ul className="rule-list sketch-checklist">
          <li>
            <span className="sketch-check-icon">✓</span>
            Log at least <strong>{settings.dailyTaskTarget}</strong> task
            {settings.dailyTaskTarget > 1 ? 's' : ''} each day.
          </li>
          <li>
            <span className="sketch-check-icon">✓</span>
            Reach at least <strong>{settings.completionPercentage}%</strong> completion to
            keep your streak flame burning.
          </li>
          <li>
            <span className="sketch-check-icon">✓</span>
            Consistency over perfection—drawing one line every day builds masterpieces.
          </li>
        </ul>
      </div>
    </section>
  );
}
