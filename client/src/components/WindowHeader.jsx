import React from 'react';
import { User, LogOut, LogIn, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function WindowHeader({ onOpenAuth }) {
  const { user, logout } = useAuth();

  return (
    <header className="h-11 border-b border-[#E3DFD5] bg-[#F4F1EA] px-4 flex items-center justify-between select-none">
      {/* Left traffic lights & Notion symbol */}
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2">
          <span className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E] inline-block shadow-sm"></span>
          <span className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123] inline-block shadow-sm"></span>
          <span className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29] inline-block shadow-sm"></span>
        </div>
        <div className="h-4 w-px bg-[#D6D2C8] mx-1"></div>
        {/* Notion icon [N] */}
        <div className="w-5 h-5 rounded border border-[#3E3C38] bg-white flex items-center justify-center shadow-xs">
          <span className="font-serif font-black text-xs leading-none text-[#262422]">N</span>
        </div>
        <span className="text-xs font-medium text-[#736E67] tracking-wide hidden sm:inline">
          TASKFLOW &bull; Creative Writer's Hub
        </span>
      </div>

      {/* Right controls: user status, login/logout */}
      <div className="flex items-center space-x-3 text-xs">
        {user ? (
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#E5ECE4] text-[#2D5A27] font-medium text-[11px]">
              <Sparkles className="w-3 h-3 mr-1" />
              Online: {user.name}
            </span>
            <button
              onClick={logout}
              className="flex items-center space-x-1 px-2.5 py-1 rounded bg-[#EAE6DD] hover:bg-[#DDD8CD] text-[#4A4742] transition"
              title="Logout"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        ) : (
          <button
            onClick={onOpenAuth}
            className="flex items-center space-x-1 px-3 py-1 rounded bg-[#283845] hover:bg-[#1E2B35] text-white font-medium shadow-sm transition"
          >
            <LogIn className="w-3.5 h-3.5 mr-1" />
            <span>Sign In / Register</span>
          </button>
        )}
      </div>
    </header>
  );
}
