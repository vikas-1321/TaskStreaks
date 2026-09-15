export default function SettingsPanel({ settings, onChange }) {
  const handleChange = (event) => {
    const { name, value } = event.target;
    const nextValue = name === 'dailyTaskTarget' ? Math.max(1, Number(value) || 1) : Number(value);
    onChange({ ...settings, [name]: nextValue });
  };

  return (
    <section className="panel">
      <div className="panel-header">
        <h2>Daily rules</h2>
      </div>

      <div className="settings-grid">
        <label className="field">
          <span>Tasks per day</span>
          <input
            type="number"
            name="dailyTaskTarget"
            min="1"
            max="20"
            value={settings.dailyTaskTarget}
            onChange={handleChange}
          />
        </label>

        <label className="field">
          <span>Completion target</span>
          <div className="input-with-suffix">
            <input
              type="range"
              name="completionPercentage"
              min="10"
              max="100"
              step="5"
              value={settings.completionPercentage}
              onChange={handleChange}
            />
            <strong>{settings.completionPercentage}%</strong>
          </div>
        </label>
      </div>

      <ul className="rule-list">
        <li>At least 1 task is required every day.</li>
        <li>Tasks must reach the configured percentage to keep the streak alive.</li>
      </ul>
    </section>
  );
}
