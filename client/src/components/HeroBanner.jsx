import React from 'react';
import { Search, Filter, Sparkles } from 'lucide-react';
import { IMAGES, QuillIcon } from '../assets/assets';

export default function HeroBanner({ 
  searchQuery, 
  setSearchQuery, 
  filterPriority, 
  setFilterPriority,
  filterStatus,
  setFilterStatus
}) {
  return (
    <div className="relative mb-6">
      {/* Panoramic Vintage Typewriter Desk Photograph */}
      <div className="w-full h-56 md:h-64 lg:h-72 rounded-3xl overflow-hidden relative shadow-md border border-[#E3DFD5]">
        <img
          src={IMAGES.heroBanner}
          alt="Vintage Typewriter Desk"
          className="w-full h-full object-cover object-center transform hover:scale-[1.01] transition duration-700"
        />
        {/* Subtle ambient lighting vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10"></div>
      </div>

      {/* Floating Feather Quill Emblem (overlapping bottom-left of the banner image) */}
      <div className="absolute -bottom-5 left-8 w-14 h-14 rounded-2xl bg-[#F7F5F0] border border-[#DDD7CD] shadow-lg flex items-center justify-center z-10">
        <QuillIcon className="w-8 h-8 text-[#2A3C4D]" color="#2A3C4D" />
      </div>

      {/* Centered Editorial Titles matching blueprint */}
      <div className="pt-8 pb-4 text-center">
        <h1 className="font-serif tracking-[0.18em] text-2xl md:text-3xl lg:text-4xl font-bold text-[#2A2723] uppercase">
          Creative Writer's Hub
        </h1>
        <p className="font-sans text-xs md:text-sm font-semibold tracking-[0.25em] text-[#787168] uppercase mt-1">
          Digital Journal &amp; Planner
        </p>

        {/* Search & Productivity Filters */}
        <div className="mt-5 max-w-xl mx-auto flex flex-col sm:flex-row items-center gap-2 px-2">
          {/* Search Bar */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-[#8C857B] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tasks, notes, manuscripts..."
              className="w-full pl-9 pr-3 py-1.5 rounded-full bg-[#FFFFFF]/90 border border-[#DBD5CA] text-xs text-[#2A2723] placeholder-[#9E968B] focus:outline-none focus:ring-2 focus:ring-[#283845] transition shadow-xs"
            />
          </div>

          {/* Priority filter */}
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="w-full sm:w-auto px-3 py-1.5 rounded-full bg-[#FFFFFF]/90 border border-[#DBD5CA] text-xs font-medium text-[#4A4640] focus:outline-none focus:ring-2 focus:ring-[#283845] shadow-xs cursor-pointer"
          >
            <option value="all">All Priorities</option>
            <option value="High">High Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="Low">Low Priority</option>
          </select>

          {/* Status filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full sm:w-auto px-3 py-1.5 rounded-full bg-[#FFFFFF]/90 border border-[#DBD5CA] text-xs font-medium text-[#4A4640] focus:outline-none focus:ring-2 focus:ring-[#283845] shadow-xs cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>
    </div>
  );
}
