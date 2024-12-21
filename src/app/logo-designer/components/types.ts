export interface LogoSettings {
  size: number;
  rotate: number;
  borderWidth: number;
  borderColor: string;
  fillOpacity: number;
  fillColor: string;
}

export type GradientPosition = 'left' | 'center' | 'right' | 'custom';

export interface BackgroundSettings extends LogoSettings {
  rounded: number;
  padding: number;
  shadow: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'none';
  isGradient: boolean;
  gradientAngle: number;
  gradientType: 'linear' | 'radial';
  gradientPosition: GradientPosition;
}

export interface Template {
  id: string;
  name: string;
  shape: 'circle' | 'rounded-rectangle' | 'rectangle';
  gradient: string;
  svg: string;
}
