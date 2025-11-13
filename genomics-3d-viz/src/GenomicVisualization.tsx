import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';
import { VisualizationData, VisualizationSettings } from './types';
import { mapDataTo3D, getColorForValue, createChromosomeLabels } from './chromosomeMapper';

interface GenomicVisualizationProps {
  data: VisualizationData;
  settings: VisualizationSettings;
}

const DataPoints: React.FC<{ data: VisualizationData; settings: VisualizationSettings }> = ({ data, settings }) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);

  const { positions, colors } = useMemo(() => {
    const positions = mapDataTo3D(data);
    const colors = data.dataPoints.map(point =>
      getColorForValue(point.value, data.minValue, data.maxValue, settings.colorScheme)
    );
    return { positions, colors };
  }, [data, settings]);

  useFrame(() => {
    if (meshRef.current) {
      positions.forEach((position, i) => {
        const matrix = new THREE.Matrix4();
        matrix.setPosition(position);
        meshRef.current!.setMatrixAt(i, matrix);
        meshRef.current!.setColorAt(i, colors[i]);
      });
      meshRef.current.instanceMatrix.needsUpdate = true;
      if (meshRef.current.instanceColor) {
        meshRef.current.instanceColor.needsUpdate = true;
      }
    }
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, positions.length]}>
      <sphereGeometry args={[settings.pointSize, 8, 8]} />
      <meshBasicMaterial />
    </instancedMesh>
  );
};

const ChromosomeLabels: React.FC<{ data: VisualizationData; settings: VisualizationSettings }> = ({ data, settings }) => {
  if (!settings.showLabels) return null;

  const labels = useMemo(() => createChromosomeLabels(data.chromosomes), [data.chromosomes]);

  return (
    <>
      {labels.map((label, index) => (
        <Text
          key={index}
          position={label.position}
          fontSize={0.5}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          {label.text}
        </Text>
      ))}
    </>
  );
};

const GenomicVisualization: React.FC<GenomicVisualizationProps> = ({ data, settings }) => {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0, settings.cameraDistance], fov: 75 }}
        style={{ background: '#0a0a0a' }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <DataPoints data={data} settings={settings} />
        <ChromosomeLabels data={data} settings={settings} />
        <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
        <gridHelper args={[50, 50, '#333333', '#333333']} />
      </Canvas>
    </div>
  );
};

export default GenomicVisualization;