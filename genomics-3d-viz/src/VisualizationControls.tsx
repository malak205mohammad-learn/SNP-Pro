import React from 'react';
import { VisualizationSettings } from './types';

interface VisualizationControlsProps {
  settings: VisualizationSettings;
  onSettingsChange: (settings: VisualizationSettings) => void;
  availableSamples: string[];
  currentSample: string;
  onSampleChange: (sample: string) => void;
}

const VisualizationControls: React.FC<VisualizationControlsProps> = ({
  settings,
  onSettingsChange,
  availableSamples,
  currentSample,
  onSampleChange
}) => {
  const updateSetting = (key: keyof VisualizationSettings, value: any) => {
    onSettingsChange({ ...settings, [key]: value });
  };

  return (
    <div className="absolute top-4 left-4 bg-black bg-opacity-80 text-white p-4 rounded-lg min-w-64 z-10">
      <h3 className="text-lg font-bold mb-4">Visualization Controls</h3>

      {/* Sample Selection */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Sample</label>
        <select
          value={currentSample}
          onChange={(e) => onSampleChange(e.target.value)}
          className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white"
        >
          {availableSamples.map(sample => (
            <option key={sample} value={sample}>{sample}</option>
          ))}
        </select>
      </div>

      {/* Point Size */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">
          Point Size: {settings.pointSize.toFixed(2)}
        </label>
        <input
          type="range"
          min="0.01"
          max="0.5"
          step="0.01"
          value={settings.pointSize}
          onChange={(e) => updateSetting('pointSize', parseFloat(e.target.value))}
          className="w-full"
        />
      </div>

      {/* Camera Distance */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">
          Camera Distance: {settings.cameraDistance}
        </label>
        <input
          type="range"
          min="10"
          max="100"
          step="5"
          value={settings.cameraDistance}
          onChange={(e) => updateSetting('cameraDistance', parseInt(e.target.value))}
          className="w-full"
        />
      </div>

      {/* Color Scheme */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Color Scheme</label>
        <select
          value={settings.colorScheme}
          onChange={(e) => updateSetting('colorScheme', e.target.value)}
          className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white"
        >
          <option value="viridis">Viridis</option>
          <option value="plasma">Plasma</option>
          <option value="inferno">Inferno</option>
          <option value="magma">Magma</option>
        </select>
      </div>

      {/* Show Labels */}
      <div className="mb-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={settings.showLabels}
            onChange={(e) => updateSetting('showLabels', e.target.checked)}
            className="mr-2"
          />
          <span className="text-sm font-medium">Show Chromosome Labels</span>
        </label>
      </div>

      {/* Reset Camera */}
      <button
        onClick={() => updateSetting('cameraDistance', 30)}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
      >
        Reset Camera
      </button>
    </div>
  );
};

export default VisualizationControls;