import { ReactNode } from 'react';

export interface Settings {
  fontSize?: number;
  scroll?: boolean;
  gridColor?: string;
  leftSetColor?: string;
  leftSetSurplusColor?: string;
  rightSetColor?: string;
  rightSetSurplusColor?: string;
}

export interface ChartEntry{
  name: string;
  value: number;
}

export interface ChartProps{
  width?: number;
  height?: number;
  children?: ReactNode;
  entries?: ChartEntry[];
  measureTitle?: string;
  maxValue: number;
  minValue: number;
  settings?: Settings;
  categoryTitle?: string;
}