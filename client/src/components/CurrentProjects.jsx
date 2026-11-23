import React from 'react';
import { LayoutGrid, Plus, Edit2, Trash2, FolderGit2 } from 'lucide-react';
import { QuillIcon, InkSplatter, IMAGES } from '../assets/assets';

export default function CurrentProjects({ 
  projects = [], 
  onNewProject, 
  onEditProject, 
  onDeleteProject,
  onSelectProject,
  selectedProjectId 
}) {
  // Fallback sample cards if user hasn't added projects yet to match blueprint immediately
  const displayProjects = projects.length > 0 ? projects : [
    {
      _id: 'default-1',
      title: 'The Silent Hours',
      category: 'Mystery',
      coverImage: IMAGES.bookSilentHours,
      progress: 45,
    },
    {
      _id: 'default-2',
      title: 'Echoes of Memory',
      category: 'Sci-Fi',
      coverImage: IMAGES.bookEchoes,
      progress: 72,
    },
    {
      _id: 'default-3',
      title: 'The Silent Hours II',
      category: 'Sci-Fi',
      coverImage: IMAGES.manuscriptDesk,
      progress: 28,
    },
  ];

  return (
    <div className="bg-[#F3EFE7] border border-[#DDD7CD] rounded-3xl p-5 shadow-xs relative flex flex-col justify-between overflow-hidden">
      <div>
        {/* Card Header matching blueprint */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <QuillIcon className="w-4 h-4 text-[#3A3632]" color="#3A3632" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#2D2A26] font-serif">
              Current Projects
            </h2>
          </div>
          <button
            onClick={onNewProject}
            className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-white/80 hover:bg-white text-[11px] font-semibold text-[#4A453F] border border-[#DDD7CD] shadow-2xs transition"
          >
            <LayoutGrid className="w-3 h-3 text-[#706B63]" />
            <span>⊞ Projects</span>
            <Plus className="w-3 h-3 ml-0.5 text-[#2A3C4D]" />
          </button>
        </div>

        {/* 2x2 Grid of Project Cards */}
        <div className="grid grid-cols-2 gap-3.5 relative z-10">
          {displayProjects.map((project) => {
            const isSelected = selectedProjectId === project._id;
            return (
              <div
                key={project._id}
                onClick={() => onSelectProject && onSelectProject(project._id)}
                className={`group bg-white rounded-xl p-2.5 border transition duration-200 cursor-pointer shadow-xs ${
                  isSelected 
                    ? 'border-[#2A3C4D] ring-2 ring-[#2A3C4D]/30' 
                    : 'border-[#E5E0D7] hover:border-[#C4BCAD] hover:shadow-sm'
                }`}
              >
                {/* Cover Thumbnail */}
                <div className="w-full h-24 rounded-lg overflow-hidden bg-[#ECE8E1] mb-2 relative">
                  <img
                    src={project.coverImage || IMAGES.bookSilentHours}
                    alt={project.title}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition duration-300"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = IMAGES.bookSilentHours;
                    }}
                  />
                  {/* Action buttons on hover */}
                  <div className="absolute top-1 right-1 flex space-x-1 opacity-0 group-hover:opacity-100 transition bg-black/40 p-1 rounded backdrop-blur-xs">
                    {onEditProject && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditProject(project);
                        }}
                        className="text-white hover:text-amber-300"
                        title="Edit Project"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                    )}
                    {onDeleteProject && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteProject(project._id);
                        }}
                        className="text-white hover:text-red-400"
                        title="Delete Project"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Project Details */}
                <h3 className="text-xs font-bold text-[#2A2724] truncate" title={project.title}>
                  {project.title}
                </h3>
                <p className="text-[10px] font-medium text-[#7A746C] truncate mt-0.5">
                  {project.category || 'General'}
                </p>

                {/* Progress bar */}
                <div className="mt-2">
                  <div className="w-full h-1.5 bg-[#EAE6DE] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#2A3C4D] rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, Math.max(0, project.progress || 0))}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Decorative Ink Splatter in bottom right corner matching blueprint */}
      <div className="absolute -bottom-2 -right-2 pointer-events-none opacity-80 z-0">
        <InkSplatter className="w-16 h-16 text-[#242220]" />
      </div>
    </div>
  );
}
