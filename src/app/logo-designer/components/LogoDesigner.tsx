'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import html2canvas from 'html2canvas';
import { 
  Book, 
  Building2, 
  Check, 
  Library, 
  Notebook, 
  ScrollText, 
  Sparkles
} from 'lucide-react';
import ColorPicker from './ColorPicker';
import BackgroundTools from './BackgroundTools';
import IconTools from './IconTools';
import Navbar from './shared/Navbar';
import DownloadButton from './shared/DownloadButton';
import LogoCanvas from './shared/LogoCanvas';
import IconGrid from './shared/IconGrid';
import { AskAIModal } from './shared/AskAIModal';
import { BackgroundSettings, Template } from './types';

interface LogoDesignerProps {}

interface HistoryState {
  iconSettings: IconSettings;
  backgroundSettings: BackgroundSettings;
}

interface IconSettings {
  size: number;
  rotate: number;
  borderWidth: number;
  borderColor: string;
  fillOpacity: number;
  fillColor: string;
  customSvgPath?: string;
}

export default function LogoDesigner({}: LogoDesignerProps) {
  const [activeTab, setActiveTab] = useState<'icon' | 'background'>('icon');
  const [selectedIcon, setSelectedIcon] = useState<string>('book');
  
  const [iconSettings, setIconSettings] = useState<IconSettings>({
    size: 300,
    rotate: 0,
    borderWidth: 0,
    borderColor: '#000000',
    fillOpacity: 100,
    fillColor: '#000000',
  });

  const [backgroundSettings, setBackgroundSettings] = useState<BackgroundSettings>({
    size: 300,
    rotate: 0,
    borderWidth: 0,
    borderColor: '#E5E7EB',
    fillOpacity: 100,
    fillColor: '#818CF8',
    rounded: 0,
    padding: 45,
    shadow: 'none',
    isGradient: false,
    gradientAngle: 90,
    gradientType: 'linear',
    gradientPosition: 'center'
  });

  const [history, setHistory] = useState<HistoryState[]>([
    { iconSettings, backgroundSettings }
  ]);
  const [currentHistoryIndex, setCurrentHistoryIndex] = useState(0);

  const addToHistory = useCallback((newIconSettings: IconSettings, newBackgroundSettings: BackgroundSettings) => {
    const newHistory = history.slice(0, currentHistoryIndex + 1);
    newHistory.push({
      iconSettings: newIconSettings,
      backgroundSettings: newBackgroundSettings
    });
    
    if (newHistory.length > 50) {
      newHistory.shift();
    }
    
    setHistory(newHistory);
    setCurrentHistoryIndex(newHistory.length - 1);
  }, [history, currentHistoryIndex]);

  const handleUndo = useCallback(() => {
    if (currentHistoryIndex > 0) {
      const newIndex = currentHistoryIndex - 1;
      const previousState = history[newIndex];
      setIconSettings(previousState.iconSettings);
      setBackgroundSettings(previousState.backgroundSettings);
      setCurrentHistoryIndex(newIndex);
    }
  }, [currentHistoryIndex, history]);

  const handleRedo = useCallback(() => {
    if (currentHistoryIndex < history.length - 1) {
      const newIndex = currentHistoryIndex + 1;
      const nextState = history[newIndex];
      setIconSettings(nextState.iconSettings);
      setBackgroundSettings(nextState.backgroundSettings);
      setCurrentHistoryIndex(newIndex);
    }
  }, [currentHistoryIndex, history]);

  const updateIconSettings = useCallback((newSettings: IconSettings) => {
    setIconSettings(newSettings);
    addToHistory(newSettings, backgroundSettings);
  }, [backgroundSettings, addToHistory]);

  const updateBackgroundSettings = useCallback((newSettings: BackgroundSettings) => {
    setBackgroundSettings(newSettings);
    addToHistory(iconSettings, newSettings);
  }, [iconSettings, addToHistory]);

  const [showTooltip, setShowTooltip] = useState(false);

  const currentSettings = activeTab === 'icon' ? iconSettings : backgroundSettings;
  const setCurrentSettings = activeTab === 'icon' 
    ? (settings: IconSettings) => updateIconSettings(settings)
    : (settings: Partial<BackgroundSettings>) => updateBackgroundSettings({ ...backgroundSettings, ...settings });

  const icons: Record<string, any> = {
    book: Book,
    building: Building2,
    check: Check,
    library: Library,
    notebook: Notebook,
    scroll: ScrollText
  };

  const getShadowStyle = (shadow: BackgroundSettings['shadow']) => {
    switch (shadow) {
      case 'sm':
        return '0 1px 2px 0 rgb(0 0 0 / 0.05)';
      case 'md':
        return '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)';
      case 'lg':
        return '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)';
      case 'xl':
        return '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)';
      case '2xl':
        return '0 25px 50px -12px rgb(0 0 0 / 0.25)';
      default:
        return 'none';
    }
  };

  const getBackgroundStyle = () => {
    if (!backgroundSettings.isGradient) {
      return {
        backgroundColor: backgroundSettings.fillColor,
        border: `${backgroundSettings.borderWidth}px solid ${backgroundSettings.borderColor}`
      };
    }

    if (backgroundSettings.gradientType === 'linear') {
      return {
        background: `linear-gradient(${backgroundSettings.gradientAngle}deg, ${backgroundSettings.fillColor}, ${backgroundSettings.borderColor})`,
        border: `${backgroundSettings.borderWidth}px solid transparent`
      };
    }

    return {
      background: `radial-gradient(circle at ${backgroundSettings.gradientPosition}, ${backgroundSettings.fillColor}, ${backgroundSettings.borderColor})`,
      border: `${backgroundSettings.borderWidth}px solid transparent`
    };
  };

  const getIconContent = () => {
    if (iconSettings.customSvgPath) {
      return (
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 24 24"
          fill="none"
          stroke={iconSettings.fillColor}
          strokeWidth={iconSettings.borderWidth || 2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d={iconSettings.customSvgPath} />
        </svg>
      );
    }

    const IconComponent = icons[selectedIcon];
    if (!IconComponent) return null;
    
    return React.createElement(IconComponent, {
      size: "100%",
      strokeWidth: iconSettings.borderWidth || 2,
      color: iconSettings.fillColor,
      className: "w-full h-full"
    });
  };

  const handleDownload = async (format: 'png' | 'svg') => {
    const downloadableZone = document.querySelector('.logo-background');
    if (!downloadableZone) {
      console.error('Logo elements not found');
      return;
    }

    try {
      switch (format) {
        case 'png':
          try {
            // Create a temporary container
            const tempContainer = downloadableZone.cloneNode(true) as HTMLElement;
            tempContainer.style.position = 'absolute';
            tempContainer.style.left = '-9999px';
            tempContainer.classList.remove('border-2', 'border-dashed', 'border-gray-300');
            document.body.appendChild(tempContainer);

            // Get the logo container and apply styles
            const tempLogo = tempContainer.querySelector('.logo-container') as HTMLElement;
            if (tempLogo) {
              tempLogo.style.width = `${500 - (backgroundSettings.padding * 2)}px`;
              tempLogo.style.height = `${500 - (backgroundSettings.padding * 2)}px`;
              tempLogo.style.margin = `${backgroundSettings.padding}px`;
              tempLogo.style.backgroundColor = backgroundSettings.fillColor;
              tempLogo.style.borderRadius = backgroundSettings.rounded === 9999 ? '50%' : `${backgroundSettings.rounded}px`;
              tempLogo.style.boxShadow = getShadowStyle(backgroundSettings.shadow);
              tempLogo.style.opacity = (backgroundSettings.fillOpacity / 100).toString();
              Object.assign(tempLogo.style, getBackgroundStyle());
            }

            // Get the icon container and apply styles
            const tempIcon = tempContainer.querySelector('.icon-container') as HTMLElement;
            if (tempIcon) {
              tempIcon.style.width = `${iconSettings.size}px`;
              tempIcon.style.height = `${iconSettings.size}px`;
              tempIcon.style.transform = `rotate(${iconSettings.rotate}deg)`;
              tempIcon.style.opacity = (iconSettings.fillOpacity / 100).toString();
            }

            // Apply SVG styles
            const tempSvg = tempIcon?.querySelector('svg') as SVGElement;
            if (tempSvg) {
              tempSvg.setAttribute('width', '100%');
              tempSvg.setAttribute('height', '100%');
              tempSvg.setAttribute('stroke', iconSettings.fillColor);
              tempSvg.setAttribute('stroke-width', (iconSettings.borderWidth || 2).toString());
              tempSvg.setAttribute('fill', 'none');
              tempSvg.style.width = '100%';
              tempSvg.style.height = '100%';
              tempSvg.style.stroke = iconSettings.fillColor;
              tempSvg.style.strokeWidth = (iconSettings.borderWidth || 2).toString();
              tempSvg.style.fill = 'none';

              // Apply styles to all SVG children
              tempSvg.querySelectorAll('path, circle, rect, line').forEach(el => {
                if (el instanceof SVGElement) {
                  el.setAttribute('stroke', iconSettings.fillColor);
                  el.setAttribute('stroke-width', (iconSettings.borderWidth || 2).toString());
                  el.setAttribute('fill', 'none');
                  el.style.stroke = iconSettings.fillColor;
                  el.style.strokeWidth = (iconSettings.borderWidth || 2).toString();
                  el.style.fill = 'none';
                }
              });
            }

            // Use html2canvas with proper configuration
            const canvas = await html2canvas(tempContainer, {
              backgroundColor: null,
              scale: 2,
              logging: false,
              useCORS: true,
              allowTaint: true,
              width: 500,
              height: 500,
              onclone: (clonedDoc) => {
                const clonedElement = clonedDoc.querySelector('.logo-background') as HTMLElement;
                if (clonedElement) {
                  clonedElement.style.transform = 'none';
                  clonedElement.style.top = '0';
                  clonedElement.style.left = '0';
                }
              }
            });

            // Remove temporary container
            document.body.removeChild(tempContainer);

            // Convert to blob and download
            canvas.toBlob((blob) => {
              if (!blob) {
                throw new Error('Failed to create PNG blob');
              }

              const downloadUrl = URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = downloadUrl;
              link.download = 'logo.png';
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              URL.revokeObjectURL(downloadUrl);
            }, 'image/png', 1.0);
          } catch (err) {
            console.error('Error creating PNG:', err);
            throw err;
          }
          break;

        case 'svg':
          try {
            // Create SVG element
            const svgNamespace = "http://www.w3.org/2000/svg";
            const svg = document.createElementNS(svgNamespace, "svg");
            svg.setAttribute("width", "500");
            svg.setAttribute("height", "500");
            svg.setAttribute("viewBox", "0 0 500 500");

            // Add background
            const background = document.createElementNS(svgNamespace, "rect");
            background.setAttribute("width", "500");
            background.setAttribute("height", "500");
            background.setAttribute("rx", backgroundSettings.rounded === 9999 ? "250" : backgroundSettings.rounded.toString());
            background.setAttribute("ry", backgroundSettings.rounded === 9999 ? "250" : backgroundSettings.rounded.toString());

            // Handle gradient or solid color
            if (backgroundSettings.isGradient) {
              const defs = document.createElementNS(svgNamespace, "defs");
              const gradientId = 'logoGradient';
              const gradient = document.createElementNS(
                svgNamespace,
                backgroundSettings.gradientType === 'linear' ? 'linearGradient' : 'radialGradient'
              );
              gradient.setAttribute('id', gradientId);

              if (backgroundSettings.gradientType === 'linear') {
                const angle = backgroundSettings.gradientAngle;
                const angleInRadians = (angle - 90) * (Math.PI / 180);
                const x1 = 50 + Math.cos(angleInRadians) * 50;
                const y1 = 50 + Math.sin(angleInRadians) * 50;
                const x2 = 50 + Math.cos(angleInRadians + Math.PI) * 50;
                const y2 = 50 + Math.sin(angleInRadians + Math.PI) * 50;

                gradient.setAttribute('x1', `${x1}%`);
                gradient.setAttribute('y1', `${y1}%`);
                gradient.setAttribute('x2', `${x2}%`);
                gradient.setAttribute('y2', `${y2}%`);

                // Linear gradient colors
                const stop1 = document.createElementNS(svgNamespace, "stop");
                const stop2 = document.createElementNS(svgNamespace, "stop");
                
                stop1.setAttribute("offset", "0%");
                stop2.setAttribute("offset", "100%");
                
                stop1.setAttribute("stop-color", backgroundSettings.borderColor);
                stop2.setAttribute("stop-color", backgroundSettings.fillColor);

                gradient.appendChild(stop1);
                gradient.appendChild(stop2);
              } else {
                // Radial gradient
                gradient.setAttribute('gradientUnits', 'objectBoundingBox');
                
                const position = backgroundSettings.gradientPosition;
                
                switch (position) {
                  case 'left':
                    gradient.setAttribute('cx', '0');
                    gradient.setAttribute('cy', '0.5');
                    gradient.setAttribute('r', '1');
                    gradient.setAttribute('fx', '0');
                    gradient.setAttribute('fy', '0.5');
                    break;
                  case 'right':
                    gradient.setAttribute('cx', '1');
                    gradient.setAttribute('cy', '0.5');
                    gradient.setAttribute('r', '1');
                    gradient.setAttribute('fx', '1');
                    gradient.setAttribute('fy', '0.5');
                    break;
                  case 'center':
                  default:
                    gradient.setAttribute('cx', '0.5');
                    gradient.setAttribute('cy', '0.5');
                    gradient.setAttribute('r', '0.7071067811865476');
                    gradient.setAttribute('fx', '0.5');
                    gradient.setAttribute('fy', '0.5');
                    break;
                }

                const stop1 = document.createElementNS(svgNamespace, "stop");
                const stop2 = document.createElementNS(svgNamespace, "stop");
                
                stop1.setAttribute("offset", "0%");
                stop2.setAttribute("offset", "100%");

                if (position === 'right') {
                  stop1.setAttribute("stop-color", backgroundSettings.fillColor);
                  stop2.setAttribute("stop-color", backgroundSettings.borderColor);
                } else {
                  stop1.setAttribute("stop-color", backgroundSettings.fillColor);
                  stop2.setAttribute("stop-color", backgroundSettings.borderColor);
                }

                gradient.appendChild(stop1);
                gradient.appendChild(stop2);
              }
              defs.appendChild(gradient);
              svg.appendChild(defs);

              background.setAttribute("fill", `url(#${gradientId})`);
            } else {
              background.setAttribute("fill", backgroundSettings.fillColor);
              if (backgroundSettings.borderWidth > 0) {
                background.setAttribute("stroke", backgroundSettings.borderColor);
                background.setAttribute("stroke-width", backgroundSettings.borderWidth.toString());
              }
            }

            svg.appendChild(background);

            // Add icon
            const iconSvg = downloadableZone.querySelector('svg');
            if (iconSvg) {
              const iconClone = iconSvg.cloneNode(true) as SVGElement;
              const iconSize = iconSettings.size;
              const x = (500 - iconSize) / 2;
              const y = (500 - iconSize) / 2;

              const iconGroup = document.createElementNS(svgNamespace, "g");
              iconGroup.setAttribute("transform", `translate(${x},${y}) rotate(${iconSettings.rotate} ${iconSize/2} ${iconSize/2})`);

              iconClone.setAttribute("width", iconSize.toString());
              iconClone.setAttribute("height", iconSize.toString());
              iconClone.setAttribute("stroke", iconSettings.fillColor);
              iconClone.setAttribute("stroke-width", (iconSettings.borderWidth || 2).toString());
              iconClone.setAttribute("fill", "none");

              iconClone.querySelectorAll('path, circle, rect, line').forEach(el => {
                el.setAttribute("stroke", iconSettings.fillColor);
                el.setAttribute("stroke-width", (iconSettings.borderWidth || 2).toString());
                el.setAttribute("fill", "none");
              });

              iconGroup.appendChild(iconClone);
              svg.appendChild(iconGroup);
            }

            // Convert to string and download
            const svgString = new XMLSerializer().serializeToString(svg);
            const svgBlob = new Blob([svgString], { type: 'image/svg+xml' });
            const svgUrl = URL.createObjectURL(svgBlob);
            const downloadLink = document.createElement('a');
            downloadLink.href = svgUrl;
            downloadLink.download = 'logo.svg';
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
            URL.revokeObjectURL(svgUrl);
          } catch (err) {
            console.error('Error creating SVG:', err);
            throw err;
          }
          break;
      }
    } catch (error) {
      console.error('Error in handleDownload:', error);
      throw error;
    }
  };

  const [isDownloadOpen, setIsDownloadOpen] = useState(false);
  const downloadRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (downloadRef.current && !downloadRef.current.contains(event.target as Node)) {
        setIsDownloadOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const [isAIModalOpen, setIsAIModalOpen] = useState(false);

  const handleIconSelect = (svgPath: string) => {
    setSelectedIcon('custom');  
    setIconSettings(prev => ({
      ...prev,
      customSvgPath: svgPath
    }));
  };

  const [generatedIcons, setGeneratedIcons] = useState<string[]>([]);

  const handleIconsGenerated = (icons: string[]) => {
    setGeneratedIcons(icons);
    // Add logic to display the icons in your UI
  };

  const handleIconClick = (iconName: string) => {
    setSelectedIcon(iconName);
    setIconSettings(prev => ({
      ...prev,
      customSvgPath: undefined  
    }));
  };

  return (
    <div>
      <Navbar 
        currentHistoryIndex={currentHistoryIndex}
        historyLength={history.length}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onDownload={handleDownload}
      />

      <div className="flex h-[calc(100vh-57px)]">
        {/* Left Sidebar */}
        <div className="w-[280px] bg-white border-r flex-shrink-0">
          <div className="h-full overflow-y-auto">
            <div className="p-4 space-y-6">
              <div>
                <div className="flex gap-2 mb-4 bg-gray-100 p-1 rounded-lg">
                  <button 
                    className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                      activeTab === 'icon' 
                        ? 'bg-white shadow text-gray-900' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                    onClick={() => setActiveTab('icon')}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <ScrollText className="w-4 h-4" />
                      <span>Icon</span>
                    </div>
                  </button>
                  <button 
                    className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                      activeTab === 'background' 
                        ? 'bg-white shadow text-gray-900' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                    onClick={() => setActiveTab('background')}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 rounded-full border-2 border-current" />
                      <span>Background</span>
                    </div>
                  </button>
                </div>
              </div>

              {activeTab === 'icon' ? (
                <IconTools
                  size={iconSettings.size}
                  rotate={iconSettings.rotate}
                  borderWidth={iconSettings.borderWidth}
                  fillColor={iconSettings.fillColor}
                  fillOpacity={iconSettings.fillOpacity}
                  onSizeChange={(value) => updateIconSettings({ ...iconSettings, size: value })}
                  onRotateChange={(value) => updateIconSettings({ ...iconSettings, rotate: value })}
                  onBorderWidthChange={(value) => updateIconSettings({ ...iconSettings, borderWidth: value })}
                  onFillColorChange={(color) => updateIconSettings({ ...iconSettings, fillColor: color })}
                  onFillOpacityChange={(value) => updateIconSettings({ ...iconSettings, fillOpacity: value })}
                />
              ) : (
                <BackgroundTools
                  rounded={backgroundSettings.rounded}
                  padding={backgroundSettings.padding}
                  shadow={backgroundSettings.shadow}
                  color={backgroundSettings.fillColor}
                  borderColor={backgroundSettings.borderColor}
                  isGradient={backgroundSettings.isGradient}
                  gradientAngle={backgroundSettings.gradientAngle}
                  gradientType={backgroundSettings.gradientType}
                  gradientPosition={backgroundSettings.gradientPosition}
                  onRoundedChange={(value) => updateBackgroundSettings({ ...backgroundSettings, rounded: value })}
                  onPaddingChange={(value) => updateBackgroundSettings({ ...backgroundSettings, padding: value })}
                  onShadowChange={(value) => updateBackgroundSettings({ ...backgroundSettings, shadow: value })}
                  onColorChange={(color) => updateBackgroundSettings({ ...backgroundSettings, fillColor: color })}
                  onBorderColorChange={(color) => updateBackgroundSettings({ ...backgroundSettings, borderColor: color })}
                  onGradientChange={(isGradient) => updateBackgroundSettings({ ...backgroundSettings, isGradient })}
                  onGradientAngleChange={(angle) => updateBackgroundSettings({ ...backgroundSettings, gradientAngle: angle })}
                  onGradientTypeChange={(type) => updateBackgroundSettings({ ...backgroundSettings, gradientType: type })}
                  onGradientPositionChange={(position) => updateBackgroundSettings({ ...backgroundSettings, gradientPosition: position })}
                />
              )}
            </div>
          </div>
        </div>

        <LogoCanvas 
          iconContent={getIconContent()}
          iconSettings={iconSettings}
          backgroundSettings={backgroundSettings}
          getBackgroundStyle={getBackgroundStyle}
          getShadowStyle={getShadowStyle}
        />

        {/* Right Sidebar */}
        <div className="w-[280px] bg-white border-l flex-shrink-0">
          <div className="h-full overflow-y-auto">
            <div className="p-4">
              <button
                onClick={() => setIsAIModalOpen(true)}
                className="w-full mb-6 flex items-center justify-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors"
              >
                <Sparkles className="w-4 h-4" />
                Ask AI
              </button>
              <h3 className="text-sm font-medium text-gray-900 mb-4">Icons</h3>
              <IconGrid 
                icons={icons}
                selectedIcon={selectedIcon}
                onIconClick={handleIconClick}
              />
            </div>
          </div>
        </div>
      </div>

      <AskAIModal 
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        onIconSelect={handleIconSelect}
      />
    </div>
  );
}
