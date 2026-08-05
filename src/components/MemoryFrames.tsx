import React from 'react';

// Abstract silhouettes: Rick C-137 (left), young Beth (center), Diane (right)
export const FamilyPhoto: React.FC = () => (
  <svg viewBox="0 0 220 150" className="w-full h-full" aria-label="Family silhouette" preserveAspectRatio="xMidYMid meet">
    {/* Rick: tall hair + coat */}
    <path d="M38 62 Q40 16 56 28 Q74 14 70 56 Q74 60 72 72 L72 120 L38 120 L38 72 Q34 66 38 62 Z" fill="#0b0a10" />
    <ellipse cx="55" cy="46" rx="13" ry="15" fill="#0b0a10" />
    {/* Beth: small child, center */}
    <path d="M88 112 Q86 108 92 104 L92 88 Q94 74 100 74 Q106 74 108 88 L108 104 Q114 108 112 112 Z" fill="#0b0a10" />
    <circle cx="100" cy="66" r="8" fill="#0b0a10" />
    {/* Diane: long hair + dress */}
    <path d="M132 64 Q128 44 148 42 Q166 42 166 60 Q170 72 168 76 L166 120 L130 120 L130 76 Q124 74 132 64 Z" fill="#0b0a10" />
    <ellipse cx="150" cy="46" rx="11" ry="14" fill="#0b0a10" />
  </svg>
);

// The last dinner before the crater: silhouettes seated around the table
export const DinnerTableFrame: React.FC = () => (
  <svg viewBox="0 0 220 150" className="w-full h-full" aria-label="Dinner table silhouette" preserveAspectRatio="xMidYMid meet">
    {/* Rick (left, seated, hunched, spiky hair) */}
    <path d="M50 110 Q48 70 60 60 Q64 42 78 52 Q90 48 96 64 Q106 68 104 84 L100 110 Q75 110 50 110 Z" fill="#0b0a10" />
    {/* Young Beth (center, small child) */}
    <circle cx="118" cy="70" r="10" fill="#0b0a10" />
    <path d="M108 92 Q108 80 118 80 Q128 80 128 92 L128 112 L108 112 Z" fill="#0b0a10" />
    {/* Diane (right, long hair) */}
    <path d="M148 110 Q146 68 158 62 Q168 58 172 66 Q182 70 180 86 L176 110 Q162 110 148 110 Z" fill="#0b0a10" />
    {/* Table */}
    <ellipse cx="112" cy="116" rx="86" ry="11" fill="#0b0a10" />
    <rect x="104" y="118" width="16" height="26" fill="#0b0a10" />
    {/* Plate on the table */}
    <ellipse cx="118" cy="108" rx="13" ry="4" fill="#0b0a10" />
  </svg>
);
