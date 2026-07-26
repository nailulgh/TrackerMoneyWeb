import React, { useMemo } from 'react';
import { useTransactionStore } from '../store/useTransactionStore';
import { getMonthExpenseSummary, formatCurrency, CATEGORY_COLORS, getLastSixMonths } from '../lib/stats';

export const ExpensesDonutCard: React.FC = () => {
  const { transactions } = useTransactionStore();
  const recentMonths = useMemo(() => getLastSixMonths(), []);
  const currentMonth = recentMonths[0];

  const summary = getMonthExpenseSummary(transactions, currentMonth.value);

  // If no transactions, fallback to 0
  const totalExpense = summary.totalExpense > 0 ? summary.totalExpense : 0;

  // Use actual summary categories, no mock fallback
  const categories = summary.categories;

  // SVG Donut calculation
  const size = 160;
  const strokeWidth = 24;
  const center = size / 2;
  const radius = center - strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;

  let cumulativeAngle = -90; // start at top

  // Calculate arc segments for SVG
  const arcSegments = categories.map((cat) => {
    const strokeDasharray = `${(cat.percentage / 100) * circumference} ${circumference}`;
    const angleOffset = (cumulativeAngle * Math.PI) / 180;
    
    // Middle angle of segment for badge positioning
    const segmentAngle = (cat.percentage / 100) * 360;
    const midAngle = cumulativeAngle + segmentAngle / 2;
    const midRad = (midAngle * Math.PI) / 180;

    // Badge coordinate
    const badgeRadius = radius;
    const badgeX = center + badgeRadius * Math.cos(midRad);
    const badgeY = center + badgeRadius * Math.sin(midRad);

    cumulativeAngle += segmentAngle;

    return {
      ...cat,
      strokeDasharray,
      rotation: (cumulativeAngle - segmentAngle + 90), // stroke offset angle
      badgeX,
      badgeY,
    };
  });

  return (
    <div className="bg-white rounded-3xl p-6 shadow-[0_10px_30px_rgba(0,0,0,0.04)] border border-white/60">
      <div className="mb-3">
        <h2 className="text-xl font-bold text-[#1b1c1c] tracking-tight">
          Pengeluaran
        </h2>
        <p className="text-xs font-semibold text-[#767586] mt-0.5">
          {currentMonth.label}
        </p>
      </div>

      <div className="text-2xl font-extrabold text-[#ff914d] mb-4">
        {formatCurrency(totalExpense)}
      </div>

      <div className="flex items-center justify-between gap-4">
        {/* Left: Donut Chart with floating badges */}
        <div className="relative w-40 h-40 flex items-center justify-center shrink-0">
          <svg className="w-full h-full transform -rotate-90" viewBox={`0 0 ${size} ${size}`}>
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="transparent"
              stroke="#F0F0FA"
              strokeWidth={strokeWidth}
            />
            {arcSegments.map((segment, index) => {
              const dashOffset = 0;
              return (
                <circle
                  key={segment.category + index}
                  cx={center}
                  cy={center}
                  r={radius}
                  fill="transparent"
                  stroke={segment.color}
                  strokeWidth={strokeWidth}
                  strokeDasharray={segment.strokeDasharray}
                  strokeDashoffset={dashOffset}
                  transform={`rotate(${segment.rotation} ${center} ${center})`}
                  strokeLinecap="round"
                  className="transition-all duration-500 hover:opacity-90 cursor-pointer"
                />
              );
            })}
          </svg>

          {/* Percentage Badges matching design */}
          {arcSegments.map((segment, index) => (
            <div
              key={'badge-' + index}
              className="absolute bg-white/95 backdrop-blur-xs text-[10px] font-bold text-[#1b1c1c] px-1.5 py-0.5 rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.08)] -translate-x-1/2 -translate-y-1/2 pointer-events-none"
              style={{
                left: `${(segment.badgeX / size) * 100}%`,
                top: `${(segment.badgeY / size) * 100}%`,
              }}
            >
              {segment.percentage}%
            </div>
          ))}
        </div>

        {/* Right: Legend Breakdown */}
        <div className="flex-1 space-y-3 pl-2">
          {categories.map((cat) => (
            <div key={cat.category} className="flex items-start space-x-2.5">
              <span
                className="w-2.5 h-2.5 rounded-full mt-1 shrink-0"
                style={{ backgroundColor: cat.color }}
              />
              <div className="leading-tight">
                <div className="text-sm font-bold text-[#1b1c1c]">
                  {cat.category}
                </div>
                <div
                  className="text-xs font-semibold mt-0.5"
                  style={{ color: cat.color }}
                >
                  {formatCurrency(cat.amount)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
