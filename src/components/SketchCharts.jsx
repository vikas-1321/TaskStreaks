import { useState } from 'react';
import { SparkleSketch } from './SketchIcons.jsx';

export function HandDrawnProgressRing({
  percentage = 0,
  targetPercentage = 75,
  completedCount = 0,
  totalCount = 0,
}) {
  const safePercent = Math.min(100, Math.max(0, Math.round(percentage)));
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeOffset = circumference - (safePercent / 100) * circumference;
  const isGoalMet = safePercent >= targetPercentage && totalCount > 0;

  return (
    <div className="sketch-ring-card">
      <div className="sketch-ring-container">
        <svg
          className="sketch-ring-svg"
          viewBox="0 0 140 140"
          width="130"
          height="130"
        >
          {/* Subtle wobbly outer guide ring */}
          <circle
            cx="70"
            cy="70"
            r={radius}
            fill="none"
            stroke="#e2ded4"
            strokeWidth="8"
            strokeDasharray="4 3"
            className="sketch-ring-track"
          />

          {/* Secondary hand-drawn sketchy guide line */}
          <circle
            cx="70"
            cy="70"
            r={radius + 4}
            fill="none"
            stroke="#ece8de"
            strokeWidth="1.5"
            strokeDasharray="2 4"
          />

          {/* Active progress stroke */}
          <circle
            cx="70"
            cy="70"
            r={radius}
            fill="none"
            stroke={isGoalMet ? '#16a34a' : '#3b82f6'}
            strokeWidth="9"
            strokeDasharray={circumference}
            strokeDashoffset={strokeOffset}
            strokeLinecap="round"
            className="sketch-ring-progress"
            transform="rotate(-90 70 70)"
            style={{
              transition: 'stroke-dashoffset 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
              filter: 'url(#sketch-filter)',
            }}
          />

          {/* Target marker notch on the ring */}
          {targetPercentage > 0 && targetPercentage < 100 && (
            <line
              x1="70"
              y1="8"
              x2="70"
              y2="18"
              stroke="#f59e0b"
              strokeWidth="3"
              strokeLinecap="round"
              transform={`rotate(${(targetPercentage / 100) * 360} 70 70)`}
            />
          )}
        </svg>

        {/* Center label */}
        <div className="sketch-ring-inner">
          <span className="sketch-ring-num">{safePercent}%</span>
          <span className="sketch-ring-sub">
            {totalCount > 0 ? `${completedCount}/${totalCount} done` : 'No tasks'}
          </span>
        </div>
      </div>

      <div className="sketch-ring-meta">
        <div className="sketch-ring-headline">
          {safePercent >= 100 ? (
            <span className="ring-status perfect">
              <SparkleSketch size={16} /> All tasks crushed!
            </span>
          ) : isGoalMet ? (
            <span className="ring-status met">🎯 Goal reached today!</span>
          ) : (
            <span className="ring-status progress">
              Target: {targetPercentage}%
            </span>
          )}
        </div>
        <p className="sketch-ring-tip">
          {totalCount === 0
            ? 'Add tasks to start your daily sketch.'
            : isGoalMet
            ? 'Great job keeping the streak alive!'
            : `${Math.max(0, Math.ceil((targetPercentage / 100) * totalCount) - completedCount)} more to secure your streak!`}
        </p>
      </div>
    </div>
  );
}

