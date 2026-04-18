import { useMemo } from 'react';
import useStore from '../../store/useStore';
import * as THREE from 'three';

export default function HallFloor() {
  const lightColor = useStore(s => s.lighting.color);
  const intensity = useStore(s => s.lighting.intensity);
  const normalizedIntensity = intensity / 100;

  // Floor
  // 4 Walls (thin boxes)
  // Edge lighting strips (thin boxes along floor edges with emissive material)

  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[16, 9]} />
        <meshStandardMaterial color="#0a1628" roughness={0.8} metalness={0.1} />
      </mesh>

      {/* Grid lines on floor */}
      {/* Create subtle grid using thin lines */}
      <gridHelper args={[16, 16, '#112240', '#0d1a30']} position={[0, 0.001, 0]} />

      {/* Walls */}
      {/* North wall */}
      <mesh position={[0, 0.75, -4.5]}>
        <boxGeometry args={[16, 1.5, 0.15]} />
        <meshStandardMaterial color="#0d1a2e" roughness={0.6} />
      </mesh>
      {/* South wall */}
      <mesh position={[0, 0.75, 4.5]}>
        <boxGeometry args={[16, 1.5, 0.15]} />
        <meshStandardMaterial color="#0d1a2e" roughness={0.6} />
      </mesh>
      {/* East wall */}
      <mesh position={[-8, 0.75, 0]}>
        <boxGeometry args={[0.15, 1.5, 9]} />
        <meshStandardMaterial color="#0d1a2e" roughness={0.6} />
      </mesh>
      {/* West wall */}
      <mesh position={[8, 0.75, 0]}>
        <boxGeometry args={[0.15, 1.5, 9]} />
        <meshStandardMaterial color="#0d1a2e" roughness={0.6} />
      </mesh>

      {/* Edge lighting strips */}
      <mesh position={[0, 0.02, -4.35]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[15.7, 0.08]} />
        <meshBasicMaterial color={lightColor} transparent opacity={normalizedIntensity * 0.8} />
      </mesh>
      <mesh position={[0, 0.02, 4.35]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[15.7, 0.08]} />
        <meshBasicMaterial color={lightColor} transparent opacity={normalizedIntensity * 0.8} />
      </mesh>
      <mesh position={[-7.85, 0.02, 0]} rotation={[-Math.PI / 2, 0, Math.PI / 2]}>
        <planeGeometry args={[8.7, 0.08]} />
        <meshBasicMaterial color={lightColor} transparent opacity={normalizedIntensity * 0.8} />
      </mesh>
      <mesh position={[7.85, 0.02, 0]} rotation={[-Math.PI / 2, 0, Math.PI / 2]}>
        <planeGeometry args={[8.7, 0.08]} />
        <meshBasicMaterial color={lightColor} transparent opacity={normalizedIntensity * 0.8} />
      </mesh>

      {/* Ambient glow on floor center */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]}>
        <circleGeometry args={[5, 32]} />
        <meshBasicMaterial color={lightColor} transparent opacity={normalizedIntensity * 0.06} />
      </mesh>
    </group>
  );
}
