import { Canvas } from '@react-three/fiber';
import { OrthographicCamera, OrbitControls, AdaptiveDpr } from '@react-three/drei';
import HallFloor from '../components/Hall/HallFloor';
import CourtLines from '../components/Hall/CourtLines';
import Screen3D from '../components/Hall/Screen3D';
import HallLighting from '../components/Hall/HallLighting';
import QuickScreenControl from '../components/Hall/QuickScreenControl';

export default function ArenaScene() {
  return (
    <div style={{ position: 'relative', width: '100%', height: '500px', borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--border-normal)', background: '#050a12' }}>
      <Canvas shadows>
        <OrthographicCamera makeDefault position={[10, 10, 10]} zoom={45} near={0.1} far={100} />
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          minZoom={30}
          maxZoom={80}
          maxPolarAngle={Math.PI / 3}
          minPolarAngle={Math.PI / 6}
        />
        <AdaptiveDpr pixelated />
        <HallLighting />
        <HallFloor />
        <CourtLines />
        <Screen3D position={[-3.5, 0.5, -4.2]} rotation={[0, 0, 0]} screenId={1} label="North 1" />
        <Screen3D position={[3.5, 0.5, -4.2]} rotation={[0, 0, 0]} screenId={2} label="North 2" />
        <Screen3D position={[-3.5, 0.5, 4.2]} rotation={[0, Math.PI, 0]} screenId={3} label="South 1" />
        <Screen3D position={[3.5, 0.5, 4.2]} rotation={[0, Math.PI, 0]} screenId={4} label="South 2" />
      </Canvas>
      <QuickScreenControl />
    </div>
  );
}
