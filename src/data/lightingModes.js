export const LIGHTING_MODES = [
  {
    id: 'training',
    name: 'Training Mode',
    icon: '🏋️',
    color: '#00e5ff',
    glow: 'rgba(0,229,255,0.3)',
    intensity: 85,
    ambientColor: '#00e5ff',
    ledLines: true,
    description: 'Full brightness for focused training sessions'
  },
  {
    id: 'match',
    name: 'Match Mode',
    icon: '🏆',
    color: '#ffffff',
    glow: 'rgba(255,255,255,0.2)',
    intensity: 100,
    ambientColor: '#e8f4ff',
    ledLines: true,
    description: 'Maximum illumination for official matches'
  },
  {
    id: 'health',
    name: 'Health Awareness',
    icon: '💚',
    color: '#00ff88',
    glow: 'rgba(0,255,136,0.3)',
    intensity: 70,
    ambientColor: '#00ff88',
    ledLines: true,
    description: 'Soft green tones for wellness campaigns'
  },
  {
    id: 'safety',
    name: 'Safety Mode',
    icon: '⚠️',
    color: '#ffcc00',
    glow: 'rgba(255,204,0,0.3)',
    intensity: 90,
    ambientColor: '#ffcc00',
    ledLines: true,
    description: 'High visibility yellow for safety procedures'
  },
  {
    id: 'presentation',
    name: 'Presentation Mode',
    icon: '🎤',
    color: '#a855f7',
    glow: 'rgba(168,85,247,0.3)',
    intensity: 60,
    ambientColor: '#a855f7',
    ledLines: false,
    description: 'Stage-like atmosphere for events & demos'
  },
  {
    id: 'energy',
    name: 'Energy Saving',
    icon: '🌙',
    color: '#3a5570',
    glow: 'rgba(58,85,112,0.2)',
    intensity: 30,
    ambientColor: '#1a2a40',
    ledLines: false,
    description: 'Minimal lighting to conserve energy'
  }
];
