'use client';

import { HexColorPicker } from 'react-colorful';
import { useState } from 'react';

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  label: string;
  opacity?: number;
  onOpacityChange?: (opacity: number) => void;
}

export default function ColorPicker({ 
  color, 
  onChange, 
  label,
  opacity = 100,
  onOpacityChange
}: ColorPickerProps) {
  // Convert hex to rgb
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
  };

  // Convert rgb to hex
  const rgbToHex = (r: number, g: number, b: number) => {
    return '#' + [r, g, b].map(x => {
      const hex = Math.min(255, Math.max(0, x)).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    }).join('');
  };

  const rgb = hexToRgb(color);
  const [localRgb, setLocalRgb] = useState(rgb);

  const handleRgbChange = (key: 'r' | 'g' | 'b', value: string) => {
    const numValue = parseInt(value) || 0;
    const newRgb = { ...localRgb, [key]: numValue };
    setLocalRgb(newRgb);
    if (numValue >= 0 && numValue <= 255) {
      onChange(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
    }
  };

  const handleHexChange = (value: string) => {
    const hex = value.startsWith('#') ? value : '#' + value;
    if (/^#[0-9A-Fa-f]{6}$/.test(hex)) {
      onChange(hex);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="space-y-2">
        <HexColorPicker 
          color={color} 
          onChange={onChange}
          className="w-full !h-[180px] rounded-lg"
        />
        
        {/* Color spectrum */}
        <div 
          className="w-full h-2 rounded-full"
          style={{
            background: 'linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)'
          }}
        />

        {/* Opacity slider if provided */}
        {onOpacityChange && (
          <div 
            className="w-full h-2 rounded-full bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAGElEQVQYlWNgYGCQwoKxgqGgcJA5h3yFAAs8BRWVSwooAAAAAElFTkSuQmCC')] relative"
          >
            <input
              type="range"
              min="0"
              max="100"
              value={opacity}
              onChange={(e) => onOpacityChange(parseInt(e.target.value))}
              className="absolute inset-0 w-full opacity-0 cursor-pointer"
            />
            <div 
              className="absolute inset-0 rounded-full"
              style={{
                background: `linear-gradient(to right, transparent, ${color})`,
                opacity: opacity / 100
              }}
            />
          </div>
        )}

        {/* Color values */}
        <div className="grid grid-cols-5 gap-1">
          <div className="bg-gray-800 text-white px-1 py-0.5 rounded text-[11px] text-center">
            <div className="text-[10px] text-gray-400 uppercase">HEX</div>
            <input
              type="text"
              value={color.replace('#', '')}
              onChange={(e) => handleHexChange(e.target.value)}
              className="w-full bg-transparent text-center focus:outline-none"
            />
          </div>
          <div className="bg-gray-800 text-white px-1 py-0.5 rounded text-[11px] text-center">
            <div className="text-[10px] text-gray-400 uppercase">R</div>
            <input
              type="text"
              value={localRgb.r}
              onChange={(e) => handleRgbChange('r', e.target.value)}
              className="w-full bg-transparent text-center focus:outline-none"
            />
          </div>
          <div className="bg-gray-800 text-white px-1 py-0.5 rounded text-[11px] text-center">
            <div className="text-[10px] text-gray-400 uppercase">G</div>
            <input
              type="text"
              value={localRgb.g}
              onChange={(e) => handleRgbChange('g', e.target.value)}
              className="w-full bg-transparent text-center focus:outline-none"
            />
          </div>
          <div className="bg-gray-800 text-white px-1 py-0.5 rounded text-[11px] text-center">
            <div className="text-[10px] text-gray-400 uppercase">B</div>
            <input
              type="text"
              value={localRgb.b}
              onChange={(e) => handleRgbChange('b', e.target.value)}
              className="w-full bg-transparent text-center focus:outline-none"
            />
          </div>
          {onOpacityChange && (
            <div className="bg-gray-800 text-white px-1 py-0.5 rounded text-[11px] text-center">
              <div className="text-[10px] text-gray-400 uppercase">A</div>
              <input
                type="text"
                value={opacity}
                onChange={(e) => {
                  const value = parseInt(e.target.value) || 0;
                  if (value >= 0 && value <= 100) {
                    onOpacityChange(value);
                  }
                }}
                className="w-full bg-transparent text-center focus:outline-none"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
