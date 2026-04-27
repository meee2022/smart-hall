import { Line } from '@react-three/drei';
import useStore from '../../store/useStore';

const HW = 7;
const HH = 4;

function makeCirclePoints(cx, cz, r, segments = 32) {
  const pts = [];
  for (let i = 0; i <= segments; i++) {
    const a = (i / segments) * Math.PI * 2;
    pts.push([cx + Math.cos(a) * r, 0.03, cz + Math.sin(a) * r]);
  }
  return pts;
}

function makeArcPoints(cx, cz, r, startAngle, endAngle, segments = 24) {
  const pts = [];
  for (let i = 0; i <= segments; i++) {
    const a = startAngle + (i / segments) * (endAngle - startAngle);
    pts.push([cx + Math.cos(a) * r, 0.03, cz + Math.sin(a) * r]);
  }
  return pts;
}

function FootballLines({ hw = HW, hh = HH }) {
  const color = '#00e5ff';
  const y = 0.03;
  const penW = Math.min(3, hw * 0.42);
  const penH = Math.min(2, hh * 0.5);
  const goalW = Math.min(1.2, hw * 0.17);
  const goalH = Math.min(1, hh * 0.25);
  const cr = Math.min(1.2, hw * 0.17);
  return (
    <group>
      <Line points={[[-hw,y,-hh],[hw,y,-hh],[hw,y,hh],[-hw,y,hh],[-hw,y,-hh]]} color={color} lineWidth={1.5} />
      <Line points={[[0,y,-hh],[0,y,hh]]} color={color} lineWidth={1} />
      <Line points={makeCirclePoints(0, 0, cr)} color={color} lineWidth={1} />
      <mesh position={[0, y, 0]} rotation={[-Math.PI/2,0,0]}>
        <circleGeometry args={[0.08, 16]} />
        <meshBasicMaterial color={color} />
      </mesh>
      <Line points={[[-hw,y,-penH],[-hw+penW,y,-penH],[-hw+penW,y,penH],[-hw,y,penH]]} color={color} lineWidth={1} />
      <Line points={[[-hw,y,-goalH],[-hw+goalW,y,-goalH],[-hw+goalW,y,goalH],[-hw,y,goalH]]} color={color} lineWidth={1} />
      <Line points={[[hw,y,-penH],[hw-penW,y,-penH],[hw-penW,y,penH],[hw,y,penH]]} color={color} lineWidth={1} />
      <Line points={[[hw,y,-goalH],[hw-goalW,y,-goalH],[hw-goalW,y,goalH],[hw,y,goalH]]} color={color} lineWidth={1} />
      <Line points={[[-hw-0.3,y,-0.8],[-hw-0.3,y,0.8]]} color={color} lineWidth={2} />
      <Line points={[[hw+0.3,y,-0.8],[hw+0.3,y,0.8]]} color={color} lineWidth={2} />
    </group>
  );
}

function HandballLines({ hw = HW, hh = HH }) {
  const color = '#ff6b35';
  const y = 0.03;
  const arcR6 = Math.min(2.4, hw * 0.34);
  const arcR9 = Math.min(3.6, hw * 0.51);
  const cr = Math.min(1.2, hw * 0.17);
  return (
    <group>
      <Line points={[[-hw,y,-hh],[hw,y,-hh],[hw,y,hh],[-hw,y,hh],[-hw,y,-hh]]} color={color} lineWidth={1.5} />
      <Line points={[[0,y,-hh],[0,y,hh]]} color={color} lineWidth={1} />
      <Line points={makeCirclePoints(0, 0, cr)} color={color} lineWidth={1} />
      <Line points={makeArcPoints(-hw, 0, arcR6, -Math.PI/3, Math.PI/3)} color={color} lineWidth={1.2} />
      <Line points={makeArcPoints(hw, 0, arcR6, Math.PI*2/3, Math.PI*4/3)} color={color} lineWidth={1.2} />
      <Line points={makeArcPoints(-hw, 0, arcR9, -Math.PI/4, Math.PI/4)} color={color} lineWidth={0.8} dashed dashSize={0.2} gapSize={0.15} />
      <Line points={makeArcPoints(hw, 0, arcR9, Math.PI*3/4, Math.PI*5/4)} color={color} lineWidth={0.8} dashed dashSize={0.2} gapSize={0.15} />
      <Line points={[[-hw-0.3,y,-1.2],[-hw-0.3,y,1.2]]} color={color} lineWidth={2} />
      <Line points={[[hw+0.3,y,-1.2],[hw+0.3,y,1.2]]} color={color} lineWidth={2} />
    </group>
  );
}

