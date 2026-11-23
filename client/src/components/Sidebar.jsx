import React from 'react';
import { 
  PenTool, 
  BookOpen, 
  BookMarked, 
  Users, 
  Compass, 
  FileText, 
  Lightbulb, 
  ClipboardCheck,
  CheckCircle2,
  FolderPlus,
  Plus
} from 'lucide-react';
import { QuillIcon } from '../assets/assets';

export default function Sidebar({ 
  activeFilter, 
  setActiveFilter, 
  onNewTask, 
  onNewProject 
}) {
  const navItems = [
    { id: 'all', label: 'Dashboard', icon: PenTool },
    { id: 'manuscripts', label: 'Manuscripts', icon: BookOpen },
    { id: 'character-bible', label: 'Character Bible', icon: BookMarked },
    { id: 'world-building', label: 'World Building', icon: Users },
    { id: 'plotting', label: 'Plotting', icon: Compass },
    { id: 'writing-prompts', label: 'Writing Prompts', icon: FileText },
    { id: 'research-notes', label: 'Research Notes', icon: Lightbulb },
    { id: 'submission-tracker', label: 'Submission Tracker', icon: ClipboardCheck },
  ];

  return (
    <aside className="w-64 flex-shrink-0 bg-[#EFECE6] border-r border-[#E0DCD3] flex flex-col justify-between p-4 overflow-y-auto min-h-screen">
      <div>
        {/* Top Navigation Links matching blueprint */}
        <div className="space-y-1 mb-6">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeFilter === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveFilter(item.id)}
                className={`w-full flex items-center space-x-2.5 px-3 py-1.5 rounded-md text-xs font-medium transition text-left ${
                  isActive
                    ? 'bg-[#E3DFD5] text-[#242220] font-semibold'
                    : 'text-[#5C5751] hover:bg-[#E8E4DA] hover:text-[#242220]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#242220]' : 'text-[#7D776F]'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Center Feather Quill Flourish */}
        <div className="flex flex-col items-center justify-center my-4 py-2 border-t border-b border-[#E3DFD5]/70">
          <QuillIcon className="w-12 h-12 text-[#2B2825]" color="#2B2825" />
          <span className="text-[10px] tracking-widest uppercase font-serif text-[#78726A] mt-1">
            Taskflow Desk
          </span>
        </div>

        {/* Vertical Stack of Colored Blueprint Cards */}
        <div className="space-y-3 pt-2">
          {/* Card 1: Manuscripts (Warm Ivory) */}
          <button
            onClick={() => setActiveFilter('manuscripts')}
            className={`w-full p-4 rounded-2xl flex flex-col items-center justify-center text-center transition shadow-xs border ${
              activeFilter === 'manuscripts'
                ? 'bg-[#E5DFD4] border-[#C8C0B2] ring-2 ring-[#283845]'
                : 'bg-[#EAE5DC] border-[#DDD7CD] hover:bg-[#E4DED4]'
            }`}
          >
            <div className="w-8 h-8 rounded-full bg-white/70 flex items-center justify-center mb-2 shadow-xs">
              <BookOpen className="w-4 h-4 text-[#423E39]" />
            </div>
            <span className="text-xs font-semibold text-[#302D29]">Manuscripts</span>
          </button>

          {/* Card 2: World Building (Off-white) */}
          <button
            onClick={() => setActiveFilter('world-building')}
            className={`w-full p-4 rounded-2xl flex flex-col items-center justify-center text-center transition shadow-xs border ${
              activeFilter === 'world-building'
                ? 'bg-[#ECE8E0] border-[#CBC4B8] ring-2 ring-[#283845]'
                : 'bg-[#F4F1EA] border-[#E5E0D7] hover:bg-[#EDE9E0]'
            }`}
          >
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center mb-2 shadow-xs">
              <Users className="w-4 h-4 text-[#423E39]" />
            </div>
            <span className="text-xs font-semibold text-[#302D29]">World Building</span>
          </button>

          {/* Card 3: Plotting (Dark Slate Blue - Feature Card in Blueprint) */}
          <button
            onClick={() => setActiveFilter('plotting')}
            className={`w-full p-4 rounded-2xl flex flex-col items-center justify-center text-center transition shadow-md border ${
              activeFilter === 'plotting'
                ? 'bg-[#1E2B35] border-[#131C23] ring-2 ring-[#C8C0B2]'
                : 'bg-[#293B4C] border-[#22313F] hover:bg-[#202F3D]'
            } text-white`}
          >
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center mb-2">
              <Compass className="w-4 h-4 text-white" />
            </div>
            <span className="text-xs font-semibold tracking-wide">Plotting</span>
          </button>

          {/* Card 4: Writing Prompts (Soft Stone) */}
          <button
            onClick={() => setActiveFilter('writing-prompts')}
            className={`w-full p-4 rounded-2xl flex flex-col items-center justify-center text-center transition shadow-xs border ${
              activeFilter === 'writing-prompts'
                ? 'bg-[#DDD8CF] border-[#BFB8AC] ring-2 ring-[#283845]'
                : 'bg-[#E3DFD6] border-[#D6D0C5] hover:bg-[#DDD8CC]'
            }`}
          >
            <div className="w-8 h-8 rounded-full bg-white/70 flex items-center justify-center mb-2 shadow-xs">
              <FileText className="w-4 h-4 text-[#423E39]" />
            </div>
            <span className="text-xs font-semibold text-[#302D29]">Writing Prompts</span>
          </button>

          {/* Card 5: Research Notes (Warm Tan / Caramel) */}
          <button
            onClick={() => setActiveFilter('research-notes')}
            className={`w-full p-4 rounded-2xl flex flex-col items-center justify-center text-center transition shadow-xs border ${
              activeFilter === 'research-notes'
                ? 'bg-[#D6BE9F] border-[#BAA181] ring-2 ring-[#283845]'
                : 'bg-[#DFCAA9] border-[#CEB896] hover:bg-[#D8C2A0]'
            }`}
          >
            <div className="w-8 h-8 rounded-full bg-white/70 flex items-center justify-center mb-2 shadow-xs">
              <Lightbulb className="w-4 h-4 text-[#4A3C26]" />
            </div>
            <span className="text-xs font-semibold text-[#3D301D]">Research Notes</span>
          </button>

          {/* Card 6: Submission Tracker (Warm Off-white) */}
          <button
            onClick={() => setActiveFilter('submission-tracker')}
            className={`w-full p-4 rounded-2xl flex flex-col items-center justify-center text-center transition shadow-xs border ${
              activeFilter === 'submission-tracker'
                ? 'bg-[#ECE8E0] border-[#CBC4B8] ring-2 ring-[#283845]'
                : 'bg-[#F2EFE8] border-[#E2DDD3] hover:bg-[#EAE6DC]'
            }`}
          >
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center mb-2 shadow-xs">
              <ClipboardCheck className="w-4 h-4 text-[#423E39]" />
            </div>
            <span className="text-xs font-semibold text-[#302D29]">Submission Tracker</span>
          </button>
        </div>
      </div>

      {/* Quick Action Buttons at bottom of sidebar */}
      <div className="pt-6 border-t border-[#E3DFD5] space-y-2">
        <button
          onClick={onNewTask}
          className="w-full flex items-center justify-center space-x-1.5 py-2 px-3 rounded-xl bg-[#283845] hover:bg-[#1E2B35] text-white text-xs font-semibold shadow-sm transition"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Task</span>
        </button>
        <button
          onClick={onNewProject}
          className="w-full flex items-center justify-center space-x-1.5 py-1.5 px-3 rounded-xl bg-[#E2DDCF] hover:bg-[#D6D0C0] text-[#332F2B] text-xs font-medium transition"
        >
          <FolderPlus className="w-3.5 h-3.5" />
          <span>New Project</span>
        </button>
      </div>
    </aside>
  );
}
