export function FlameSketch({ className = '', size = 24, color = '#f97316' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`sketch-icon ${className}`}
      style={{ filter: 'url(#sketch-filter)' }}
    >
      <path d="M12 3C10.5 6 7 8 7 13.5C7 17.5 9.5 21 13 21C16.5 21 19 17.5 19 13.5C19 9.5 15.5 8 15 5C14.5 7.5 13 9 12 10.5C11 9 11.5 6 12 3Z" />
      <path d="M12.5 14C11.5 14 10.5 15 10.5 16.5C10.5 18 11.5 19 13 19C14.5 19 15.5 18 15.5 16.5C15.5 15 14 14.5 13.5 13.5C13 14 12.8 14 12.5 14Z" fill={color} fillOpacity="0.2" />
    </svg>
  );
}

export function TrophySketch({ className = '', size = 24, color = '#eab308' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`sketch-icon ${className}`}
      style={{ filter: 'url(#sketch-filter)' }}
    >
      <path d="M6 5H18V10C18 13.3 15.3 16 12 16C8.7 16 6 13.3 6 10V5Z" />
      <path d="M6 7H3.5C2.7 7 2 7.7 2 8.5C2 10.5 3.5 12 5.5 12H6" />
      <path d="M18 7H20.5C21.3 7 22 7.7 22 8.5C22 10.5 20.5 12 18.5 12H18" />
      <path d="M12 16V19" />
      <path d="M8 21H16" />
      <path d="M10 21L11 19H13L14 21" />
    </svg>
  );
}

export function TargetSketch({ className = '', size = 24, color = '#0284c7' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`sketch-icon ${className}`}
      style={{ filter: 'url(#sketch-filter)' }}
    >
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" strokeDasharray="3 2" />
      <circle cx="12" cy="12" r="1.5" fill={color} />
      <path d="M12 2V4M12 20V22M2 12H4M20 12H22" />
    </svg>
  );
}

export function CheckmarkSketch({ className = '', size = 20, color = '#16a34a' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`sketch-icon ${className}`}
    >
      <path d="M4 12.5L9.5 18L20 6" className="sketch-check-path" />
    </svg>
  );
}

export function PencilSketch({ className = '', size = 22, color = '#475569' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`sketch-icon ${className}`}
    >
      <path d="M17 3C17.8 2.2 19.2 2.2 20 3C20.8 3.8 20.8 5.2 20 6L7 19L3 20L4 16L17 3Z" />
      <path d="M14 6L17 9" />
      <path d="M6.5 13.5L9.5 16.5" />
    </svg>
  );
}

export function PlusSketch({ className = '', size = 20, color = 'currentColor' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
      className={`sketch-icon ${className}`}
    >
      <path d="M12 4.5V19.5" />
      <path d="M4.5 12H19.5" />
    </svg>
  );
}

export function TrashSketch({ className = '', size = 18, color = 'currentColor' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`sketch-icon ${className}`}
    >
      <path d="M3 6H21" />
      <path d="M19 6L18 20C18 20.6 17.5 21 17 21H7C6.5 21 6 20.6 6 20L5 6" />
      <path d="M9 6V4C9 3.4 9.4 3 10 3H14C14.6 3 15 3.4 15 4V6" />
      <path d="M10 11V16" />
      <path d="M14 11V16" />
    </svg>
  );
}

export function SparkleSketch({ className = '', size = 20, color = '#eab308' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={color}
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      className={`sketch-icon ${className}`}
    >
      <path d="M12 2L13.8 8.2L20 10L13.8 11.8L12 18L10.2 11.8L4 10L10.2 8.2L12 2Z" />
    </svg>
  );
}

export function PushPinSketch({ className = '', size = 24, color = '#ef4444' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={`sketch-pin ${className}`}
    >
      <circle cx="12" cy="7" r="5" fill={color} stroke="#1e293b" strokeWidth="2" />
      <circle cx="10" cy="5" r="1.5" fill="#ffffff" opacity="0.6" />
      <path d="M12 12V21L14 17" stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

export function TapeStrip({ className = '', angle = -2, width = 70, height = 22 }) {
  return (
    <div
      className={`washi-tape ${className}`}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        transform: `rotate(${angle}deg)`,
      }}
      aria-hidden="true"
    />
  );
}

export function CloseSketch({ className = '', size = 18, color = 'currentColor' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
      className={`sketch-icon ${className}`}
    >
      <path d="M18 6L6 18M6 6L18 18" />
    </svg>
  );
}