function VolleyballLines({ hw = HW, hh = HH }) {
  const color = '#ffdd00';
  const y = 0.03;
  const atkDist = Math.min(2.5, hw * 0.36);
  return (
    <group>
      <Line points={[[-hw,y,-hh],[hw,y,-hh],[hw,y,hh],[-hw,y,hh],[-hw,y,-hh]]} color={color} lineWidth={1.5} />
      <Line points={[[0,y,-hh],[0,y,hh]]} color={color} lineWidth={2} />
      <Line points={[[-atkDist,y,-hh],[-atkDist,y,hh]]} color={color} lineWidth={1} dashed dashSize={0.3} gapSize={0.2} />
      <Line points={[[atkDist,y,-hh],[atkDist,y,hh]]} color={color} lineWidth={1} dashed dashSize={0.3} gapSize={0.2} />
      <Line points={[[-hw,y,-hh+0.5],[-hw+1,y,-hh+0.5]]} color={color} lineWidth={0.8} />
      <Line points={[[hw,y,-hh+0.5],[hw-1,y,-hh+0.5]]} color={color} lineWidth={0.8} />
      <Line points={[[-hw,y,hh-0.5],[-hw+1,y,hh-0.5]]} color={color} lineWidth={0.8} />
      <Line points={[[hw,y,hh-0.5],[hw-1,y,hh-0.5]]} color={color} lineWidth={0.8} />
    </group>
  );
}

function BasketballLines({ hw = HW, hh = HH }) {
  const color = '#f2a900';
  const y = 0.03;
  const keyW = Math.min(2.8, hw * 0.4);
  const keyH = Math.min(2.4, hh * 0.6);
  const arcR = Math.min(5.2, hw * 0.75);
  const cr = Math.min(1.2, hw * 0.17);

  return (
    <group>
      <Line points={[[-hw,y,-hh],[hw,y,-hh],[hw,y,hh],[-hw,y,hh],[-hw,y,-hh]]} color={color} lineWidth={1.5} />
      <Line points={[[0,y,-hh],[0,y,hh]]} color={color} lineWidth={1.5} />
      <Line points={makeCirclePoints(0, 0, cr)} color={color} lineWidth={1} />
      
      {/* Keys */}
      <Line points={[[-hw,y,-keyH],[-hw+keyW,y,-keyH],[-hw+keyW,y,keyH],[-hw,y,keyH]]} color={color} lineWidth={1} />
      <Line points={[[hw,y,-keyH],[hw-keyW,y,-keyH],[hw-keyW,y,keyH],[hw,y,keyH]]} color={color} lineWidth={1} />
      
      {/* Free throw circles */}
      <Line points={makeArcPoints(-hw+keyW, 0, keyH, -Math.PI/2, Math.PI/2)} color={color} lineWidth={1} />
      <Line points={makeArcPoints(hw-keyW, 0, keyH, Math.PI/2, Math.PI*1.5)} color={color} lineWidth={1} />

      {/* 3 Point Arcs */}
      <Line points={makeArcPoints(-hw+1.2, 0, arcR, -Math.PI/2, Math.PI/2)} color={color} lineWidth={1} />
      <Line points={makeArcPoints(hw-1.2, 0, arcR, Math.PI/2, Math.PI*1.5)} color={color} lineWidth={1} />
    </group>
  );
}

