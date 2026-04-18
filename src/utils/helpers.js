export function getStatusType(status) {
  const map = {
    on:        'info',
    off:       'warning',
    playing:   'success',
    paused:    'warning',
    emergency: 'danger',
    standby:   'info',
    grouped:   'info'
  };
  return map[status] || 'info';
}

export function getStatusIcon(status) {
  const map = {
    on:        '⚡',
    off:       '⏹️',
    playing:   '▶️',
    paused:    '⏸️',
    emergency: '🚨',
    standby:   '💤',
    grouped:   '🔗'
  };
  return map[status] || '📺';
}

export function formatUptime(ms) {
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  const h = Math.floor(m / 60);
  if (h > 0) return `${h}h ${m % 60}m`;
  if (m > 0) return `${m}m ${s % 60}s`;
  return `${s}s`;
}

export function formatTime(ts) {
  return new Date(ts).toLocaleTimeString('en-GB', {
    hour:   '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
}

export function estimatePower(screens, lighting) {
  const screenPower = screens.filter(s => s.status !== 'off').length * 180;
  const lightPower  = Math.round((lighting.intensity / 100) * 2400);
  return screenPower + lightPower;
}

export function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r},${g},${b}`;
}
