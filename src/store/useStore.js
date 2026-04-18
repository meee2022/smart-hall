import { create } from 'zustand';
import { ContentLibrary } from '../data/contentLibrary';

const useStore = create((set, get) => ({
  // ── UI State ──
  lang: 'en',
  theme: 'dark',
  activeSection: 'overview',
  selectedScreenId: null,

  // ── Screen Preview ──
  screenPreview: { active: false, screenId: null, content: null, contentIcon: null, duration: 3000 },
  system: {
    online: true,
    startTime: Date.now(),
    lastUpdated: Date.now(),
    version: '2.1.0'
  },

  // ── Screens ──
  screens: [
    { id: 1, name: 'North Display 1', shortName: 'N1', status: 'playing', content: 'Welcome Screen', contentIcon: '🏆', group: null, position: 'north-left' },
    { id: 2, name: 'North Display 2', shortName: 'N2', status: 'playing', content: 'Healthy Habits', contentIcon: '💪', group: null, position: 'north-right' },
    { id: 3, name: 'South Display 1',  shortName: 'S1', status: 'paused',  content: 'Warm-up Routine', contentIcon: '🏃', group: null, position: 'south-left' },
    { id: 4, name: 'South Display 2',  shortName: 'S2', status: 'off',     content: null, contentIcon: null, group: null, position: 'south-right' }
  ],

  // ── Lighting ──
  lighting: {
    mode: 'Training Mode',
    intensity: 75,
    color: '#00e5ff',
    ledLines: true,
    ambient: true
  },

  // ── Court ──
  court: { mode: 'Multi-purpose', split: false, leftMode: 'Football', rightMode: 'Football' },

  // ── Scenario ──
  scenario: { active: null, activating: false },

  // ── Log ──
  log: [],

  // ── Toasts ──
  toasts: [],

  // ── Modal ──
  modal: { open: false, content: null },

  // ── Broadcast Display ──
  broadcast: { active: false, type: null, title: '', subtitle: '', icon: '', color: '#00e5ff', image: null, duration: 5000 },

  // ── Actions ──

  setLang: (lang) => set({ lang }),
  setTheme: (theme) => set({ theme }),
  setActiveSection: (section) => set({ activeSection: section }),
  setSelectedScreenId: (id) => set({ selectedScreenId: id }),

  showScreenPreview: (screenId, content, contentIcon, duration = 3000) => set({
    screenPreview: { active: true, screenId, content, contentIcon, duration }
  }),
  closeScreenPreview: () => set(state => ({
    screenPreview: { ...state.screenPreview, active: false }
  })),

  setScreenStatus: (id, status) => set(state => {
    const screens = state.screens.map(s => {
      if (s.id !== id) return s;
      const updated = { ...s, status };
      if (status === 'off') {
        updated.content = null;
        updated.contentIcon = null;
        updated.group = null;
      }
      return updated;
    });
    return { screens, system: { ...state.system, lastUpdated: Date.now() } };
  }),

  setScreenContent: (screenId, contentId) => set(state => {
    const item = ContentLibrary.getItemById(contentId);
    if (!item) return {};
    const screens = state.screens.map(s => {
      if (s.id !== screenId) return s;
      return {
        ...s,
        content: item.name,
        contentIcon: item.icon,
        status: s.status === 'off'
          ? 'playing'
          : s.status === 'emergency'
            ? s.status
            : 'playing'
      };
    });
    get().showScreenPreview(screenId, item.name, item.icon);
    return { screens, system: { ...state.system, lastUpdated: Date.now() } };
  }),

  setAllScreensContent: (contentId) => set(state => {
    const item = ContentLibrary.getItemById(contentId);
    if (!item) return {};
    const screens = state.screens.map(s => ({
      ...s,
      content: item.name,
      contentIcon: item.icon,
      status: s.status === 'off' ? 'playing' : s.status
    }));
    get().showScreenPreview('All', item.name, item.icon);
    return { screens, system: { ...state.system, lastUpdated: Date.now() } };
  }),

  powerAll: () => set(state => ({
    screens: state.screens.map(s => ({
      ...s,
      status: 'on',
      content: s.content || 'Welcome Screen',
      contentIcon: s.contentIcon || '🏆'
    })),
    system: { ...state.system, lastUpdated: Date.now() }
  })),

  stopAll: () => set(state => ({
    screens: state.screens.map(s => ({
      ...s, status: 'off', content: null, contentIcon: null, group: null
    })),
    system: { ...state.system, lastUpdated: Date.now() }
  })),

  syncScreens: () => set(state => {
    const first = state.screens.find(s => s.status !== 'off' && s.content);
    if (!first) return {};
    return {
      screens: state.screens.map(s =>
        s.status === 'off'
          ? s
          : { ...s, content: first.content, contentIcon: first.contentIcon, status: 'playing', group: 'sync' }
      ),
      system: { ...state.system, lastUpdated: Date.now() }
    };
  }),

  emergencyMode: () => set(state => ({
    screens: state.screens.map(s => ({
      ...s, status: 'emergency', content: 'EMERGENCY GUIDANCE', contentIcon: '🚨', group: 'emergency'
    })),
    lighting: { ...state.lighting, mode: 'Safety Mode', color: '#ff3b5c' },
    system: { ...state.system, lastUpdated: Date.now() }
  })),

  clearEmergency: () => set(state => ({
    screens: state.screens.map(s =>
      s.status === 'emergency'
        ? { ...s, status: 'on', content: 'Welcome Screen', contentIcon: '🏆', group: null }
        : s
    ),
    system: { ...state.system, lastUpdated: Date.now() }
  })),

  setLightingMode: (mode, color, intensity) => set(state => ({
    lighting: {
      ...state.lighting,
      mode,
      color: color || state.lighting.color,
      intensity: intensity || state.lighting.intensity
    },
    system: { ...state.system, lastUpdated: Date.now() }
  })),

  setLightingIntensity: (value) => set(state => ({
    lighting: { ...state.lighting, intensity: value }
  })),

  setLightingColor: (color) => set(state => ({
    lighting: { ...state.lighting, color },
    system: { ...state.system, lastUpdated: Date.now() }
  })),

  toggleLedLines: () => set(state => ({
    lighting: { ...state.lighting, ledLines: !state.lighting.ledLines }
  })),

  setCourtMode: (mode) => set(state => ({
    court: { ...state.court, mode, split: false },
    system: { ...state.system, lastUpdated: Date.now() }
  })),

  setCourtSplit: (split) => set(state => ({
    court: { ...state.court, split },
    system: { ...state.system, lastUpdated: Date.now() }
  })),

  setCourtSplitModes: (leftMode, rightMode) => set(state => ({
    court: { ...state.court, split: true, leftMode, rightMode },
    system: { ...state.system, lastUpdated: Date.now() }
  })),

  setScenarioActive: (name) => set({ scenario: { active: name, activating: false } }),
  setScenarioActivating: (val) => set(state => ({ scenario: { ...state.scenario, activating: val } })),
  clearScenario: () => set({ scenario: { active: null, activating: false } }),

  addLog: (message, type = 'info', icon = '📋') => set(state => {
    const entry = {
      id: Date.now() + Math.random(),
      timestamp: Date.now(),
      message,
      type,
      icon
    };
    const log = [entry, ...state.log].slice(0, 50);
    return { log };
  }),

  clearLog: () => set({ log: [] }),

  addToast: (title, message, type = 'info') => set(state => {
    const id = Date.now() + Math.random();
    const toasts = [...state.toasts, { id, title, message, type }].slice(-3);
    return { toasts };
  }),

  removeToast: (id) => set(state => ({
    toasts: state.toasts.filter(t => t.id !== id)
  })),

  openModal: (content) => set({ modal: { open: true, content } }),
  closeModal: () => set({ modal: { open: false, content: null } }),

  // ── Broadcast ──
  showBroadcast: (data) => set({
    broadcast: { active: true, ...data }
  }),
  closeBroadcast: () => set({
    broadcast: { active: false, type: null, title: '', subtitle: '', icon: '', color: '#00e5ff', image: null, duration: 5000 }
  }),

  // ── Selectors / Computed ──

  getActiveScreenCount: () =>
    get().screens.filter(s => s.status !== 'off').length,

  isSynced: () => {
    const active = get().screens.filter(s => s.status !== 'off');
    if (active.length < 2) return false;
    return active.every(s => s.content === active[0].content);
  },

  estimatePower: () => {
    const s = get();
    const screenPower = s.screens.filter(sc => sc.status !== 'off').length * 180;
    const lightPower  = Math.round((s.lighting.intensity / 100) * 2400);
    return screenPower + lightPower;
  }
}));

export default useStore;
