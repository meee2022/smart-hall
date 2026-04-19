import useStore from '../../store/useStore';
import * as THREE from 'three';

export default function HallLighting() {
  const lightColor = useStore(s => s.lighting.color);
  const intensity = useStore(s => s.lighting.intensity);
  const normalizedIntensity = intensity / 100;

  return (
    <group>
      <ambientLight intensity={0.3 + normalizedIntensity * 0.3} color="#ffffff" />
      <directionalLight
        position={[5, 10, 5]}
        intensity={0.6 + normalizedIntensity * 0.4}
        color="#ffffff"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      {/* Colored point light from above (ambient glow) */}
      <pointLight
        position={[0, 6, 0]}
        intensity={normalizedIntensity * 1.5}
        color={lightColor}
        distance={20}
        decay={2}
      />
      {/* Corner accent lights */}
      <pointLight position={[-7, 1, -4]} intensity={normalizedIntensity * 0.3} color={lightColor} distance={8} />
      <pointLight position={[7, 1, -4]} intensity={normalizedIntensity * 0.3} color={lightColor} distance={8} />
      <pointLight position={[-7, 1, 4]} intensity={normalizedIntensity * 0.3} color={lightColor} distance={8} />
      <pointLight position={[7, 1, 4]} intensity={normalizedIntensity * 0.3} color={lightColor} distance={8} />
    </group>
  );
}
