import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';
import confetti from 'canvas-confetti';

const TaskContext = createContext();

export const useTasks = () => useContext(TaskContext);

export function TaskProvider({ children }) {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [notes, setNotes] = useState([]);
  const [habits, setHabits] = useState([
    { id: 'h1', text: 'Write 1000 words', completed: true },
    { id: 'h2', text: 'Read a chapter', completed: true },
    { id: 'h3', text: 'Write 1000 words', completed: true },
    { id: 'h4', text: 'Brainstorm', completed: true },
    { id: 'h5', text: 'Read more words', completed: true },
    { id: 'h6', text: 'Review chapter', completed: true },
  ]);
  const [stats, setStats] = useState({
    dailyTarget: 100,
    dailyCompleted: 100,
    weeklyTarget: 300,
    weeklyMiles: 250,
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    overdueTasks: 0,
  });
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  const showNotification = (msg, type = 'info') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // Fetch all user data
  const refreshData = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      const [tasksRes, projectsRes, notesRes, statsRes] = await Promise.allSettled([
        api.get('/tasks'),
        api.get('/projects'),
        api.get('/notes'),
        api.get('/dashboard/stats')
      ]);

      if (tasksRes.status === 'fulfilled' && tasksRes.value.data?.success) {
        setTasks(tasksRes.value.data.tasks);
      }
      if (projectsRes.status === 'fulfilled' && projectsRes.value.data?.success) {
        setProjects(projectsRes.value.data.projects);
      }
      if (notesRes.status === 'fulfilled' && notesRes.value.data?.success) {
        setNotes(notesRes.value.data.notes);
      }
      if (statsRes.status === 'fulfilled' && statsRes.value.data?.success) {
        setStats(statsRes.value.data.stats);
      }
    } catch (err) {
      console.error('Error refreshing Taskflow data:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      refreshData();
    } else {
      setTasks([]);
      setProjects([]);
      setNotes([]);
    }
  }, [user, refreshData]);

  // Task actions
  const createTask = async (formData) => {
    const res = await api.post('/tasks', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    if (res.data?.success) {
      showNotification('Task created successfully!', 'success');
      refreshData();
      return res.data.task;
    }
  };

  const updateTask = async (formData, id) => {
    const res = await api.put(`/tasks/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    if (res.data?.success) {
      showNotification('Task updated successfully!', 'success');
      refreshData();
      return res.data.task;
    }
  };

  const deleteTask = async (id) => {
    const res = await api.delete(`/tasks/${id}`);
    if (res.data?.success) {
      showNotification('Task deleted', 'info');
      refreshData();
    }
  };

  const toggleTaskStatus = async (task) => {
    // Cycle status: Outline/Pending -> In Progress -> Editing -> Completed -> Pending
    const statusCycle = ['Pending', 'In Progress', 'Editing', 'Completed'];
    const currentIndex = statusCycle.indexOf(task.status);
    const nextStatus = statusCycle[(currentIndex + 1) % statusCycle.length];

    if (nextStatus === 'Completed') {
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 }
        });
      } catch (e) {}
    }

    const res = await api.put(`/tasks/${task._id}`, { status: nextStatus });
    if (res.data?.success) {
      refreshData();
    }
  };

  // Project actions
  const createProject = async (formData) => {
    const res = await api.post('/projects', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    if (res.data?.success) {
      showNotification('Project created successfully!', 'success');
      refreshData();
      return res.data.project;
    }
  };

  const updateProject = async (formData, id) => {
    const res = await api.put(`/projects/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    if (res.data?.success) {
      showNotification('Project updated successfully!', 'success');
      refreshData();
      return res.data.project;
    }
  };

  const deleteProject = async (id) => {
    const res = await api.delete(`/projects/${id}`);
    if (res.data?.success) {
      showNotification('Project deleted', 'info');
      refreshData();
    }
  };

  // Note actions
  const createNote = async (formData) => {
    const res = await api.post('/notes', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    if (res.data?.success) {
      showNotification('Idea note saved!', 'success');
      refreshData();
      return res.data.note;
    }
  };

  const deleteNote = async (id) => {
    const res = await api.delete(`/notes/${id}`);
    if (res.data?.success) {
      showNotification('Note deleted', 'info');
      refreshData();
    }
  };

  // Habit toggles
  const toggleHabit = (id) => {
    setHabits((prev) =>
      prev.map((h) => (h.id === id ? { ...h, completed: !h.completed } : h))
    );
  };

  const addHabit = (text) => {
    if (!text) return;
    setHabits((prev) => [
      ...prev,
      { id: `h-${Date.now()}`, text, completed: false },
    ]);
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        projects,
        notes,
        habits,
        stats,
        loading,
        notification,
        showNotification,
        refreshData,
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
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}
