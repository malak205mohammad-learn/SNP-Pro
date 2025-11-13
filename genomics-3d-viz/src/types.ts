export interface GenomicDataPoint {
  chromosome: string;
  position: string;
  value: number;
}

export interface ChromosomeInfo {
  name: string;
  startAngle: number;
  endAngle: number;
  radius: number;
  length: number;
}

export interface VisualizationData {
  dataPoints: GenomicDataPoint[];
  chromosomes: ChromosomeInfo[];
  minValue: number;
  maxValue: number;
}

export interface VisualizationSettings {
  pointSize: number;
  cameraDistance: number;
  colorScheme: string;
  showLabels: boolean;
}