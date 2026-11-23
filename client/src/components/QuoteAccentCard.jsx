import React from 'react';
import { QuillIcon, IMAGES } from '../assets/assets';

export default function QuoteAccentCard() {
  return (
    <div className="bg-[#EFE9DF] border border-[#DDD5C7] rounded-3xl p-3 shadow-xs relative overflow-hidden flex items-center min-h-[105px]">
      {/* Floating miniature quill icon matching blueprint */}
      <div className="absolute top-2.5 left-3 z-10">
        <QuillIcon className="w-3.5 h-3.5 text-[#5C5346]" color="#5C5346" />
      </div>

      {/* High-res photograph of fountain pen on handwritten cursive paper */}
      <div className="w-full h-24 rounded-2xl overflow-hidden relative shadow-inner">
        <img
          src={IMAGES.fountainPenQuote}
          alt="Vintage Fountain Pen on Manuscript"
          className="w-full h-full object-cover object-center transform hover:scale-105 transition duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-transparent flex items-end p-2.5">
          <span className="text-[11px] font-serif italic text-white/90 drop-shadow-sm">
            "A word after a word after a word is power."
          </span>
        </div>
      </div>
    </div>
  );
}
