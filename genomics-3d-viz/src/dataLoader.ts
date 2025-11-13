import Papa from 'papaparse';
import { GenomicDataPoint, VisualizationData, ChromosomeInfo } from './types';

export const loadGenomicData = async (filePath: string): Promise<VisualizationData> => {
  try {
    const response = await fetch(filePath);
    const csvText = await response.text();

    return new Promise((resolve, reject) => {
      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const dataPoints: GenomicDataPoint[] = results.data.map((row: any) => {
            const keys = Object.keys(row);
            const chromosomeKey = keys[0];
            const valueKey = keys[1];

            return {
              chromosome: row[chromosomeKey],
              position: row[chromosomeKey],
              value: parseFloat(row[valueKey]) || 0
            };
          });

          // Extract unique chromosomes and create chromosome info
          const uniqueChromosomes = [...new Set(dataPoints.map(dp => dp.chromosome))];
          const chromosomes: ChromosomeInfo[] = uniqueChromosomes.map((chr, index) => {
            const angleStep = (Math.PI * 2) / uniqueChromosomes.length;
            return {
              name: chr,
              startAngle: index * angleStep,
              endAngle: (index + 1) * angleStep,
              radius: 10 + index * 2,
              length: dataPoints.filter(dp => dp.chromosome === chr).length
            };
          });

          const values = dataPoints.map(dp => dp.value);
          const minValue = Math.min(...values);
          const maxValue = Math.max(...values);

          resolve({
            dataPoints,
            chromosomes,
            minValue,
            maxValue
          });
        },
        error: (error) => {
          reject(error);
        }
      });
    });
  } catch (error) {
    throw new Error(`Failed to load genomic data: ${error}`);
  }
};

export const getAvailableSamples = async (): Promise<string[]> => {
  // In a real implementation, this would scan the dataset directory
  // For now, return hardcoded sample names based on the folder structure
  return ['GM18983', 'HG02601'];
};

export const getSampleFiles = async (sampleName: string): Promise<string[]> => {
  // In a real implementation, this would list files in the sample directory
  // For now, return a sample file name
  return [`/dataset/${sampleName}/${sampleName}.1000.csv`];
};