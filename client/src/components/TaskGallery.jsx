import React from 'react';
import { BookOpen, Plus, LayoutGrid, CheckCircle, Clock, AlertCircle, Edit3, Trash2 } from 'lucide-react';
import { IMAGES } from '../assets/assets';

export default function TaskGallery({ 
  tasks = [], 
  onNewTask, 
  onEditTask, 
  onDeleteTask, 
  onToggleStatus 
}) {
  // Default mock cards if database has 0 tasks, so blueprint is 100% accurate on initial load
  const fallbackTasks = [
    {
      _id: 'default-b1',
      title: 'Book 1',
      status: 'In Progress',
      priority: 'High',
      coverImage: IMAGES.bookSilentHours,
      category: 'Manuscript',
    },
    {
      _id: 'default-b2',
      title: 'Book 2',
      status: 'Editing',
      priority: 'Medium',
      coverImage: IMAGES.bookEchoes,
      category: 'Manuscript',
    },
    {
      _id: 'default-b3',
      title: 'Book 3',
      status: 'Outline',
      priority: 'Low',
      coverImage: IMAGES.bookVintageJournal,
      category: 'Manuscript',
    },
    {
      _id: 'default-b4',
      title: 'Book 4',
      status: 'Editing',
      priority: 'Medium',
      coverImage: IMAGES.bookSciFi,
      category: 'Manuscript',
    },
    {
      _id: 'default-b5',
      title: 'Book 5',
      status: 'Outline',
      priority: 'Low',
      coverImage: IMAGES.bookNoir,
      category: 'Manuscript',
    },
  ];

  const displayTasks = tasks.length > 0 ? tasks : fallbackTasks;

  // Badge styling matching blueprint
  const getStatusBadge = (status) => {
    switch (status) {
      case 'In Progress':
        return 'bg-[#FFF3D6] text-[#8C6D1F] border-[#E8D4A2]';
      case 'Editing':
        return 'bg-[#E3EBF3] text-[#2C5282] border-[#C2D4E8]';
      case 'Outline':
      case 'Pending':
        return 'bg-[#ECE8E1] text-[#635D54] border-[#D6CFC3]';
      case 'Completed':
        return 'bg-[#E6F4EA] text-[#137333] border-[#CEEAD6]';
      default:
        return 'bg-[#EFECE6] text-[#4F4B43] border-[#DDD8CD]';
    }
  };

  return (
    <div className="bg-[#CED7E0] border border-[#B8C5D1] rounded-3xl p-5 shadow-xs mb-6">
      {/* Header matching blueprint */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <BookOpen className="w-4 h-4 text-[#283C4F]" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#213242] font-serif">
            My Manuscripts
          </h2>
        </div>
        <div className="flex items-center space-x-2">
          <button className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-white/70 text-[11px] font-semibold text-[#3D5266] border border-[#B8C5D1]">
            <LayoutGrid className="w-3 h-3 text-[#5A7187]" />
            <span>Gallery View</span>
          </button>
          <button
            onClick={onNewTask}
            className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-[#283C4F] hover:bg-[#1E2E3E] text-white text-[11px] font-semibold shadow-xs transition"
          >
            <Plus className="w-3 h-3" />
            <span>Add Task</span>
          </button>
        </div>
      </div>

      {/* Horizontal Gallery of 5 Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5">
        {displayTasks.slice(0, 5).map((task, idx) => (
          <div
            key={task._id || idx}
            className="group bg-white rounded-xl p-2.5 border border-[#BCC9D6] hover:border-[#8FA3B5] hover:shadow-md transition duration-200 flex flex-col justify-between"
          >
            {/* Book Cover Thumbnail */}
            <div className="w-full h-28 rounded-lg overflow-hidden bg-[#ECE8E1] mb-2 relative">
              <img
                src={task.coverImage || fallbackTasks[idx % fallbackTasks.length].coverImage}
                alt={task.title}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition duration-300"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = fallbackTasks[idx % fallbackTasks.length].coverImage;
                }}
              />
              {/* Quick Actions overlay on hover */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center space-x-2 backdrop-blur-2xs">
                {onEditTask && (
                  <button
                    onClick={() => onEditTask(task)}
                    className="p-1 rounded bg-white text-[#213242] hover:bg-amber-100"
                    title="Edit Task"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                )}
                {onDeleteTask && (
                  <button
                    onClick={() => onDeleteTask(task._id)}
                    className="p-1 rounded bg-white text-red-600 hover:bg-red-100"
                    title="Delete Task"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Title & Status Badge */}
            <div>
              <div className="flex items-center space-x-1.5 mb-1.5">
                <BookOpen className="w-3 h-3 text-[#6A7E91] flex-shrink-0" />
                <h3 className="text-xs font-bold text-[#233240] truncate" title={task.title}>
                  {task.title}
                </h3>
              </div>
              <button
                onClick={() => onToggleStatus && onToggleStatus(task)}
                className={`w-full py-0.5 px-2 rounded text-[10px] font-semibold border text-center transition block truncate ${getStatusBadge(
                  task.status
                )}`}
                title="Click to cycle status"
              >
                {task.status || 'Outline'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
