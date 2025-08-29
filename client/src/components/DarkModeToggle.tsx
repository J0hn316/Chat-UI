import type { JSX } from 'react';

type DarkModeProps = {
  isDark: boolean;
  onToggle: () => void;
  className?: string;
  variant?: 'outline' | 'mask' | 'duotone' | 'solid';
};

const SunOutline = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
    <g
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2m0 16v2m10-10h-2M4 12H2m15.07-7.07-1.41 1.41M8.34 17.66l-1.41 1.41m12.14 0-1.41-1.41M8.34 6.34 6.93 4.93" />
    </g>
  </svg>
);

const MoonOutline = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
    <path
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      d="M20.354 14.354A8.5 8.5 0 0 1 9.646 3.646
         7.001 7.001 0 1 0 20.354 14.354z"
    />
  </svg>
);

const SunMasky = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
    <g fill="currentColor">
      <circle cx="12" cy="12" r="5" />
      <g stroke="currentColor" strokeLinecap="round" strokeWidth="2">
        <path d="M12 2v2M12 20v2M22 12h-2M4 12H2M18.36 5.64l-1.41 1.41M7.05 16.95l-1.41 1.41M18.36 18.36l-1.41-1.41M7.05 7.05 5.64 5.64" />
      </g>
    </g>
  </svg>
);

const MoonMask = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
    <defs>
      <mask id="moonCut">
        {/* White = keep, Black = cut out */}
        <rect width="100%" height="100%" fill="white" />
        {/* Cut a smaller circle to the right to form the crescent */}
        <circle cx="14" cy="10" r="7" fill="black" />
      </mask>
    </defs>
    <circle cx="10" cy="12" r="8" fill="currentColor" mask="url(#moonCut)" />
  </svg>
);

const SunDuotone = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
    <defs>
      <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="currentColor" stopOpacity="0.95" />
        <stop offset="60%" stopColor="currentColor" stopOpacity="0.6" />
        <stop offset="100%" stopColor="currentColor" stopOpacity="0.2" />
      </radialGradient>
    </defs>
    <circle cx="12" cy="12" r="5" fill="url(#sunGlow)" />
    <g stroke="currentColor" strokeLinecap="round" strokeWidth="1.8">
      <path d="M12 2.2v2.1M12 19.7v2.1M21.8 12h-2.1M4.3 12H2.2M18.1 5.9l-1.5 1.5M7.4 16.6l-1.5 1.5M18.1 18.1l-1.5-1.5M7.4 7.4 5.9 5.9" />
    </g>
  </svg>
);

const MoonDuotone = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
    <defs>
      <mask id="moonCut2">
        <rect width="100%" height="100%" fill="white" />
        <circle cx="15" cy="9" r="7" fill="black" />
      </mask>
    </defs>
    <g fill="currentColor">
      <circle cx="10" cy="12" r="8" mask="url(#moonCut2)" />
      {/* craters = same color but reduced opacity */}
      <circle cx="9" cy="10" r="1.1" opacity="0.35" />
      <circle cx="12" cy="14" r="0.9" opacity="0.35" />
      <circle cx="7.5" cy="14.5" r="0.6" opacity="0.35" />
    </g>
  </svg>
);

const SunSolid = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
    <g fill="currentColor">
      <circle cx="12" cy="12" r="5" />
      <rect x="11.5" y="1.5" width="1" height="3" rx="0.5" />
      <rect x="11.5" y="19.5" width="1" height="3" rx="0.5" />
      <rect x="19.5" y="11.5" width="3" height="1" rx="0.5" />
      <rect x="1.5" y="11.5" width="3" height="1" rx="0.5" />
      <rect
        x="17.4"
        y="4.6"
        width="1"
        height="3"
        rx="0.5"
        transform="rotate(45 18 6)"
      />
      <rect
        x="5.6"
        y="16.4"
        width="1"
        height="3"
        rx="0.5"
        transform="rotate(45 6 18)"
      />
      <rect
        x="16.4"
        y="17.4"
        width="1"
        height="3"
        rx="0.5"
        transform="rotate(135 16.9 18.9)"
      />
      <rect
        x="4.6"
        y="5.6"
        width="1"
        height="3"
        rx="0.5"
        transform="rotate(135 5.1 7.1)"
      />
    </g>
  </svg>
);

const MoonSolid = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
    <path
      fill="currentColor"
      d="
        M20.5 14.2c-1.4 3.9-5.7 6-9.7 4.7
        a8 8 0 0 1 1.5-15.6
        c.3 0 .6 0 .9.1
        a7 7 0 0 0 7.3 10.8Z"
    />
  </svg>
);

const Icon = ({
  isDark,
  variant = 'outline',
}: {
  isDark: boolean;
  variant?: DarkModeProps['variant'];
}) => {
  switch (variant) {
    case 'mask':
      return isDark ? <SunMasky /> : <MoonMask />;
    case 'duotone':
      return isDark ? <SunDuotone /> : <MoonDuotone />;
    case 'solid':
      return isDark ? <SunSolid /> : <MoonSolid />;
    case 'outline':
    default:
      return isDark ? <SunOutline /> : <MoonOutline />;
  }
};

const DarkModeToggle = ({
  isDark,
  onToggle,
  className = '',
  variant = 'outline',
}: DarkModeProps): JSX.Element => {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={isDark}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={`inline-flex items-center gap-2 rounded px-2 py-1 hover:bg-gray-700/60 focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
    >
      <span className="inline-block">
        <Icon isDark={isDark} variant={variant} />
      </span>
      <span className="text-sm">{isDark ? 'Light' : 'Dark'}</span>
    </button>
  );
};

export default DarkModeToggle;
