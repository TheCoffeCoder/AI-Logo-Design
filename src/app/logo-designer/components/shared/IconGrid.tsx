import React from 'react';
import { LucideIcon } from 'lucide-react';

interface IconGridProps {
  icons: { [key: string]: LucideIcon };
  selectedIcon: string;
  onIconClick: (iconName: string) => void;
}

export default function IconGrid({ icons, selectedIcon, onIconClick }: IconGridProps) {
  return (
    <div className="grid grid-cols-3 gap-4 p-4">
      {Object.entries(icons).map(([name, Icon]) => (
        <button
          key={name}
          onClick={() => onIconClick(name)}
          className={`aspect-square rounded-lg flex items-center justify-center p-4 transition-colors ${
            selectedIcon === name
              ? 'bg-blue-100 text-blue-600'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
          }`}
        >
          <Icon className="w-full h-full" />
        </button>
      ))}
    </div>
  );
}
