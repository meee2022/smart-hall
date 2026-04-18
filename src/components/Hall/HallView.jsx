import useI18n from '../../hooks/useI18n';
import ArenaScene from '../../scenes/ArenaScene';

export default function HallView() {
  const { t } = useI18n();
  return (
    <div>
      <ArenaScene />
      <div style={{ display: 'flex', gap: '8px', marginTop: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#00ff88', display: 'inline-block' }} />
          {t('hall.legend.playing') || 'Playing'}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#00e5ff', display: 'inline-block' }} />
          {t('hall.legend.on') || 'On'}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#ffcc00', display: 'inline-block' }} />
          {t('hall.legend.paused') || 'Paused'}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#ff3b5c', display: 'inline-block' }} />
          {t('hall.legend.off') || 'Off'}
        </div>
      </div>
    </div>
  );
}
