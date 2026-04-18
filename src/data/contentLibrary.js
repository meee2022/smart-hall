export const CONTENT_PREVIEWS = {
  'Welcome Screen':      { bg: 'linear-gradient(135deg,#0a1628,#0d2040)', icon: '🏟️', color: '#00e5ff' },
  'Healthy Habits':      { bg: 'linear-gradient(135deg,#0a1a12,#0d2818)', icon: '💪', color: '#00ff88' },
  'Warm-up Routine':     { bg: 'linear-gradient(135deg,#1a0e0a,#2a1500)', icon: '🔥', color: '#ff6b35' },
  'Safety Instructions': { bg: 'linear-gradient(135deg,#1a1500,#2a2000)', icon: '🦺', color: '#ffcc00' },
  'Hydration Tips':      { bg: 'linear-gradient(135deg,#0a1428,#0a1e3a)', icon: '💧', color: '#00e5ff' },
  'Nutrition Guide':     { bg: 'linear-gradient(135deg,#0a1810,#102210)', icon: '🍎', color: '#00ff88' },
  'Mental Wellness':     { bg: 'linear-gradient(135deg,#180a28,#220e3a)', icon: '🧠', color: '#a855f7' },
  'Football Drill':      { bg: 'linear-gradient(135deg,#0a1020,#0d1830)', icon: '⚽', color: '#00e5ff' },
  'Volleyball Basics':   { bg: 'linear-gradient(135deg,#1a1500,#2a2000)', icon: '🏐', color: '#ffdd00' },
  'Rules of Football':   { bg: 'linear-gradient(135deg,#0a1020,#0a1a30)', icon: '📋', color: '#a855f7' },
  'Handball Techniques': { bg: 'linear-gradient(135deg,#1a1000,#281800)', icon: '🤾', color: '#ff6b35' },
  'Match Countdown':     { bg: 'linear-gradient(135deg,#1a0a0a,#280e0e)', icon: '⏱️', color: '#ff3b5c' },
  'EMERGENCY GUIDANCE':  { bg: 'linear-gradient(135deg,#200808,#300808)', icon: '🚨', color: '#ff3b5c' },
  'default':             { bg: 'linear-gradient(135deg,#0a1020,#0d1630)', icon: '📺', color: '#7a9bb5' }
};

export const ContentLibrary = {
  categories: [
    {
      id: 'welcome', name: 'Welcome & Branding', icon: '🏆', color: '#00e5ff',
      items: [
        { id: 'wc1', name: 'Welcome Screen',    icon: '🏟️', duration: 'Loop', type: 'welcome' },
        { id: 'wc2', name: 'Hall Introduction', icon: '🎯', duration: '2:30', type: 'welcome' },
        { id: 'wc3', name: 'Sponsor Showcase',  icon: '⭐', duration: 'Loop', type: 'welcome' }
      ]
    },
    {
      id: 'health', name: 'Health & Awareness', icon: '💪', color: '#00ff88',
      items: [
        { id: 'h1', name: 'Healthy Habits',  icon: '🥗', duration: '4:15', type: 'health' },
        { id: 'h2', name: 'Hydration Tips',  icon: '💧', duration: '2:00', type: 'health' },
        { id: 'h3', name: 'Nutrition Guide', icon: '🍎', duration: '3:45', type: 'health' },
        { id: 'h4', name: 'Mental Wellness', icon: '🧠', duration: '5:00', type: 'health' }
      ]
    },
    {
      id: 'training', name: 'Training Media', icon: '🏃', color: '#ff6b35',
      items: [
        { id: 't1', name: 'Warm-up Routine',  icon: '🔥', duration: '8:00',  type: 'training' },
        { id: 't2', name: 'Football Drill',   icon: '⚽', duration: '6:30',  type: 'training' },
        { id: 't3', name: 'Volleyball Basics',icon: '🏐', duration: '7:20',  type: 'training' },
        { id: 't4', name: 'Strength Circuit', icon: '💪', duration: '12:00', type: 'training' }
      ]
    },
    {
      id: 'educational', name: 'Educational', icon: '📚', color: '#a855f7',
      items: [
        { id: 'e1', name: 'Rules of Football',   icon: '📋', duration: '5:45', type: 'educational' },
        { id: 'e2', name: 'Handball Techniques', icon: '🤾', duration: '4:30', type: 'educational' },
        { id: 'e3', name: 'Fair Play Guide',     icon: '🤝', duration: '3:00', type: 'educational' },
        { id: 'e4', name: 'Referee Signals',     icon: '🚩', duration: '4:00', type: 'educational' }
      ]
    },
    {
      id: 'safety', name: 'Safety Instructions', icon: '⚠️', color: '#ffcc00',
      items: [
        { id: 's1', name: 'Safety Instructions', icon: '🦺', duration: 'Loop', type: 'safety' },
        { id: 's2', name: 'Emergency Exits',     icon: '🚪', duration: 'Loop', type: 'safety' },
        { id: 's3', name: 'First Aid Guide',     icon: '🩺', duration: '3:20', type: 'safety' }
      ]
    },
    {
      id: 'matchday', name: 'Match Day', icon: '🏆', color: '#ff3b5c',
      items: [
        { id: 'm1', name: 'Match Countdown', icon: '⏱️', duration: 'Live', type: 'matchday' },
        { id: 'm2', name: 'Team Lineup',     icon: '📊', duration: '5:00', type: 'matchday' },
        { id: 'm3', name: 'Halftime Show',   icon: '🎤', duration: '8:00', type: 'matchday' },
        { id: 'm4', name: 'Live Scoreboard', icon: '📺', duration: 'Live', type: 'matchday' }
      ]
    },
    {
      id: 'ads', name: 'Sponsor Ads', icon: '📣', color: '#7a9bb5',
      items: [
        { id: 'a1', name: 'Partner Ad — Alpha', icon: '🏢', duration: '0:30', type: 'ads' },
        { id: 'a2', name: 'Partner Ad — Beta',  icon: '🏪', duration: '0:30', type: 'ads' },
        { id: 'a3', name: 'Community Notice',   icon: '📢', duration: '1:00', type: 'ads' }
      ]
    }
  ],

  getItemById(id) {
    for (const cat of this.categories) {
      const item = cat.items.find(i => i.id === id);
      if (item) return { ...item, category: cat.name, categoryColor: cat.color };
    }
    return null;
  }
};
