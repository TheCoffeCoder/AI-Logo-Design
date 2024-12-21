'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import html2canvas from 'html2canvas';
import { 
  Plus,
  BookOpen,
  Book,
  BookText,
  Library,
  Notebook,
  ScrollText,
  Undo2,
  Redo2,
  ChevronDown,
  FileImage,
  FileCode,
  Download
} from 'lucide-react';
import ColorPicker from './ColorPicker';
import BackgroundTools from './BackgroundTools';
import IconTools from './IconTools';

interface LogoSettings {
  size: number;
  rotate: number;
  borderWidth: number;
  borderColor: string;
  fillOpacity: number;
  fillColor: string;
}

type GradientPosition = 'left' | 'center' | 'right' | 'custom';

interface BackgroundSettings extends LogoSettings {
  rounded: number;
  padding: number;
  shadow: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'none';
  isGradient: boolean;
  gradientAngle: number;
  gradientType: 'linear' | 'radial';
  gradientPosition: GradientPosition;
}

interface Template {
  id: string;
  name: string;
  shape: 'circle' | 'rounded-rectangle' | 'rectangle';
  gradient: string;
  svg: string;
}

interface LogoDesignerProps {}

interface HistoryState {
  iconSettings: LogoSettings;
  backgroundSettings: BackgroundSettings;
}

