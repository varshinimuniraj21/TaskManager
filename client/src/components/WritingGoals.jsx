import React from 'react';
import { Target, TrendingUp } from 'lucide-react';
import { QuillIcon } from '../assets/assets';

export default function WritingGoals({ stats }) {
  const dailyTarget = stats?.dailyTarget || 100;
  const dailyCompleted = stats?.dailyCompleted || 100;
  const weeklyTarget = stats?.weeklyTarget || 300;
  const weeklyProgress = stats?.weeklyMiles || 250;

  // Percentage calculations
  const dailyPct = Math.min(100, Math.round((dailyCompleted / (dailyTarget || 1)) * 100));
  const weeklyPct = Math.min(100, Math.round((weeklyProgress / (weeklyTarget || 1)) * 100));

  // Circular gauge circumference (r = 38) -> 2 * PI * 38 = ~238.76
  const strokeDash = 238.76;
  const dailyOffset = strokeDash - (strokeDash * dailyPct) / 100;
  const weeklyOffset = strokeDash - (strokeDash * weeklyPct) / 100;

  return (
    <div className="bg-[#D2DBE2] border border-[#BAC5CE] rounded-3xl p-5 shadow-xs flex flex-col justify-between">
      {/* Header matching blueprint */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <QuillIcon className="w-4 h-4 text-[#2E4154]" color="#2E4154" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#243444] font-serif">
            Writing Goals
          </h2>
        </div>
        <span className="text-[11px] font-semibold text-[#4A5D6E] bg-white/60 px-2 py-0.5 rounded-md border border-[#BAC5CE]">
          Progress
        </span>
      </div>

      {/* Dual Radial Circular Progress Gauges */}
      <div className="grid grid-cols-2 gap-3 my-auto">
        {/* Daily Word Count / Daily Productivity */}
        <div className="bg-white/90 rounded-2xl p-3 flex flex-col items-center text-center shadow-2xs border border-[#C6D1DA]">
          <span className="text-[11px] font-medium text-[#657685] leading-tight mb-2 h-7 flex items-center">
            Daily Word Count
          </span>
          <div className="relative w-24 h-24 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              {/* Background circle */}
              <circle
                cx="50"
                cy="50"
                r="38"
                stroke="#E5EAEF"
                strokeWidth="7"
                fill="transparent"
              />
              {/* Progress circle */}
              <circle
                cx="50"
                cy="50"
                r="38"
                stroke="#C2A888"
                strokeWidth="7"
                strokeDasharray={strokeDash}
                strokeDashoffset={dailyOffset}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-700 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-base font-bold text-[#2A3744] font-serif leading-none">
                {dailyCompleted}
              </span>
              <span className="text-[9px] text-[#7B8B99] uppercase tracking-wider mt-0.5">
                Words
              </span>
            </div>
          </div>
        </div>

        {/* Weekly Miles / Target Progress */}
        <div className="bg-white/90 rounded-2xl p-3 flex flex-col items-center text-center shadow-2xs border border-[#C6D1DA]">
          <span className="text-[11px] font-medium text-[#657685] leading-tight mb-2 h-7 flex items-center">
            Weekly Miles
          </span>
          <div className="relative w-24 h-24 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              {/* Background circle */}
              <circle
                cx="50"
                cy="50"
                r="38"
                stroke="#E5EAEF"
                strokeWidth="7"
                fill="transparent"
              />
              {/* Progress circle */}
              <circle
                cx="50"
                cy="50"
                r="38"
                stroke="#476077"
                strokeWidth="7"
                strokeDasharray={strokeDash}
                strokeDashoffset={weeklyOffset}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-700 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-base font-bold text-[#2A3744] font-serif leading-none">
                {weeklyProgress}
              </span>
              <span className="text-[9px] text-[#7B8B99] uppercase tracking-wider mt-0.5">
                progs
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
