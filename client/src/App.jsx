import React, { useState, useMemo } from 'react';
import WindowHeader from './components/WindowHeader';
import Sidebar from './components/Sidebar';
import HeroBanner from './components/HeroBanner';
import CurrentProjects from './components/CurrentProjects';
import WritingGoals from './components/WritingGoals';
import QuoteAccentCard from './components/QuoteAccentCard';
import TaskGallery from './components/TaskGallery';
import IdeaBoard from './components/IdeaBoard';
import HabitTracker from './components/HabitTracker';
import TaskModal from './components/TaskModal';
import ProjectModal from './components/ProjectModal';
import NoteModal from './components/NoteModal';
import AuthModal from './components/AuthModal';
import { useAuth } from './context/AuthContext';
import { useTasks } from './context/TaskContext';
import { HelpCircle, Sparkles, CheckCircle2 } from 'lucide-react';

export default function App() {
  const { user } = useAuth();
  const {
    tasks,
    projects,
    notes,
    habits,
    stats,
    notification,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskStatus,
    createProject,
    updateProject,
    deleteProject,
    createNote,
    deleteNote,
    toggleHabit,
    addHabit,
  } = useTasks();

  // Navigation & Filter states
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedProjectId, setSelectedProjectId] = useState(null);

  // Modals state
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState(null);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);

  // Filter tasks based on search, priority, status, sidebar selection, and project selection
  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      // Sidebar category filter
      if (activeFilter !== 'all') {
        const cat = (t.category || '').toLowerCase();
        if (activeFilter === 'manuscripts' && !cat.includes('manuscript') && !t.title.toLowerCase().includes('book')) return false;
        if (activeFilter === 'world-building' && !cat.includes('world')) return false;
        if (activeFilter === 'plotting' && !cat.includes('plot')) return false;
        if (activeFilter === 'writing-prompts' && !cat.includes('prompt')) return false;
        if (activeFilter === 'research-notes' && !cat.includes('research')) return false;
        if (activeFilter === 'submission-tracker' && !cat.includes('submission')) return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchTitle = t.title?.toLowerCase().includes(query);
        const matchDesc = t.description?.toLowerCase().includes(query);
        if (!matchTitle && !matchDesc) return false;
      }

      // Priority filter
      if (filterPriority !== 'all' && t.priority !== filterPriority) return false;

      // Status filter
      if (filterStatus !== 'all' && t.status !== filterStatus) return false;

      // Selected project filter
      if (selectedProjectId && t.projectId !== selectedProjectId && t.projectId?._id !== selectedProjectId) {
        return false;
      }

      return true;
    });
  }, [tasks, activeFilter, searchQuery, filterPriority, filterStatus, selectedProjectId]);

  const handleOpenNewTask = () => {
    if (!user) {
      setIsAuthOpen(true);
      return;
    }
    setTaskToEdit(null);
    setIsTaskModalOpen(true);
  };

  const handleOpenEditTask = (task) => {
    setTaskToEdit(task);
    setIsTaskModalOpen(true);
  };

  const handleOpenNewProject = () => {
    if (!user) {
      setIsAuthOpen(true);
      return;
    }
    setProjectToEdit(null);
    setIsProjectModalOpen(true);
  };

  const handleOpenEditProject = (project) => {
    setProjectToEdit(project);
    setIsProjectModalOpen(true);
  };

  const handleOpenNewNote = () => {
    if (!user) {
      setIsAuthOpen(true);
      return;
    }
    setIsNoteModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#E5E1D8] p-2 md:p-6 lg:p-8 flex items-center justify-center font-sans antialiased text-[#282522]">
      {/* Outer macOS-style application window shell matching blueprint */}
      <div className="w-full max-w-[1380px] bg-[#FAF8F5] rounded-3xl shadow-2xl border border-[#D6CFC3] overflow-hidden flex flex-col min-h-[92vh]">
        {/* Top Window Header */}
        <WindowHeader onOpenAuth={() => setIsAuthOpen(true)} />

        {/* Notification Toast */}
        {notification && (
          <div className="bg-[#283845] text-white text-xs py-2 px-4 flex items-center justify-center space-x-2 border-b border-[#1E2B35] animate-fadeIn">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>{notification.msg}</span>
          </div>
        )}

        {/* Main Application Container */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Sidebar */}
          <Sidebar
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
            onNewTask={handleOpenNewTask}
            onNewProject={handleOpenNewProject}
          />

          {/* Main Content Workspace */}
          <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto max-h-[calc(100vh-6rem)]">
            {/* Top Panoramic Hero Banner with centered titles */}
            <HeroBanner
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              filterPriority={filterPriority}
              setFilterPriority={setFilterPriority}
              filterStatus={filterStatus}
              setFilterStatus={setFilterStatus}
            />

            {/* Row 1: Current Projects (Left) & Writing Goals + Quote Accent (Right) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-6">
              {/* Left Column: Current Projects (7 cols) */}
              <div className="lg:col-span-7">
                <CurrentProjects
                  projects={projects}
                  onNewProject={handleOpenNewProject}
                  onEditProject={handleOpenEditProject}
                  onDeleteProject={deleteProject}
                  onSelectProject={(id) => setSelectedProjectId(id === selectedProjectId ? null : id)}
                  selectedProjectId={selectedProjectId}
                />
              </div>

              {/* Right Column: Writing Goals + Quote Accent Card (5 cols) */}
              <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
                <WritingGoals stats={stats} />
                <QuoteAccentCard />
              </div>
            </div>

            {/* Row 2: MY MANUSCRIPTS (Full Width Slate Card) */}
            <TaskGallery
              tasks={filteredTasks}
              onNewTask={handleOpenNewTask}
              onEditTask={handleOpenEditTask}
              onDeleteTask={deleteTask}
              onToggleStatus={toggleTaskStatus}
            />

            {/* Row 3: Idea Board (Left) & Habit Tracker (Right) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Idea Board (7 cols) */}
              <div className="lg:col-span-7">
                <IdeaBoard
                  notes={notes}
                  onNewNote={handleOpenNewNote}
                  onDeleteNote={deleteNote}
                />
              </div>

              {/* Habit Tracker (5 cols) */}
              <div className="lg:col-span-5">
                <HabitTracker
                  habits={habits}
                  onToggleHabit={toggleHabit}
                  onAddHabit={() => {
                    const habit = prompt('Enter a new daily habit or task:');
                    if (habit) addHabit(habit);
                  }}
                />
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Floating Action / Help Button matching blueprint (?) */}
      <button
        onClick={() => setShowHelpModal(true)}
        className="fixed bottom-6 right-6 w-9 h-9 rounded-full bg-[#FAF8F5] border border-[#C8BFB0] shadow-lg flex items-center justify-center text-[#555048] hover:text-[#283845] hover:border-[#283845] font-serif font-bold text-sm transition hover:scale-110 z-40"
        title="Help & Shortcuts"
      >
        ?
      </button>

      {/* Help Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-[#FAF8F5] border border-[#DDD7CD] rounded-3xl max-w-sm w-full p-6 shadow-2xl">
            <h3 className="font-serif font-bold text-base text-[#282522] mb-2">
              TASKFLOW &bull; Creative Writer's Hub
            </h3>
            <p className="text-xs text-[#635D54] leading-relaxed mb-4">
              A full-stack MERN productivity application built to faithfully replicate the editorial literary planner blueprint.
            </p>
            <ul className="text-xs text-[#524C44] space-y-1.5 mb-5">
              <li>&bull; <strong>Projects:</strong> Organize book projects with cover images &amp; auto-calculated progress.</li>
              <li>&bull; <strong>Manuscripts Gallery:</strong> Real-time task board with priority &amp; status cycling.</li>
              <li>&bull; <strong>Writing Goals:</strong> Live SVG circular productivity gauges.</li>
              <li>&bull; <strong>Idea Board:</strong> Multer image uploads &amp; sticky notes.</li>
              <li>&bull; <strong>Habit Tracker:</strong> Instant toggle checklist.</li>
            </ul>
            <button
              onClick={() => setShowHelpModal(false)}
              className="w-full py-2 rounded-xl bg-[#283845] text-white text-xs font-semibold"
            >
              Close Guide
            </button>
          </div>
        </div>
      )}

      {/* Interactive Modals */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSave={taskToEdit ? (fd) => updateTask(fd, taskToEdit._id) : createTask}
        initialData={taskToEdit}
        projects={projects}
      />

      <ProjectModal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        onSave={projectToEdit ? (fd) => updateProject(fd, projectToEdit._id) : createProject}
        initialData={projectToEdit}
      />

      <NoteModal
        isOpen={isNoteModalOpen}
        onClose={() => setIsNoteModalOpen(false)}
        onSave={createNote}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />
    </div>
  );
}