export function HandDrawnTrendChart({ tasks = [], settings = { completionPercentage: 75 } }) {
  const [hoveredDay, setHoveredDay] = useState(null);

  // Compute the last 7 days metrics
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const key = `${year}-${month}-${day}`;
    const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
    const dayNum = d.getDate();

    const dayTasks = tasks.filter((t) => t.date === key);
    const total = dayTasks.length;
    const completed = dayTasks.filter((t) => t.completed).length;
    const rate = total === 0 ? 0 : Math.round((completed / total) * 100);

    return {
      key,
      dayName,
      dayNum,
      total,
      completed,
      rate,
      isToday: i === 6,
    };
  });

  const chartWidth = 340;
  const chartHeight = 120;
  const paddingX = 24;
  const paddingY = 16;
  const availableWidth = chartWidth - paddingX * 2;
  const availableHeight = chartHeight - paddingY * 2;

  // Calculate points for the wavy sketch line
  const points = last7Days.map((item, index) => {
    const x = paddingX + (index / 6) * availableWidth;
    const y = paddingY + availableHeight - (item.rate / 100) * availableHeight;
    return { ...item, x, y };
  });

  // Create smooth Bezier curve through points with slight sketch waviness
  let pathD = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const current = points[i];
    const next = points[i + 1];
    const cpX1 = current.x + (next.x - current.x) * 0.45;
    const cpY1 = current.y;
    const cpX2 = current.x + (next.x - current.x) * 0.55;
    const cpY2 = next.y;
    pathD += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${next.x} ${next.y}`;
  }

  const targetY =
    paddingY +
    availableHeight -
    ((settings.completionPercentage || 75) / 100) * availableHeight;

  return (
    <div className="sketch-chart-widget">
      <div className="sketch-chart-header">
        <div>
          <span className="sketch-tag yellow-tag">Weekly Sketch</span>
          <h3 className="sketch-chart-title">7-Day Consistency Curve</h3>
        </div>
        <div className="sketch-legend">
          <span className="legend-target">
            <span className="legend-dashed" /> Target {settings.completionPercentage}%
          </span>
        </div>
      </div>

      <div className="sketch-chart-canvas-wrap">
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="sketch-chart-svg"
          preserveAspectRatio="none"
        >
          {/* Subtle ruled guide lines */}
          <line
            x1={paddingX}
            y1={paddingY}
            x2={chartWidth - paddingX}
            y2={paddingY}
            stroke="#ebe6db"
            strokeDasharray="3 3"
            strokeWidth="1"
          />
          <line
            x1={paddingX}
            y1={paddingY + availableHeight / 2}
            x2={chartWidth - paddingX}
            y2={paddingY + availableHeight / 2}
            stroke="#ebe6db"
            strokeDasharray="3 3"
            strokeWidth="1"
          />
          <line
            x1={paddingX}
            y1={paddingY + availableHeight}
            x2={chartWidth - paddingX}
            y2={paddingY + availableHeight}
            stroke="#dfd9cc"
            strokeWidth="1.5"
          />

          {/* Dashed Target line */}
          <line
            x1={paddingX}
            y1={targetY}
            x2={chartWidth - paddingX}
            y2={targetY}
            stroke="#f59e0b"
            strokeDasharray="4 4"
            strokeWidth="1.8"
            className="target-threshold-line"
          />

          {/* Area fill under curve with hatched/tinted sketch look */}
          <path
            d={`${pathD} L ${points[points.length - 1].x} ${
              paddingY + availableHeight
            } L ${points[0].x} ${paddingY + availableHeight} Z`}
            fill="rgba(59, 130, 246, 0.08)"
          />

          {/* Pencil curve line */}
          <path
            d={pathD}
            fill="none"
            stroke="#2563eb"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ filter: 'url(#sketch-filter)' }}
            className="sketch-trend-line"
          />

          {/* Data point circles */}
          {points.map((pt) => {
            const isHovered = hoveredDay?.key === pt.key;
            const isSuccess = pt.rate >= (settings.completionPercentage || 75);
            return (
              <g
                key={pt.key}
                onMouseEnter={() => setHoveredDay(pt)}
                onMouseLeave={() => setHoveredDay(null)}
                style={{ cursor: 'pointer' }}
              >
                {/* Invisible hit area */}
                <circle cx={pt.x} cy={pt.y} r="14" fill="transparent" />

                {/* Hand-drawn point marker */}
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isHovered ? '6' : '4.5'}
                  fill={isSuccess ? '#16a34a' : pt.total === 0 ? '#cbd5e1' : '#3b82f6'}
                  stroke="#1e293b"
                  strokeWidth="1.8"
                  style={{
                    transition: 'r 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  }}
                />
              </g>
            );
          })}
        </svg>

        {/* Hover Post-it Tooltip */}
        {hoveredDay && (
          <div
            className="sketch-tooltip"
            style={{
              left: `${(hoveredDay.x / chartWidth) * 100}%`,
              bottom: '48px',
            }}
          >
            <div className="tooltip-day">{hoveredDay.dayName}, {hoveredDay.dayNum}</div>
            <div className="tooltip-rate">{hoveredDay.rate}% completed</div>
            <div className="tooltip-count">
              {hoveredDay.completed}/{hoveredDay.total} tasks
            </div>
          </div>
        )}
      </div>

      {/* Day label pills */}
      <div className="sketch-chart-days">
        {last7Days.map((d) => (
          <button
            key={d.key}
            type="button"
            className={`sketch-day-col ${d.isToday ? 'today' : ''} ${
              hoveredDay?.key === d.key ? 'active' : ''
            }`}
            onMouseEnter={() => setHoveredDay(d)}
            onMouseLeave={() => setHoveredDay(null)}
          >
            <span className="day-name">{d.dayName}</span>
            <span className="day-rate-pill" style={{
              background: d.rate >= (settings.completionPercentage || 75)
                ? '#dcfce7'
                : d.total > 0
                ? '#fef3c7'
                : '#f1f5f9',
              color: d.rate >= (settings.completionPercentage || 75)
                ? '#15803d'
                : d.total > 0
                ? '#b45309'
                : '#64748b',
            }}>
              {d.rate}%
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
