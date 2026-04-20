export const LIGHTING_MODES = [
  {
    id: 'training',
    name: 'Training Mode',
    icon: '🏋️',
    color: '#007a8c', /* Dark Cyan */
    glow: 'rgba(0,122,140,0.2)',
    intensity: 85,
    ambientColor: '#007a8c',
    ledLines: true,
    description: 'Full brightness for focused training sessions'
  },
  {
    id: 'match',
    name: 'Match Mode',
    icon: '🏆',
    color: '#344054', /* Dark Gray/Slate instead of invisible white */
    glow: 'rgba(52,64,84,0.2)',
    intensity: 100,
    ambientColor: '#e8f4ff',
    ledLines: true,
    description: 'Maximum illumination for official matches'
  },
  {
    id: 'health',
    name: 'Health Awareness',
    icon: '💚',
    color: '#008a4b', /* Dark Green */
    glow: 'rgba(0,138,75,0.2)',
    intensity: 70,
    ambientColor: '#008a4b',
    ledLines: true,
    description: 'Soft green tones for wellness campaigns'
  },
  {
    id: 'safety',
    name: 'Safety Mode',
    icon: '⚠️',
    color: '#b87500', /* Dark Orange-Yellow */
    glow: 'rgba(184,117,0,0.2)',
    intensity: 90,
    ambientColor: '#b87500',
    ledLines: true,
    description: 'High visibility yellow for safety procedures'
  },
  {
    id: 'presentation',
    name: 'Presentation Mode',
    icon: '🎤',
    color: '#7e22ce', /* Dark Purple */
    glow: 'rgba(126,34,206,0.2)',
    intensity: 60,
    ambientColor: '#7e22ce',
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
