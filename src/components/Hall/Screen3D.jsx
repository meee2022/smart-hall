import { useRef, useState, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import useStore from '../../store/useStore';
import * as THREE from 'three';

export default function Screen3D({ position, rotation, screenId, label }) {
  const meshRef = useRef();
  const screen = useStore(s => s.screens.find(sc => sc.id === screenId));
  const selectedId = useStore(s => s.selectedScreenId);
  const setSelected = useStore(s => s.setSelectedScreenId);
  const isSelected = selectedId === screenId;
  const isOn = screen && screen.status !== 'off';
  const isPlaying = screen && screen.status === 'playing';
  const isEmergency = screen && screen.status === 'emergency';

  const emissiveColor = isEmergency ? '#ff3b5c' : isPlaying ? '#ffffff' : isOn ? '#00e5ff' : '#111';
  const emissiveIntensity = isSelected ? 0.8 : isPlaying ? 0.8 : isOn ? 0.2 : 0.02;

  // Setup the video element
  const [video] = useState(() => {
    const vid = document.createElement('video');
    vid.src = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4';
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
      meshRef.current.material.emissiveIntensity = 0.3 + Math.sin(state.clock.elapsedTime * 2) * 0.15;
    }
  });

  return (
    <group position={position} rotation={rotation}>
      {/* Screen frame */}
      <mesh castShadow position={[0, 0, 0]}>
        <boxGeometry args={[3.5, 1.2, 0.08]} />
        <meshStandardMaterial color="#1a1a2e" roughness={0.3} metalness={0.8} />
      </mesh>
      {/* Screen surface */}
      <mesh
        ref={meshRef}
        position={[0, 0, 0.05]}
        onClick={(e) => { e.stopPropagation(); setSelected(screenId); }}
        castShadow
      >
        <boxGeometry args={[3.2, 1, 0.02]} />
        <meshStandardMaterial
          map={isPlaying && !isEmergency ? videoTexture : null}
          color={isOn ? '#0a1628' : '#050505'}
          emissive={emissiveColor}
          emissiveIntensity={emissiveIntensity}
          emissiveMap={isPlaying && !isEmergency ? videoTexture : null}
          roughness={0.1}
          metalness={0.3}
        />
      </mesh>
      {/* Label */}
      <Html position={[0, -0.85, 0.1]} center style={{ pointerEvents: 'none' }}>
        <div style={{
          fontSize: '10px',
          fontFamily: 'Rajdhani, sans-serif',
          color: isOn ? '#8899aa' : '#334',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          whiteSpace: 'nowrap',
          userSelect: 'none'
        }}>
          {screen?.name || label}
        </div>
      </Html>
      {/* Content label on screen */}
      {isOn && screen?.content && (
        <Html position={[0, 0, 0.08]} center style={{ pointerEvents: 'none' }}>
          <div style={{
            fontSize: '9px',
            fontFamily: 'DM Sans, sans-serif',
            color: 'rgba(255,255,255,0.7)',
            textAlign: 'center',
            maxWidth: '80px',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            userSelect: 'none'
          }}>
            {screen.contentIcon} {screen.content}
          </div>
        </Html>
      )}
      {/* Selection glow */}
      {isSelected && (
        <mesh position={[0, 0, -0.02]}>
          <boxGeometry args={[3.8, 1.4, 0.01]} />
          <meshBasicMaterial color="#00e5ff" transparent opacity={0.15} />
        </mesh>
      )}
    </group>
  );
}
