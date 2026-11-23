import React from 'react';
import { Plus, StickyNote, Trash2 } from 'lucide-react';
import { QuillIcon, IMAGES } from '../assets/assets';

export default function IdeaBoard({ notes = [], onNewNote, onDeleteNote }) {
  const fallbackNotes = [
    {
      _id: 'sample-1',
      title: 'Story Ideas',
      content: 'Story ideas are tweets in story ideas.',
      image: null,
      type: 'text'
    },
    {
      _id: 'sample-2',
      title: 'Plot Twists',
      content: '',
      image: IMAGES.typewriterClose,
      type: 'image'
    },
    {
      _id: 'sample-3',
      title: 'Plot Twists',
      content: '',
      image: IMAGES.manuscriptDesk,
      type: 'image'
    },
    {
      _id: 'sample-4',
      title: 'Drafting Nib',
      content: '',
      image: IMAGES.quillWriting,
      type: 'image'
    }
  ];

  const displayNotes = notes.length > 0 ? notes : fallbackNotes;

  return (
    <div className="bg-[#F3EFE7] border border-[#DDD7CD] rounded-3xl p-5 shadow-xs relative flex flex-col justify-between">
      <div>
        {/* Header matching blueprint */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <QuillIcon className="w-4 h-4 text-[#3A3632]" color="#3A3632" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#2D2A26] font-serif">
              Idea Board
            </h2>
          </div>
          <button
            onClick={onNewNote}
            className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-white/80 hover:bg-white text-[11px] font-semibold text-[#4A453F] border border-[#DDD7CD] shadow-2xs transition"
          >
            <StickyNote className="w-3 h-3 text-[#706B63]" />
            <span>Notic</span>
            <Plus className="w-3 h-3 ml-0.5 text-[#2A3C4D]" />
          </button>
        </div>

        {/* Note Cards Grid matching blueprint */}
        <div className="grid grid-cols-2 gap-3">
          {displayNotes.slice(0, 4).map((note, idx) => (
            <div
              key={note._id || idx}
              className="group bg-white rounded-xl p-2.5 border border-[#E5E0D7] hover:border-[#C8BFB0] transition shadow-2xs relative flex flex-col justify-between min-h-[110px]"
            >
              {note.image ? (
                <div>
                  <div className="w-full h-20 rounded-lg overflow-hidden bg-[#ECE8E1] mb-1.5">
                    <img
                      src={note.image}
                      alt={note.title}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition duration-300"
                    />
                  </div>
                  <span className="text-[11px] font-semibold text-[#2D2A26] block truncate">
                    {note.title || 'Plot Twists'}
                  </span>
                </div>
              ) : (
                <div className="flex flex-col justify-between h-full">
                  <div>
                    <div className="flex items-center space-x-1.5 mb-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#E5D6C3] inline-block border border-[#CDBBA6]"></span>
                      <h4 className="text-xs font-bold text-[#2D2A26]">{note.title}</h4>
                    </div>
                    <p className="text-[11px] text-[#5C5750] leading-snug line-clamp-3">
                      {note.content}
                    </p>
                  </div>
                </div>
              )}

              {/* Delete button on hover */}
              {onDeleteNote && note._id && !note._id.startsWith('sample') && (
                <button
                  onClick={() => onDeleteNote(note._id)}
                  className="absolute top-1 right-1 p-1 rounded bg-black/40 text-white opacity-0 group-hover:opacity-100 hover:text-red-400 transition"
                  title="Delete Note"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
