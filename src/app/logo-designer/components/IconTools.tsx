'use client';

import { useState } from 'react';
import ColorPicker from './ColorPicker';

interface IconToolsProps {
  size: number;
  rotate: number;
  borderWidth: number;
  fillColor: string;
  fillOpacity: number;
  onSizeChange: (value: number) => void;
  onRotateChange: (value: number) => void;
  onBorderWidthChange: (value: number) => void;
  onFillColorChange: (color: string) => void;
  onFillOpacityChange: (value: number) => void;
}

export default function IconTools({
  size,
  rotate,
  borderWidth,
  fillColor,
  fillOpacity,
  onSizeChange,
  onRotateChange,
  onBorderWidthChange,
  onFillColorChange,
  onFillOpacityChange,
}: IconToolsProps) {
  return (
    <div className="space-y-6">
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium text-gray-700">Size</label>
          <span className="text-sm text-gray-500">{size}px</span>
        </div>
        <input
          type="range"
          min="20"
          max="500"
          value={size}
          onChange={(e) => onSizeChange(parseInt(e.target.value))}
          className="w-full accent-gray-900"
        />
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium text-gray-700">Rotate</label>
          <span className="text-sm text-gray-500">{rotate}°</span>
        </div>
        <input
          type="range"
          min="0"
          max="360"
          value={rotate}
          onChange={(e) => onRotateChange(parseInt(e.target.value))}
          className="w-full accent-gray-900"
        />
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium text-gray-700">Border Width</label>
          <span className="text-sm text-gray-500">{borderWidth}px</span>
        </div>
        <input
          type="range"
          min="0"
          max="10"
          step="0.5"
          value={borderWidth}
          onChange={(e) => onBorderWidthChange(parseFloat(e.target.value))}
          className="w-full accent-gray-900"
        />
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium text-gray-700">Fill Opacity</label>
          <span className="text-sm text-gray-500">{fillOpacity}%</span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={fillOpacity}
          onChange={(e) => onFillOpacityChange(parseInt(e.target.value))}
          className="w-full accent-gray-900"
        />
      </div>

      <div>
        <ColorPicker
          label="Fill Color"
          color={fillColor}
          onChange={onFillColorChange}
        />
      </div>
    </div>
  );
}
