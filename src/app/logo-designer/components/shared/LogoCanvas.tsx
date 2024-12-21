import React, { useState } from 'react';
import { LogoSettings, BackgroundSettings } from '../types';

interface LogoCanvasProps {
  iconSettings: LogoSettings;
  backgroundSettings: BackgroundSettings;
  iconContent: React.ReactNode;
  getBackgroundStyle: () => React.CSSProperties;
  getShadowStyle: (shadow: BackgroundSettings['shadow']) => string;
}

export default function LogoCanvas({
  iconSettings,
  backgroundSettings,
  iconContent,
  getBackgroundStyle,
  getShadowStyle
}: LogoCanvasProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="flex-1 bg-[#f8f9fa] overflow-auto">
      <div className="h-full w-full min-h-[800px] relative">
        <div className="absolute inset-0" style={{ 
          backgroundImage: `
            linear-gradient(to right, #e5e7eb 1px, transparent 1px),
            linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px'
        }} />
        
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            <div 
              className="absolute border-2 border-dashed border-gray-300 rounded-lg logo-background"
              style={{
                width: '500px',
                height: '500px',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)'
              }}
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            >
              <div 
                className="logo-container flex items-center justify-center relative"
                style={{
                  width: `${500 - (backgroundSettings.padding * 2)}px`, 
                  height: `${500 - (backgroundSettings.padding * 2)}px`,
                  margin: `${backgroundSettings.padding}px`,
                  borderRadius: backgroundSettings.rounded === 9999 ? '50%' : `${backgroundSettings.rounded}px`,
                  ...getBackgroundStyle(),
                  opacity: backgroundSettings.fillOpacity / 100,
                  boxShadow: getShadowStyle(backgroundSettings.shadow)
                }}
              >
                <div
                  className="icon-container relative flex items-center justify-center"
                  style={{
                    width: `${iconSettings.size}px`,
                    height: `${iconSettings.size}px`,
                    transform: `rotate(${iconSettings.rotate}deg)`,
                    opacity: iconSettings.fillOpacity / 100,
                    stroke: iconSettings.fillColor,
                    strokeWidth: iconSettings.borderWidth || 2
                  }}
                >
                  <div className="w-full h-full flex items-center justify-center" style={{ stroke: 'inherit', strokeWidth: 'inherit' }}>
                    {iconContent}
                  </div>
                </div>
              </div>
              
              {showTooltip && (
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap transition-opacity duration-200">
                  Downloadable zone
                  <div className="absolute left-1/2 -translate-x-1/2 top-[100%] w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-gray-900"></div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
