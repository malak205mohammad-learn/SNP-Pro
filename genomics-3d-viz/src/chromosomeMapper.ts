import { GenomicDataPoint, ChromosomeInfo, VisualizationData } from './types';
import * as THREE from 'three';

export const mapDataTo3D = (data: VisualizationData): THREE.Vector3[] => {
  const positions: THREE.Vector3[] = [];

  data.dataPoints.forEach((point) => {
    const chromosome = data.chromosomes.find(chr => chr.name === point.chromosome);
    if (!chromosome) return;

    // Find the index of this data point within its chromosome
    const chromosomePoints = data.dataPoints.filter(dp => dp.chromosome === point.chromosome);
    const pointIndex = chromosomePoints.findIndex(dp => dp.position === point.position);

    // Calculate position along the chromosome (normalized 0-1)
    const normalizedPosition = pointIndex / (chromosome.length - 1);

    // Calculate angle for this chromosome
    const angle = chromosome.startAngle + (chromosome.endAngle - chromosome.startAngle) * normalizedPosition;

    // Calculate radius (slight variation for visual interest)
    const radius = chromosome.radius + Math.sin(normalizedPosition * Math.PI * 4) * 0.5;

    // Convert to 3D coordinates
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;
    const y = normalizedPosition * 20 - 10; // Height based on position

    positions.push(new THREE.Vector3(x, y, z));
  });

  return positions;
};

export const getColorForValue = (value: number, minValue: number, maxValue: number, colorScheme: string = 'viridis'): THREE.Color => {
  // Normalize value to 0-1 range
  const normalizedValue = (value - minValue) / (maxValue - minValue);

  // Color schemes (simplified versions)
  const schemes = {
    viridis: [
      [0.267, 0.0049, 0.3294], // Dark purple
      [0.1276, 0.566, 0.5509], // Teal
      [0.9932, 0.9062, 0.1439]  // Yellow
    ],
    plasma: [
      [0.0504, 0.0296, 0.5271], // Dark blue
      [0.9400, 0.9755, 0.1314], // Yellow
      [0.2742, 0.0000, 0.3333]  // Purple
    ],
    inferno: [
      [0.0015, 0.0005, 0.0139], // Black
      [0.8549, 0.6510, 0.1255], // Orange
      [0.1664, 0.0409, 0.4969]  // Purple
    ],
    magma: [
      [0.0015, 0.0005, 0.0139], // Black
      [0.9871, 0.9910, 0.7495], // Light yellow
      [0.1664, 0.0409, 0.4969]  // Purple
    ]
  };

  const colors = schemes[colorScheme as keyof typeof schemes] || schemes.viridis;

  // Simple linear interpolation between colors
  let color1, color2, t;
  if (normalizedValue < 0.5) {
    color1 = colors[0];
    color2 = colors[1];
    t = normalizedValue * 2;
  } else {
    color1 = colors[1];
    color2 = colors[2];
    t = (normalizedValue - 0.5) * 2;
  }

  const r = color1[0] + (color2[0] - color1[0]) * t;
  const g = color1[1] + (color2[1] - color1[1]) * t;
  const b = color1[2] + (color2[2] - color1[2]) * t;

  return new THREE.Color(r, g, b);
};

export const createChromosomeLabels = (chromosomes: ChromosomeInfo[]): { position: THREE.Vector3; text: string }[] => {
  return chromosomes.map(chr => {
    const midAngle = (chr.startAngle + chr.endAngle) / 2;
    const labelRadius = chr.radius + 3;
    const x = Math.cos(midAngle) * labelRadius;
    const z = Math.sin(midAngle) * labelRadius;
    const y = 0; // Labels at middle height

    return {
      position: new THREE.Vector3(x, y, z),
      text: chr.name.replace('chr', '')
    };
  });
};