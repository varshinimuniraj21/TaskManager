import React from 'react';
import { ListChecks, Check, Plus } from 'lucide-react';
import { QuillIcon } from '../assets/assets';

export default function HabitTracker({ 
  habits = [], 
  onToggleHabit, 
  onAddHabit 
}) {
  const defaultHabits = [
    { id: 'h1', text: 'Write 1000 words', completed: true },
    { id: 'h2', text: 'Read a chapter', completed: true },
    { id: 'h3', text: 'Write 1000 words', completed: true },
    { id: 'h4', text: 'Brainstorm', completed: true },
    { id: 'h5', text: 'Read more words', completed: true },
    { id: 'h6', text: 'Review chapter', completed: true },
  ];

  const items = habits.length > 0 ? habits : defaultHabits;

  return (
    <div className="bg-[#F3EFE7] border border-[#DDD7CD] rounded-3xl p-5 shadow-xs flex flex-col justify-between">
      <div>
        {/* Header matching blueprint */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <QuillIcon className="w-4 h-4 text-[#3A3632]" color="#3A3632" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#2D2A26] font-serif">
              Habit Tracker
            </h2>
          </div>
          <button
            onClick={onAddHabit}
            className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-white/80 hover:bg-white text-[11px] font-semibold text-[#4A453F] border border-[#DDD7CD] shadow-2xs transition"
          >
            <ListChecks className="w-3 h-3 text-[#706B63]" />
            <span>Habits</span>
            <Plus className="w-3 h-3 ml-0.5 text-[#2A3C4D]" />
          </button>
        </div>

        {/* Habit Checklist matching blueprint */}
        <div className="space-y-2.5">
          {items.map((habit) => (
            <div
              key={habit.id || habit._id}
              onClick={() => onToggleHabit && onToggleHabit(habit.id || habit._id)}
              className="flex items-center justify-between py-1 px-1.5 rounded-lg hover:bg-black/5 cursor-pointer transition select-none group"
            >
              <span
                className={`text-xs font-medium transition ${
                  habit.completed
                    ? 'text-[#615C54]'
                    : 'text-[#2D2A26] font-semibold'
                }`}
              >
                {habit.text || habit.title}
              </span>

              {/* Styled Checkbox matching blueprint blue button */}
              <div
                className={`w-4 h-4 rounded flex items-center justify-center transition border ${
                  habit.completed
                    ? 'bg-[#5B84B1] border-[#4A6F96] text-white shadow-2xs'
                    : 'bg-white border-[#C9C2B5] group-hover:border-[#5B84B1]'
                }`}
              >
                {habit.completed && <Check className="w-3 h-3 stroke-[3]" />}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
