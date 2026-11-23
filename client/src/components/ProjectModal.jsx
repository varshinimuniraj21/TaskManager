import React, { useState, useEffect } from 'react';
import { X, Upload, FolderPlus, Image as ImageIcon } from 'lucide-react';

export default function ProjectModal({ 
  isOpen, 
  onClose, 
  onSave, 
  initialData = null 
}) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Mystery');
  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setCategory(initialData.category || 'Mystery');
      setDescription(initialData.description || '');
      setPreviewUrl(initialData.coverImage || '');
      setCoverImage(null);
    } else {
      setTitle('');
      setCategory('Mystery');
      setDescription('');
      setPreviewUrl('');
      setCoverImage(null);
    }
    setError('');
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Cover image must be under 5MB');
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
      setError('Project title is required');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const formData = new FormData();
      formData.append('title', title.trim());
      formData.append('category', category.trim());
      formData.append('description', description.trim());
      if (coverImage) formData.append('image', coverImage);

      await onSave(formData, initialData?._id);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to save project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-[#FAF8F5] border border-[#DDD7CD] rounded-3xl w-full max-w-md p-6 shadow-2xl relative">
        <div className="flex items-center justify-between pb-4 border-b border-[#E5E0D7] mb-5">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-[#E8E2D7] flex items-center justify-center text-[#283845]">
              <FolderPlus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-[#282522]">
                {initialData ? 'Edit Project' : 'New Project'}
              </h3>
              <p className="text-[11px] text-[#736E67]">
                Add to your Current Projects shelf
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
              Project Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. The Silent Hours"
              className="w-full px-3 py-2 rounded-xl border border-[#D5CEC2] bg-white text-xs text-[#282522] focus:outline-none focus:ring-2 focus:ring-[#283845]"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#403B35] mb-1">
              Genre / Category
            </label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="e.g. Mystery, Sci-Fi, Thriller, Fantasy"
              className="w-full px-3 py-2 rounded-xl border border-[#D5CEC2] bg-white text-xs text-[#282522] focus:outline-none focus:ring-2 focus:ring-[#283845]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#403B35] mb-1">
              Synopsis / Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              placeholder="Brief description or outline summary..."
              className="w-full px-3 py-2 rounded-xl border border-[#D5CEC2] bg-white text-xs text-[#282522] focus:outline-none focus:ring-2 focus:ring-[#283845]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#403B35] mb-1 flex items-center justify-between">
              <span className="flex items-center">
                <ImageIcon className="w-3.5 h-3.5 mr-1 text-[#655F56]" />
                Cover Thumbnail (Multer Upload)
              </span>
              <span className="text-[10px] text-[#857E74]">JPG, PNG (max 5MB)</span>
            </label>

            <div className="flex items-center space-x-3">
              {previewUrl && (
                <div className="w-16 h-16 rounded-xl overflow-hidden border border-[#D5CEC2] bg-black/5 flex-shrink-0">
                  <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
              <label className="flex-1 flex items-center justify-center px-4 py-2.5 border-2 border-dashed border-[#D5CEC2] hover:border-[#283845] rounded-xl cursor-pointer bg-white transition group">
                <Upload className="w-4 h-4 mr-2 text-[#7A746B] group-hover:text-[#283845]" />
                <span className="text-xs text-[#635D54] group-hover:text-[#283845] font-medium">
                  {coverImage ? coverImage.name : 'Upload cover image'}
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
              {loading ? 'Saving...' : initialData ? 'Update Project' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