function renderSportLines(mode, hw, hh) {
  switch (mode) {
    case 'Football': return <FootballLines hw={hw} hh={hh} />;
    case 'Handball': return <HandballLines hw={hw} hh={hh} />;
    case 'Volleyball': return <VolleyballLines hw={hw} hh={hh} />;
    case 'Basketball': return <BasketballLines hw={hw} hh={hh} />;
    case 'Multi-purpose': return (
      <group>
        <FootballLines hw={hw} hh={hh} />
        <group position={[0, 0.001, 0]}><HandballLines hw={hw} hh={hh} /></group>
        <group position={[0, 0.002, 0]}><VolleyballLines hw={hw} hh={hh} /></group>
        <group position={[0, 0.003, 0]}><BasketballLines hw={hw} hh={hh} /></group>
      </group>
    );
    default: return <FootballLines hw={hw} hh={hh} />;
  }
}

function SplitDivider() {
  const y = 0.04;
  return (
    <group>
      <Line
        points={[[0, y, -HH - 0.3], [0, y, HH + 0.3]]}
        color="#ffffff"
        lineWidth={2.5}
      />
      <Line
        points={[[0, y, -HH - 0.3], [0, y, HH + 0.3]]}
        color="#00e5ff"
        lineWidth={1}
        dashed
        dashSize={0.3}
        gapSize={0.2}
      />
      {/* Split labels */}
      {[-2, 2].map((z, i) => (
        <mesh key={i} position={[0, 0.06, z]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.12, 16]} />
          <meshBasicMaterial color="#00e5ff" transparent opacity={0.4} />
        </mesh>
      ))}
    </group>
  );
}

function SplitDivider4() {
  const y = 0.04;
  return (
    <group>
      {/* Vertical divider */}
      <Line points={[[0, y, -HH - 0.3], [0, y, HH + 0.3]]} color="#ffffff" lineWidth={2.5} />
      <Line points={[[0, y, -HH - 0.3], [0, y, HH + 0.3]]} color="#00e5ff" lineWidth={1} dashed dashSize={0.3} gapSize={0.2} />
      
      {/* Horizontal divider */}
      <Line points={[[-HW - 0.3, y, 0], [HW + 0.3, y, 0]]} color="#ffffff" lineWidth={2.5} />
      <Line points={[[-HW - 0.3, y, 0], [HW + 0.3, y, 0]]} color="#00e5ff" lineWidth={1} dashed dashSize={0.3} gapSize={0.2} />

      {/* Center circle */}
      <mesh position={[0, 0.06, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.15, 16]} />
        <meshBasicMaterial color="#00e5ff" transparent opacity={0.6} />
      </mesh>
    </group>
  );
}

export default function CourtLines() {
  const court = useStore(s => s.court);

  if (court.layout === 4) {
    const qW = HW / 2 - 0.15;
    const qH = HH / 2 - 0.15;
    return (
      <group>
        <SplitDivider4 />
        {/* Top Left court (Q1) */}
        <group position={[-(HW / 2 + 0.1), 0, -(HH / 2 + 0.1)]}>
          {renderSportLines(court.q1Mode, qW, qH)}
        </group>
        {/* Top Right court (Q2) */}
        <group position={[(HW / 2 + 0.1), 0, -(HH / 2 + 0.1)]}>
          {renderSportLines(court.q2Mode, qW, qH)}
        </group>
        {/* Bottom Left court (Q3) */}
        <group position={[-(HW / 2 + 0.1), 0, (HH / 2 + 0.1)]}>
          {renderSportLines(court.q3Mode, qW, qH)}
        </group>
        {/* Bottom Right court (Q4) */}
        <group position={[(HW / 2 + 0.1), 0, (HH / 2 + 0.1)]}>
          {renderSportLines(court.q4Mode, qW, qH)}
        </group>
      </group>
    );
  }

  if (court.layout === 2) {
    const halfW = HW / 2 - 0.15;
    return (
      <group>
        <SplitDivider />
        {/* Left court */}
        <group position={[-(HW / 2 + 0.1), 0, 0]}>
          {renderSportLines(court.leftMode, halfW, HH)}
        </group>
        {/* Right court */}
        <group position={[(HW / 2 + 0.1), 0, 0]}>
          {renderSportLines(court.rightMode, halfW, HH)}
        </group>
      </group>
    );
  }

  return (
    <group>
      {renderSportLines(court.mode, HW, HH)}
    </group>
  );
}