export default function LogoDesigner({}: LogoDesignerProps) {
  const [activeTab, setActiveTab] = useState<'icon' | 'background'>('icon');
  const [selectedIcon, setSelectedIcon] = useState<string>('book');
  
  const [iconSettings, setIconSettings] = useState<LogoSettings>({
    size: 300,
    rotate: 0,
    borderWidth: 0,
    borderColor: '#000000',
    fillOpacity: 100,
    fillColor: '#000000'
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

  const addToHistory = useCallback((newIconSettings: LogoSettings, newBackgroundSettings: BackgroundSettings) => {
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

  const updateIconSettings = useCallback((newSettings: LogoSettings) => {
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
    ? (settings: LogoSettings) => updateIconSettings(settings)
    : (settings: Partial<BackgroundSettings>) => updateBackgroundSettings({ ...backgroundSettings, ...settings });

  const icons = {
    book: <BookText strokeWidth={2} />,
    library: <Library strokeWidth={2} />,
    notebook: <Notebook strokeWidth={2} />,
    scroll: <ScrollText strokeWidth={2} />
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
    const selectedIconComponent = icons[selectedIcon as keyof typeof icons];
    if (!selectedIconComponent) return null;

    return React.cloneElement(selectedIconComponent, {
      className: 'w-full h-full',
      width: "100%",
      height: "100%",
      strokeWidth: iconSettings.borderWidth || 2,
      stroke: iconSettings.fillColor,
      style: {
        strokeWidth: iconSettings.borderWidth || 2,
        stroke: iconSettings.fillColor,
        fill: 'none'
      }
    });
  };

  const handleDownload = async (format: 'png' | 'svg') => {
    const downloadableZone = document.querySelector('.logo-background');
    const logoContainer = downloadableZone?.querySelector('.logo-container');
    const iconContainer = downloadableZone?.querySelector('.icon-container');
    
    if (!downloadableZone || !logoContainer || !iconContainer) {
      console.error('Logo elements not found');
      return;
    }

    try {
      switch (format) {
        case 'png':
          try {
            const tempContainer = downloadableZone.cloneNode(true) as HTMLElement;
            const tempLogo = tempContainer.querySelector('.logo-container') as HTMLElement;
            const tempIcon = tempContainer.querySelector('.icon-container') as HTMLElement;
            const tempSvg = tempIcon?.querySelector('svg') as SVGElement;
            
            // Apply styles to the temporary container
            tempContainer.style.position = 'absolute';
            tempContainer.style.left = '-9999px';
            tempContainer.classList.remove('border-2', 'border-dashed', 'border-gray-300');
            
            // Apply logo container styles
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
            
            // Apply icon styles
            if (tempIcon) {
              tempIcon.style.width = `${iconSettings.size}px`;
              tempIcon.style.height = `${iconSettings.size}px`;
              tempIcon.style.transform = `rotate(${iconSettings.rotate}deg)`;
              tempIcon.style.opacity = (iconSettings.fillOpacity / 100).toString();
            }

            // Apply SVG styles
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
              const svgElements = tempSvg.querySelectorAll('path, circle, rect, line');
              svgElements.forEach(el => {
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
            
            // Add to document temporarily
            document.body.appendChild(tempContainer);
            
            // Use html2canvas
            const canvas = await html2canvas(tempContainer, {
              backgroundColor: null,
              scale: 2,
              logging: false,
              useCORS: true,
              allowTaint: true,
              width: 500,
              height: 500
            });
            
            // Remove temporary container
            document.body.removeChild(tempContainer);

            // Convert to blob and download
            const pngBlob = await new Promise<Blob | null>((resolve) => {
              canvas.toBlob(resolve, 'image/png', 1.0);
            });

            if (!pngBlob) {
              throw new Error('Failed to create PNG blob');
            }

            const downloadUrl = URL.createObjectURL(pngBlob);
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = 'logo.png';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(downloadUrl);
          } catch (err) {
            console.error('Error creating PNG:', err);
            throw err;
          }
          break;

        case 'svg':
          try {
            // Create a new SVG element
            const svgNamespace = "http://www.w3.org/2000/svg";
            const svg = document.createElementNS(svgNamespace, "svg");
            svg.setAttribute("width", "500");
            svg.setAttribute("height", "500");
            svg.setAttribute("viewBox", "0 0 500 500");
            
            // Add defs for gradient if needed
            const defs = document.createElementNS(svgNamespace, "defs");
            let gradientId = '';
            
            if (backgroundSettings.isGradient) {
              gradientId = 'logoGradient';
              const gradient = document.createElementNS(
                svgNamespace,
                backgroundSettings.gradientType === 'linear' ? 'linearGradient' : 'radialGradient'
              );
              gradient.setAttribute('id', gradientId);
              
              if (backgroundSettings.gradientType === 'linear') {
                // Set x1, y1, x2, y2 for precise angle control
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

                // Add gradient stops for linear gradient
                const stop1 = document.createElementNS(svgNamespace, "stop");
                stop1.setAttribute("offset", "0%");
                stop1.setAttribute("stop-color", backgroundSettings.borderColor);
                
                const stop2 = document.createElementNS(svgNamespace, "stop");
                stop2.setAttribute("offset", "100%");
                stop2.setAttribute("stop-color", backgroundSettings.fillColor);
                
                gradient.appendChild(stop1);
                gradient.appendChild(stop2);
              } else {
                // For radial gradient
                const position = backgroundSettings.gradientPosition;
                let cx = '50%', cy = '50%';
                let fx = '50%', fy = '50%';
                let r = '70%';
                
                switch (position) {
                  case 'left':
                    cx = '0%';
                    cy = '50%';
                    fx = '0%';
                    fy = '50%';
                    r = '100%';
                    break;
                  case 'right':
                    cx = '100%';
                    cy = '50%';
                    fx = '100%';
                    fy = '50%';
                    r = '100%';
                    break;
                  case 'custom':
                    // Add custom position handling if needed
                    break;
                }
                
                gradient.setAttribute('cx', cx);
                gradient.setAttribute('cy', cy);
                gradient.setAttribute('r', r);
                gradient.setAttribute('fx', fx);
                gradient.setAttribute('fy', fy);
                gradient.setAttribute('gradientUnits', 'userSpaceOnUse');
                
                if (position === 'left' || position === 'right') {
                  const stop1 = document.createElementNS(svgNamespace, "stop");
                  stop1.setAttribute("offset", "0%");
                  stop1.setAttribute("stop-color", backgroundSettings.fillColor);
                  
                  const stop2 = document.createElementNS(svgNamespace, "stop");
                  stop2.setAttribute("offset", "100%");
                  stop2.setAttribute("stop-color", backgroundSettings.borderColor);
                  
                  gradient.appendChild(stop1);
                  gradient.appendChild(stop2);
                } else {
                  // Center position uses two stops
                  const stop1 = document.createElementNS(svgNamespace, "stop");
                  stop1.setAttribute("offset", "0%");
                  stop1.setAttribute("stop-color", backgroundSettings.fillColor);
                  
                  const stop2 = document.createElementNS(svgNamespace, "stop");
                  stop2.setAttribute("offset", "100%");
                  stop2.setAttribute("stop-color", backgroundSettings.borderColor);
                  
                  gradient.appendChild(stop1);
                  gradient.appendChild(stop2);
                }
              }
              
              defs.appendChild(gradient);
              svg.appendChild(defs);
            }
            
            // Create background
            const background = document.createElementNS(svgNamespace, "rect");
            background.setAttribute("width", "500");
            background.setAttribute("height", "500");
            background.setAttribute("rx", backgroundSettings.rounded === 9999 ? "250" : backgroundSettings.rounded.toString());
            background.setAttribute("ry", backgroundSettings.rounded === 9999 ? "250" : backgroundSettings.rounded.toString());
            
            if (backgroundSettings.isGradient) {
              background.setAttribute("fill", `url(#${gradientId})`);
            } else {
              background.setAttribute("fill", backgroundSettings.fillColor);
              if (backgroundSettings.borderWidth > 0) {
                background.setAttribute("stroke", backgroundSettings.borderColor);
                background.setAttribute("stroke-width", backgroundSettings.borderWidth.toString());
              }
            }
            
            background.style.opacity = (backgroundSettings.fillOpacity / 100).toString();
            svg.appendChild(background);

            // Get the current icon SVG
            const iconSvg = iconContainer.querySelector('svg');
            if (iconSvg) {
              const iconClone = iconSvg.cloneNode(true) as SVGElement;
              
              // Calculate icon position to center it
              const iconSize = iconSettings.size;
              const x = (500 - iconSize) / 2;
              const y = (500 - iconSize) / 2;
              
              // Create a group for the icon with proper transformation
              const iconGroup = document.createElementNS(svgNamespace, "g");
              iconGroup.setAttribute("transform", `translate(${x},${y}) rotate(${iconSettings.rotate} ${iconSize/2} ${iconSize/2})`);
              
              // Set icon styles
              iconClone.setAttribute("width", iconSize.toString());
              iconClone.setAttribute("height", iconSize.toString());
              iconClone.setAttribute("stroke", iconSettings.fillColor);
              iconClone.setAttribute("stroke-width", (iconSettings.borderWidth || 2).toString());
              iconClone.setAttribute("fill", "none");
              
              // Apply styles to all icon elements
              iconClone.querySelectorAll('path, circle, rect, line').forEach(el => {
                el.setAttribute("stroke", iconSettings.fillColor);
                el.setAttribute("stroke-width", (iconSettings.borderWidth || 2).toString());
                el.setAttribute("fill", "none");
              });
              
              iconGroup.appendChild(iconClone);
              svg.appendChild(iconGroup);
            }

            // Convert SVG to string and download
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

  return (
    <div>
      {/* Navbar */}
      <nav className="h-14 border-b flex items-center px-4 justify-between">
        <div className="flex items-center gap-6">
          <h1 className="text-xl font-semibold">Logo Designer</h1>
          <div className="flex items-center gap-2">
            <button 
              className={`p-2 rounded-md ${currentHistoryIndex > 0 ? 'hover:bg-gray-100 text-gray-900' : 'text-gray-300 cursor-not-allowed'}`}
              onClick={handleUndo}
              disabled={currentHistoryIndex === 0}
            >
              <Undo2 className="w-4 h-4" />
            </button>
            <button 
              className={`p-2 rounded-md ${currentHistoryIndex < history.length - 1 ? 'hover:bg-gray-100 text-gray-900' : 'text-gray-300 cursor-not-allowed'}`}
              onClick={handleRedo}
              disabled={currentHistoryIndex === history.length - 1}
            >
              <Redo2 className="w-4 h-4" />
            </button>
          </div>
        </div>
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
                  handleDownload('png');
                  setIsDownloadOpen(false);
                }}
              >
                <FileImage className="w-4 h-4" />
                PNG
              </button>
              <button
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                onClick={() => {
                  handleDownload('svg');
                  setIsDownloadOpen(false);
                }}
              >
                <FileCode className="w-4 h-4" />
                SVG
              </button>
            </div>
          )}
        </div>
      </nav>

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

        {/* Main Content */}
        <div className="flex-1 bg-[#f8f9fa] overflow-auto">
          <div className="h-full w-full min-h-[800px] relative">
            <div className="absolute inset-0" style={{ 
              backgroundImage: `
                linear-gradient(to right, #e5e7eb 1px, transparent 1px),
                linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)
              `,
              backgroundSize: '20px 20px'
            }} />
            
            {/* Downloadable Zone Indicator */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                {/* Fixed Downloadable Zone */}
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
                  {/* Logo Container that expands with padding */}
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
                        {getIconContent()}
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

        {/* Right Sidebar */}
        <div className="w-[280px] bg-white border-l flex-shrink-0">
          <div className="h-full overflow-y-auto">
            <div className="p-4">
              <h3 className="text-sm font-medium text-gray-900 mb-4">Icons</h3>
              <div className="grid grid-cols-3 gap-2">
                {Object.entries(icons).map(([key, icon]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedIcon(key)}
                    className={`w-full aspect-square border-2 rounded-md flex items-center justify-center p-2 ${
                      selectedIcon === key ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-gray-700">
                      {icon}
                    </div>
                  </button>
                ))}
                <button className="w-full aspect-square border-2 border-gray-200 rounded-md flex items-center justify-center hover:border-gray-300">
                  <Plus className="w-6 h-6 text-gray-400" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
