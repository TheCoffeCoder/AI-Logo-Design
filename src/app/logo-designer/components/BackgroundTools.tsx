'use client';

import { useState } from 'react';
import { RotateCw, ArrowLeft, ArrowRight, Maximize2, Circle, Trash2 } from 'lucide-react';
import ColorPicker from './ColorPicker';

type GradientPosition = 'left' | 'center' | 'right' | 'custom';

interface BackgroundToolsProps {
  rounded: number;
  padding: number;
  shadow: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  color: string;
  borderColor: string;
  isGradient: boolean;
  gradientAngle: number;
  gradientType: 'linear' | 'radial';
  gradientPosition: GradientPosition;
  onRoundedChange: (value: number) => void;
  onPaddingChange: (value: number) => void;
  onShadowChange: (value: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl') => void;
  onColorChange: (color: string) => void;
  onBorderColorChange: (color: string) => void;
  onGradientChange: (isGradient: boolean) => void;
  onGradientAngleChange: (angle: number) => void;
  onGradientTypeChange: (type: 'linear' | 'radial') => void;
  onGradientPositionChange: (position: GradientPosition) => void;
}

const SHADOW_OPTIONS = ['none', 'sm', 'md', 'lg', 'xl', '2xl'] as const;
const PRESET_COLORS = [
  { id: 1, color: '#ff00ff' },
  { id: 2, color: '#ff0080' },
  { id: 3, color: '#ff8080' },
  { id: 4, color: '#ffb080' },
  { id: 5, color: '#ffd700' },
  { id: 6, color: '#ffff80' },
  { id: 7, color: '#80ff80' },
  { id: 8, color: '#00ff80' },
  { id: 9, color: '#00ffff' },
  { id: 10, color: '#0080ff' },
  { id: 11, color: '#0000ff' },
  { id: 12, color: '#8000ff' },
  { id: 13, color: '#ff00ff' },
  { id: 14, color: '#ff0080' },
  { id: 15, color: '#ff0000' }
];

export default function BackgroundTools({
  rounded,
  padding,
  shadow,
  color,
  borderColor,
  isGradient,
  gradientAngle,
  gradientType,
  gradientPosition,
  onRoundedChange,
  onPaddingChange,
  onShadowChange,
  onColorChange,
  onBorderColorChange,
  onGradientChange,
  onGradientAngleChange,
  onGradientTypeChange,
  onGradientPositionChange,
}: BackgroundToolsProps) {
  return (
    <div className="space-y-6">
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium text-gray-700">Rounded</label>
          <span className="text-sm text-gray-500">{rounded === 9999 ? 'Full' : `${rounded}px`}</span>
        </div>
        <div className="flex gap-2 items-center">
          <input
            type="range"
            min="0"
            max="100"
            value={rounded > 100 ? 100 : rounded}
            onChange={(e) => onRoundedChange(parseInt(e.target.value))}
            className="flex-1 accent-gray-900"
          />
          <button
            onClick={() => onRoundedChange(rounded === 9999 ? 0 : 9999)}
            className={`p-1.5 rounded ${rounded === 9999 ? 'bg-gray-900 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
          >
            <Circle className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium text-gray-700">Padding</label>
          <span className="text-sm text-gray-500">{padding}px</span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={padding}
          onChange={(e) => onPaddingChange(parseInt(e.target.value))}
          className="w-full accent-gray-900"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Shadow</label>
        <div className="grid grid-cols-3 gap-2">
          <button
            className={`px-2 py-1.5 text-sm font-medium rounded-md ${
              shadow === 'none' ? 'bg-gray-900 text-white' : 'border hover:bg-gray-50'
            }`}
            onClick={() => onShadowChange('none')}
          >
            None
          </button>
          <button
            className={`px-2 py-1.5 text-sm font-medium rounded-md ${
              shadow === 'sm' ? 'bg-gray-900 text-white' : 'border hover:bg-gray-50'
            }`}
            onClick={() => onShadowChange('sm')}
          >
            SM
          </button>
          <button
            className={`px-2 py-1.5 text-sm font-medium rounded-md ${
              shadow === 'md' ? 'bg-gray-900 text-white' : 'border hover:bg-gray-50'
            }`}
            onClick={() => onShadowChange('md')}
          >
            MD
          </button>
          <button
            className={`px-2 py-1.5 text-sm font-medium rounded-md ${
              shadow === 'lg' ? 'bg-gray-900 text-white' : 'border hover:bg-gray-50'
            }`}
            onClick={() => onShadowChange('lg')}
          >
            LG
          </button>
          <button
            className={`px-2 py-1.5 text-sm font-medium rounded-md ${
              shadow === 'xl' ? 'bg-gray-900 text-white' : 'border hover:bg-gray-50'
            }`}
            onClick={() => onShadowChange('xl')}
          >
            XL
          </button>
          <button
            className={`px-2 py-1.5 text-sm font-medium rounded-md ${
              shadow === '2xl' ? 'bg-gray-900 text-white' : 'border hover:bg-gray-50'
            }`}
            onClick={() => onShadowChange('2xl')}
          >
            2XL
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Background</label>
        <div className="space-y-3">
          <div className="flex gap-2">
            <button
              onClick={() => onGradientChange(false)}
              className={`flex-1 px-3 py-1.5 text-sm rounded-md ${
                !isGradient
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Solid
            </button>
            <button
              onClick={() => onGradientChange(true)}
              className={`flex-1 px-3 py-1.5 text-sm rounded-md ${
                isGradient
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Gradient
            </button>
          </div>

          {isGradient && (
            <div className="space-y-3 p-3 bg-gray-50 rounded-lg">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">Gradient Type</label>
                  <div className="flex gap-2">
                    <button
                      className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                        gradientType === 'linear' ? 'bg-gray-900 text-white' : 'border hover:bg-gray-50'
                      }`}
                      onClick={() => onGradientTypeChange('linear')}
                    >
                      Linear
                    </button>
                    <button
                      className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                        gradientType === 'radial' ? 'bg-gray-900 text-white' : 'border hover:bg-gray-50'
                      }`}
                      onClick={() => onGradientTypeChange('radial')}
                    >
                      Radial
                    </button>
                  </div>
                </div>
              </div>

              {gradientType === 'linear' && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">Angle</label>
                    <input
                      type="number"
                      min="0"
                      max="360"
                      value={gradientAngle}
                      onChange={(e) => {
                        const value = parseInt(e.target.value);
                        if (!isNaN(value) && value >= 0 && value <= 360) {
                          onGradientAngleChange(value);
                        }
                      }}
                      className="w-16 px-2 py-1 text-sm border rounded-md"
                    />
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="360"
                    value={gradientAngle}
                    onChange={(e) => onGradientAngleChange(parseInt(e.target.value))}
                    className="w-full accent-gray-900"
                  />
                </div>
              )}

              {gradientType === 'radial' && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">Position</label>
                    <div className="flex gap-2">
                      <button
                        className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                          gradientPosition === 'left' ? 'bg-gray-900 text-white' : 'border hover:bg-gray-50'
                        }`}
                        onClick={() => onGradientPositionChange('left')}
                      >
                        <ArrowLeft className="w-4 h-4" />
                      </button>
                      <button
                        className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                          gradientPosition === 'center' ? 'bg-gray-900 text-white' : 'border hover:bg-gray-50'
                        }`}
                        onClick={() => onGradientPositionChange('center')}
                      >
                        <Circle className="w-4 h-4" />
                      </button>
                      <button
                        className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                          gradientPosition === 'right' ? 'bg-gray-900 text-white' : 'border hover:bg-gray-50'
                        }`}
                        onClick={() => onGradientPositionChange('right')}
                      >
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {isGradient ? (
            <div className="space-y-3">
              <ColorPicker
                label="Start Color"
                color={color}
                onChange={onColorChange}
              />
              <ColorPicker
                label="End Color"
                color={borderColor}
                onChange={onBorderColorChange}
              />
            </div>
          ) : (
            <>
              <ColorPicker
                label=""
                color={color}
                onChange={onColorChange}
              />
              
              <div className="grid grid-cols-5 gap-1">
                {PRESET_COLORS.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => onColorChange(preset.color)}
                    className="w-full aspect-square rounded-md border border-gray-200"
                    style={{ backgroundColor: preset.color }}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
