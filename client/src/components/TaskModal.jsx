import React, { useState, useEffect } from 'react';
import { X, Upload, Calendar, Flag, BookOpen, Image as ImageIcon } from 'lucide-react';

export default function TaskModal({ 
  isOpen, 
  onClose, 
  onSave, 
  initialData = null, 
  projects = [] 
}) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [status, setStatus] = useState('Pending');
  const [dueDate, setDueDate] = useState('');
  const [projectId, setProjectId] = useState('');
  const [coverImage, setCoverImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setDescription(initialData.description || '');
      setPriority(initialData.priority || 'Medium');
      setStatus(initialData.status || 'Pending');
      setDueDate(initialData.dueDate ? initialData.dueDate.split('T')[0] : '');
      setProjectId(initialData.projectId?._id || initialData.projectId || '');
      setPreviewUrl(initialData.coverImage || '');
      setCoverImage(null);
    } else {
      setTitle('');
      setDescription('');
      setPriority('Medium');
      setStatus('Pending');
      setDueDate(new Date().toISOString().split('T')[0]);
      setProjectId(projects[0]?._id || '');
      setPreviewUrl('');
      setCoverImage(null);
    }
    setError('');
  }, [initialData, isOpen, projects]);

  if (!isOpen) return null;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image must be smaller than 5MB');
        return;
      }
      setCoverImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Task title is required');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const formData = new FormData();
      formData.append('title', title.trim());
      formData.append('description', description.trim());
      formData.append('priority', priority);
      formData.append('status', status);
      if (dueDate) formData.append('dueDate', dueDate);
      if (projectId) formData.append('projectId', projectId);
      if (coverImage) formData.append('image', coverImage);

      await onSave(formData, initialData?._id);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to save task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-[#FAF8F5] border border-[#DDD7CD] rounded-3xl w-full max-w-lg p-6 shadow-2xl relative">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#E5E0D7] mb-5">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-[#E8E2D7] flex items-center justify-center text-[#283845]">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-[#282522]">
                {initialData ? 'Edit Task / Manuscript' : 'Create New Task'}
              </h3>
              <p className="text-[11px] text-[#736E67]">
                Fill details and attach reference images via Multer
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center text-[#555] transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#403B35] mb-1">
              Task Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Chapter 4 Outline or Character Profiles"
              className="w-full px-3 py-2 rounded-xl border border-[#D5CEC2] bg-white text-xs text-[#282522] focus:outline-none focus:ring-2 focus:ring-[#283845]"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#403B35] mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              placeholder="Add key notes, drafting criteria, or research points..."
              className="w-full px-3 py-2 rounded-xl border border-[#D5CEC2] bg-white text-xs text-[#282522] focus:outline-none focus:ring-2 focus:ring-[#283845]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#403B35] mb-1 flex items-center">
                <Flag className="w-3.5 h-3.5 mr-1 text-[#655F56]" />
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#D5CEC2] bg-white text-xs text-[#282522] focus:outline-none focus:ring-2 focus:ring-[#283845]"
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#403B35] mb-1">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#D5CEC2] bg-white text-xs text-[#282522] focus:outline-none focus:ring-2 focus:ring-[#283845]"
              >
                <option value="Pending">Pending (Outline)</option>
                <option value="In Progress">In Progress</option>
                <option value="Editing">Editing</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#403B35] mb-1 flex items-center">
                <Calendar className="w-3.5 h-3.5 mr-1 text-[#655F56]" />
                Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#D5CEC2] bg-white text-xs text-[#282522] focus:outline-none focus:ring-2 focus:ring-[#283845]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#403B35] mb-1">
                Assign to Project
              </label>
              <select
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#D5CEC2] bg-white text-xs text-[#282522] focus:outline-none focus:ring-2 focus:ring-[#283845]"
              >
                <option value="">No Project</option>
                {projects.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Image Upload with preview (Multer Week 3 requirement) */}
          <div>
            <label className="block text-xs font-semibold text-[#403B35] mb-1 flex items-center justify-between">
              <span className="flex items-center">
                <ImageIcon className="w-3.5 h-3.5 mr-1 text-[#655F56]" />
                Cover / Reference Image
              </span>
              <span className="text-[10px] text-[#857E74]">JPG, PNG, WebP (max 5MB)</span>
            </label>

            <div className="flex items-center space-x-3">
              {previewUrl && (
                <div className="w-16 h-16 rounded-xl overflow-hidden border border-[#D5CEC2] bg-black/5 flex-shrink-0 relative">
                  <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
              <label className="flex-1 flex items-center justify-center px-4 py-2.5 border-2 border-dashed border-[#D5CEC2] hover:border-[#283845] rounded-xl cursor-pointer bg-white transition group">
                <Upload className="w-4 h-4 mr-2 text-[#7A746B] group-hover:text-[#283845]" />
                <span className="text-xs text-[#635D54] group-hover:text-[#283845] font-medium">
                  {coverImage ? coverImage.name : 'Choose or replace image'}
                </span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/jpg"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end space-x-2 pt-3 border-t border-[#E5E0D7]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-[#E8E3D8] hover:bg-[#DDD7CB] text-xs font-semibold text-[#4A453F] transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-xl bg-[#283845] hover:bg-[#1E2B35] text-xs font-semibold text-white shadow-sm transition disabled:opacity-50"
            >
              {loading ? 'Saving...' : initialData ? 'Update Task' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
