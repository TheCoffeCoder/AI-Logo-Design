import React, { useRef, useEffect, useState } from 'react';
import { Download, ChevronDown, FileImage, FileCode } from 'lucide-react';

interface DownloadButtonProps {
  onDownload?: (format: 'png' | 'svg') => void;
}

export default function DownloadButton({ onDownload }: DownloadButtonProps) {
  const [isDownloadOpen, setIsDownloadOpen] = useState(false);
  const downloadRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (downloadRef.current && !downloadRef.current.contains(event.target as Node)) {
        setIsDownloadOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={downloadRef}>
      <button
        className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-white bg-gray-900 rounded-md hover:bg-gray-800"
        onClick={() => setIsDownloadOpen(!isDownloadOpen)}
      >
        <Download className="w-4 h-4" />
        Download
        <ChevronDown className="w-4 h-4" />
      </button>

      {isDownloadOpen && (
        <div className="absolute right-0 mt-1 w-40 bg-white border rounded-md shadow-lg py-1 z-50">
          <button
            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
            onClick={() => {
              onDownload?.('png');
              setIsDownloadOpen(false);
            }}
          >
            <FileImage className="w-4 h-4" />
            PNG
          </button>
          <button
            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
            onClick={() => {
              onDownload?.('svg');
              setIsDownloadOpen(false);
            }}
          >
            <FileCode className="w-4 h-4" />
            SVG
          </button>
        </div>
      )}
    </div>
  );
}
