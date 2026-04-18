export const SCENARIOS = [
  {
    id: 'training',
    name: 'Training Session',
    emoji: '🏋️',
    color: '#00e5ff',
    glow: 'rgba(0,229,255,0.25)',
    description: 'Full training setup with warm-up content on all screens and optimal lighting',
    courtMode: 'Multi-purpose',
    lightingMode: 'Training Mode',
    lightColor: '#00e5ff',
    lightIntensity: 85,
    screenAssignments: [
      { screenId: 1, contentId: 't1' },
      { screenId: 2, contentId: 'h2' },
      { screenId: 3, contentId: 't4' },
      { screenId: 4, contentId: 'h1' }
    ],
    tags: ['Training', 'Full Hall', 'Multi-sport']
  },
  {
    id: 'kids',
    name: 'Kids Class',
    emoji: '🧒',
    color: '#00ff88',
    glow: 'rgba(0,255,136,0.25)',
    description: 'Fun and safe environment for children classes with educational content',
    courtMode: 'Volleyball',
    lightingMode: 'Health Awareness',
    lightColor: '#00ff88',
    lightIntensity: 75,
    screenAssignments: [
      { screenId: 1, contentId: 'e3' },
      { screenId: 2, contentId: 'e1' },
      { screenId: 3, contentId: 't3' },
      { screenId: 4, contentId: 's1' }
    ],
    tags: ['Kids', 'Educational', 'Volleyball']
  },
  {
    id: 'match',
    name: 'Match Preparation',
    emoji: '⚽',
    color: '#ff6b35',
    glow: 'rgba(255,107,53,0.25)',
    description: 'Football match setup with countdown, team lineup, and max lighting',
    courtMode: 'Football',
    lightingMode: 'Match Mode',
    lightColor: '#ffffff',
    lightIntensity: 100,
    screenAssignments: [
      { screenId: 1, contentId: 'm1' },
      { screenId: 2, contentId: 'm2' },
      { screenId: 3, contentId: 't2' },
      { screenId: 4, contentId: 'm4' }
    ],
    tags: ['Football', 'Match Day', 'High Intensity']
  },
  {
    id: 'health',
    name: 'Health Awareness',
    emoji: '💚',
    color: '#00ff88',
    glow: 'rgba(0,255,136,0.25)',
    description: 'Health campaign with wellness content across all displays',
    courtMode: 'Multi-purpose',
    lightingMode: 'Health Awareness',
    lightColor: '#00ff88',
    lightIntensity: 70,
    screenAssignments: [
      { screenId: 1, contentId: 'h1' },
      { screenId: 2, contentId: 'h2' },
      { screenId: 3, contentId: 'h3' },
      { screenId: 4, contentId: 'h4' }
    ],
    tags: ['Health', 'Awareness', 'Campaign']
  },
  {
    id: 'school',
    name: 'School Event',
    emoji: '🏫',
    color: '#a855f7',
    glow: 'rgba(168,85,247,0.25)',
    description: 'Educational event with multi-sport setup and presentation lighting',
    courtMode: 'Multi-purpose',
    lightingMode: 'Presentation Mode',
    lightColor: '#a855f7',
    lightIntensity: 60,
    screenAssignments: [
      { screenId: 1, contentId: 'wc2' },
      { screenId: 2, contentId: 'e1' },
      { screenId: 3, contentId: 'e2' },
      { screenId: 4, contentId: 'e3' }
    ],
    tags: ['School', 'Educational', 'Event']
  },
  {
    id: 'emergency',
    name: 'Emergency Guidance',
    emoji: '🚨',
    color: '#ff3b5c',
    glow: 'rgba(255,59,92,0.3)',
    description: 'Emergency protocol — all screens show safety instructions immediately',
    courtMode: 'Multi-purpose',
    lightingMode: 'Safety Mode',
    lightColor: '#ffcc00',
    lightIntensity: 100,
    screenAssignments: [
      { screenId: 1, contentId: 's2' },
      { screenId: 2, contentId: 's1' },
      { screenId: 3, contentId: 's3' },
      { screenId: 4, contentId: 's2' }
    ],
    tags: ['Emergency', 'Safety', 'Priority']
  },
  {
    id: 'demo',
    name: 'Full Demo Mode',
    emoji: '✨',
    color: '#00e5ff',
    glow: 'rgba(0,229,255,0.3)',
    description: 'System showcase — displays all features for presentations and demos',
    courtMode: 'Multi-purpose',
    lightingMode: 'Presentation Mode',
    lightColor: '#a855f7',
    lightIntensity: 80,
    screenAssignments: [
      { screenId: 1, contentId: 'wc1' },
      { screenId: 2, contentId: 'm1' },
      { screenId: 3, contentId: 't1' },
      { screenId: 4, contentId: 'h1' }
    ],
    tags: ['Demo', 'Showcase', 'Full System']
  }
];
