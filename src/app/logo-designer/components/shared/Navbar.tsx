import React from 'react';
import { Undo2, Redo2, Download, ChevronDown } from 'lucide-react';
import DownloadButton from './DownloadButton';

interface NavbarProps {
  currentHistoryIndex: number;
  historyLength: number;
  onUndo: () => void;
  onRedo: () => void;
  onDownload: (format: 'png' | 'svg') => void;
}

export default function Navbar({ 
  currentHistoryIndex, 
  historyLength, 
  onUndo, 
  onRedo,
  onDownload
}: NavbarProps) {
  return (
    <nav className="h-14 border-b flex items-center px-4 justify-between">
      <div className="flex items-center gap-6">
        <h1 className="text-xl font-semibold">Logo Designer</h1>
        <div className="flex items-center gap-2">
          <button 
            className={`p-2 rounded-md ${currentHistoryIndex > 0 ? 'hover:bg-gray-100 text-gray-900' : 'text-gray-300 cursor-not-allowed'}`}
            onClick={onUndo}
            disabled={currentHistoryIndex === 0}
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button 
            className={`p-2 rounded-md ${currentHistoryIndex < historyLength - 1 ? 'hover:bg-gray-100 text-gray-900' : 'text-gray-300 cursor-not-allowed'}`}
            onClick={onRedo}
            disabled={currentHistoryIndex === historyLength - 1}
          >
            <Redo2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      <DownloadButton onDownload={onDownload} />
    </nav>
  );
}
