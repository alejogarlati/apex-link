import React from 'react';

/**
 * BMW M Design System Tokens & Brand Elements
 * Reference: https://getdesign.md/bmw-m/design-md
 */
export const BMW_M = {
  colors: {
    canvas: '#000000',
    surfaceSoft: '#0d0d0d',
    surfaceCard: '#1a1a1a',
    surfaceElevated: '#262626',
    carbonGray: '#2b2b2b',
    hairline: '#3c3c3c',
    hairlineStrong: '#262626',
    ink: '#ffffff',
    bodyStrong: '#e6e6e6',
    body: '#bbbbbb',
    muted: '#7e7e7e',
    mBlueLight: '#0066b1',
    mBlueDark: '#1c69d4',
    mRed: '#e22718', // M-Power signature Red
    mRedGlow: 'rgba(226, 39, 24, 0.45)',
  },
} as const;

/**
 * 4px horizontal structural divider carrying the M tricolor
 * Light Blue (#0066b1) -> Dark Blue (#1c69d4) -> M-Red (#e22718)
 */
export const MTricolorStripe: React.FC<{ className?: string; height?: string }> = ({
  className = '',
  height = 'h-1',
}) => {
  return (
    <div className={`w-full flex shrink-0 ${height} ${className}`}>
      <div className="flex-1 bg-[#0066b1]" />
      <div className="flex-1 bg-[#1c69d4]" />
      <div className="flex-1 bg-[#e22718]" />
    </div>
  );
};

/**
 * Slanted M motorsport stripes (Brand accent)
 */
export const MSlantedBadge: React.FC<{ height?: string }> = ({ height = 'h-9' }) => {
  return (
    <div className={`inline-flex items-center gap-1 -skew-x-[16deg] select-none ${height}`}>
      <span className="w-2.5 h-full bg-[#0066b1]" />
      <span className="w-2.5 h-full bg-[#1c69d4]" />
      <span className="w-2.5 h-full bg-[#e22718]" />
    </div>
  );
};
