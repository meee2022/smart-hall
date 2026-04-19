import { useRef, useState, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, Text } from '@react-three/drei';
import useStore from '../../store/useStore';
import { useI18n } from '../../hooks/useI18n';
import * as THREE from 'three';

export default function Screen3D({ position, rotation, screenId, label }) {
  const { t } = useI18n();
  const meshRef = useRef();
  const lightRef = useRef();
  const screen = useStore(s => s.screens.find(sc => sc.id === screenId));
  const selectedId = useStore(s => s.selectedScreenId);
  const setSelected = useStore(s => s.setSelectedScreenId);
  const isSelected = selectedId === screenId;
  const isOn = screen && screen.status !== 'off';
  const isPlaying = screen && screen.status === 'playing';
  const isEmergency = screen && screen.status === 'emergency';
  const isPaused = screen && screen.status === 'paused';

  const emissiveColor = isEmergency ? '#ff3b5c' : isPlaying ? '#00ff88' : isPaused ? '#ffcc00' : isOn ? '#8D1B3D' : '#050505';
  const emissiveIntensity = isSelected ? 2.5 : isPlaying ? 1.8 : isPaused ? 1.2 : isOn ? 0.8 : 0.1;

  // Setup the video element
  const [video] = useState(() => {
    const vid = document.createElement('video');
    vid.src = 'https://vjs.zencdn.net/v/oceans.mp4';
    vid.crossOrigin = 'Anonymous';
    vid.loop = true;
    vid.muted = true;
    vid.playsInline = true;
    return vid;
  });

  const videoTexture = useMemo(() => {
    const tex = new THREE.VideoTexture(video);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, [video]);

  // Play or pause based on isPlaying state
  useEffect(() => {
    if (isPlaying) {
      video.play().catch(e => console.log('Video auto-play blocked', e));
    } else {
      video.pause();
    }
  }, [isPlaying, video]);

  useFrame((state) => {
    if (meshRef.current && isPlaying) {
      meshRef.current.material.emissiveIntensity = emissiveIntensity * (0.8 + Math.sin(state.clock.elapsedTime * 3) * 0.2);
    }
    if (lightRef.current) {
      lightRef.current.intensity = isOn ? (2.0 + Math.sin(state.clock.elapsedTime * 2) * 0.5) : 0;
    }
  });

  return (
    <group position={position} rotation={rotation}>
      {/* ── Screen Frame (Metallic Bezel) ── */}
      <mesh castShadow position={[0, 0, 0]}>
        <boxGeometry args={[3.5, 1.2, 0.1]} />
        <meshStandardMaterial color="#0a0a0f" roughness={0.1} metalness={0.9} />
      </mesh>

      {/* ── Screen Surface (The LED Panel) ── */}
      <mesh
        ref={meshRef}
        position={[0, 0, 0.051]}
        onClick={(e) => { e.stopPropagation(); setSelected(screenId); }}
      >
        <planeGeometry args={[3.3, 1.1]} />
        <meshStandardMaterial
          map={isPlaying && !isEmergency ? videoTexture : null}
          color={isOn ? '#050a1a' : '#020202'}
          emissive={emissiveColor}
          emissiveIntensity={emissiveIntensity}
          roughness={0.1}
          metalness={0.2}
        />
      </mesh>

      {/* ── Glass Overlay (Realism Layer) ── */}
      <mesh position={[0, 0, 0.06]}>
        <planeGeometry args={[3.3, 1.1]} />
        <meshPhysicalMaterial
          transparent
          opacity={0.1}
          roughness={0.05}
          metalness={0.6}
          thickness={0.05}
          transmission={0.95}
          ior={1.5}
          color="#ffffff"
        />
      </mesh>

      {/* ── Content Text (High Visibility) ── */}
      {isOn && screen?.content && (
        <group position={[0, 0, 0.07]}>
          <Text
            fontSize={0.25}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
            maxWidth={3}
            textAlign="center"
          >
            {`${screen.contentIcon} ${t(screen.content)}`}
          </Text>
        </group>
      )}

      {/* ── Label (Subtitle) ── */}
      <Html position={[0, -0.85, 0.1]} center style={{ pointerEvents: 'none' }}>
        <div style={{
          fontSize: '10px',
          fontWeight: '700',
          fontFamily: 'system-ui, sans-serif',
          color: isOn ? emissiveColor : '#334',
          textTransform: 'uppercase',
          letterSpacing: '0.15em',
          whiteSpace: 'nowrap',
          textShadow: isOn ? `0 0 10px ${emissiveColor}` : 'none',
          transition: 'all 0.3s'
        }}>
          {t(screen?.name || label)}
        </div>
      </Html>

      {/* ── Point Light (Emitted Glow) ── */}
      {isOn && (
        <rectAreaLight
          ref={lightRef}
          position={[0, 0, 0.1]}
          rotation={[0, 0, 0]}
          width={3.3}
          height={1.1}
          color={emissiveColor}
          intensity={2}
        />
      )}

      {/* ── Selection Indicator ── */}
      {isSelected && (
        <mesh position={[0, 0, -0.05]}>
          <boxGeometry args={[3.7, 1.4, 0.02]} />
          <meshBasicMaterial color="#00e5ff" transparent opacity={0.2} />
        </mesh>
      )}
    </group>
  );
}
