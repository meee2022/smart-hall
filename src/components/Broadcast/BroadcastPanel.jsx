import { useState } from 'react';
import useStore from '../../store/useStore';
import { useI18n } from '../../hooks/useI18n';
import { ContentLibrary } from '../../data/contentLibrary';

const PRESET_BROADCASTS = [
  {
    id: 'best-student',
    type: 'student',
    icon: '🏅',
    color: '#ffdd00',
    title: 'Best Student of the Week',
    titleAr: 'أفضل طالب في الأسبوع',
    subtitle: 'Congratulations for outstanding performance!',
    subtitleAr: 'تهانينا على الأداء المتميز!',
    image: true,
    duration: 8000,
  },
  {
    id: 'match-start',
    type: 'event',
    icon: '⚽',
    color: '#00e5ff',
    title: 'Match Starting Soon',
    titleAr: 'المباراة تبدأ قريباً',
    subtitle: 'Players, please take your positions',
    subtitleAr: 'اللاعبون، يرجى أخذ أماكنكم',
    duration: 6000,
  },
  {
    id: 'health-campaign',
    type: 'announcement',
    icon: '💚',
    color: '#00ff88',
    title: 'Health Awareness Campaign',
    titleAr: 'حملة التوعية الصحية',
    subtitle: 'Watch the health tips on all screens now',
    subtitleAr: 'شاهدوا النصائح الصحية على جميع الشاشات الآن',
    duration: 6000,
  },
  {
    id: 'emergency-alert',
    type: 'emergency',
    icon: '🚨',
    color: '#ff3b5c',
    title: 'Emergency Alert',
    titleAr: 'تنبيه طوارئ',
    subtitle: 'Please follow the safety instructions on screens',
    subtitleAr: 'يرجى اتباع تعليمات السلامة على الشاشات',
    duration: 10000,
  },
  {
    id: 'welcome',
    type: 'announcement',
    icon: '🏟️',
    color: '#a855f7',
    title: 'Welcome to Smart Arena',
    titleAr: 'أهلاً بكم في الساحة الذكية',
    subtitle: 'Your intelligent sports experience starts here',
    subtitleAr: 'تجربتكم الرياضية الذكية تبدأ من هنا',
    duration: 6000,
  },
  {
    id: 'break-time',
    type: 'announcement',
    icon: '☕',
    color: '#ff6b35',
    title: 'Break Time',
    titleAr: 'وقت الاستراحة',
    subtitle: 'Session will resume in 15 minutes',
    subtitleAr: 'ستستأنف الجلسة خلال 15 دقيقة',
    duration: 5000,
  },
];

export default function BroadcastPanel() {
  const { t, lang } = useI18n();
  const showBroadcast = useStore(s => s.showBroadcast);
  const addLog = useStore(s => s.addLog);
  const addToast = useStore(s => s.addToast);

  const [customTitle, setCustomTitle] = useState('');
  const [customSubtitle, setCustomSubtitle] = useState('');
  const [customIcon, setCustomIcon] = useState('📢');
  const [customColor, setCustomColor] = useState('#00e5ff');
  const [customType, setCustomType] = useState('announcement');
  const [customDuration, setCustomDuration] = useState(5);
  const [studentName, setStudentName] = useState('');

  const handlePreset = (preset) => {
    const title = lang === 'ar' ? preset.titleAr : preset.title;
    const subtitle = lang === 'ar' ? preset.subtitleAr : preset.subtitle;

    if (preset.id === 'best-student' && studentName.trim()) {
      showBroadcast({
        type: preset.type,
        icon: preset.icon,
        color: preset.color,
        title: studentName,
        subtitle: subtitle,
        image: preset.image,
        screens: 'all',
        duration: preset.duration,
      });
    } else {
      showBroadcast({
        type: preset.type,
        icon: preset.icon,
        color: preset.color,
        title: title,
        subtitle: subtitle,
        screens: 'all',
        duration: preset.duration,
      });
    }

    addLog(`Broadcast: ${preset.title}`, preset.type === 'emergency' ? 'danger' : 'success', '📡');
    addToast(lang === 'ar' ? 'بث مباشر' : 'Broadcast', title, preset.type === 'emergency' ? 'danger' : 'success');
  };

  const handleCustomBroadcast = () => {
    if (!customTitle.trim()) return;
    showBroadcast({
      type: customType,
      icon: customIcon,
      color: customColor,
      title: customTitle,
      subtitle: customSubtitle,
      screens: 'all',
      duration: customDuration * 1000,
    });
    addLog(`Custom broadcast: ${customTitle}`, 'success', '📡');
    addToast(lang === 'ar' ? 'بث مخصص' : 'Custom Broadcast', customTitle, 'success');
  };

  const handleContentBroadcast = (item) => {
    showBroadcast({
      type: 'content',
      icon: item.icon,
      color: '#00e5ff',
      title: t(item.name),
      subtitle: lang === 'ar' ? 'يتم عرضه الآن على جميع الشاشات' : 'Now playing on all screens',
      screens: 'all',
      duration: 5000,
    });
    addLog(`Content broadcast: ${item.name}`, 'info', '📺');
  };

  const isAr = lang === 'ar';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* Student of the Week */}
      <div className="card" style={{ borderColor: 'rgba(255,221,0,0.2)' }}>
        <div className="card-header">
          <div>
            <div className="card-title" style={{ color: '#ffdd00' }}>
              🏅 {isAr ? 'أفضل طالب' : 'Best Student Spotlight'}
            </div>
            <div className="card-subtitle">
              {isAr ? 'اعرض اسم الطالب المتميز على الشاشة الكبيرة' : 'Display the top student name on the big screen'}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <input
            type="text"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            placeholder={isAr ? 'اكتب اسم الطالب...' : 'Enter student name...'}
            style={{
              flex: 1,
              padding: '10px 14px',
              background: 'var(--bg-hover)',
              border: '1px solid var(--border-normal)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-body)',
              fontSize: '0.85rem',
              outline: 'none',
            }}
          />
          <button
            className="btn btn-warning btn-md"
            onClick={() => {
              if (!studentName.trim()) return;
              handlePreset(PRESET_BROADCASTS[0]);
            }}
            disabled={!studentName.trim()}
            style={{ opacity: studentName.trim() ? 1 : 0.4 }}
          >
            🏅 {isAr ? 'عرض' : 'Broadcast'}
          </button>
        </div>
      </div>

      {/* Preset Broadcasts */}
      <div>
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.65rem',
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          marginBottom: '12px',
        }}>
          {isAr ? 'بث سريع' : 'Quick Broadcasts'}
        </div>
        <div className="grid-3">
          {PRESET_BROADCASTS.slice(1).map(preset => (
            <button
              key={preset.id}
              className="scenario-btn"
              style={{ '--scenario-color': preset.color, '--scenario-glow': `${preset.color}40` }}
              onClick={() => handlePreset(preset)}
            >
              <div className="scenario-emoji">{preset.icon}</div>
              <div className="scenario-name" style={{ color: preset.color }}>
                {isAr ? preset.titleAr : preset.title}
              </div>
              <div className="scenario-desc">
                {isAr ? preset.subtitleAr : preset.subtitle}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Content Broadcast */}
      <div>
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.65rem',
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          marginBottom: '12px',
        }}>
          {isAr ? 'بث محتوى على الشاشات' : 'Broadcast Content to Screens'}
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {ContentLibrary.categories.slice(0, 4).flatMap(cat =>
            cat.items.slice(0, 2).map(item => (
              <button
                key={item.id}
                className="btn btn-ghost btn-sm"
                onClick={() => handleContentBroadcast(item)}
                style={{ fontSize: '0.72rem' }}
              >
                {item.icon} {t(item.name)}
              </button>
            ))
          )}
        </div>
      </div>

      {/* Custom Broadcast */}
      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">
              📡 {isAr ? 'بث مخصص' : 'Custom Broadcast'}
            </div>
            <div className="card-subtitle">
              {isAr ? 'أنشئ إعلان مخصص يظهر على الشاشة الكبيرة' : 'Create a custom announcement for the big screen'}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                {isAr ? 'العنوان' : 'Title'}
              </label>
              <input
                type="text"
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                placeholder={isAr ? 'العنوان الرئيسي...' : 'Main title...'}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                {isAr ? 'النص الفرعي' : 'Subtitle'}
              </label>
              <input
                type="text"
                value={customSubtitle}
                onChange={(e) => setCustomSubtitle(e.target.value)}
                placeholder={isAr ? 'نص فرعي اختياري...' : 'Optional subtitle...'}
                style={inputStyle}
              />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr 100px 80px', gap: '12px', alignItems: 'end' }}>
            <div>
              <label style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                {isAr ? 'أيقونة' : 'Icon'}
              </label>
              <input
                type="text"
                value={customIcon}
                onChange={(e) => setCustomIcon(e.target.value)}
                style={{ ...inputStyle, textAlign: 'center', fontSize: '1.2rem' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                {isAr ? 'النوع' : 'Type'}
              </label>
              <select
                value={customType}
                onChange={(e) => setCustomType(e.target.value)}
                style={{ ...inputStyle, cursor: 'pointer' }}
              >
                <option value="announcement">{isAr ? 'إعلان' : 'Announcement'}</option>
                <option value="content">{isAr ? 'محتوى' : 'Content'}</option>
                <option value="student">{isAr ? 'طالب' : 'Student'}</option>
                <option value="event">{isAr ? 'حدث' : 'Event'}</option>
                <option value="score">{isAr ? 'نتيجة' : 'Score'}</option>
                <option value="emergency">{isAr ? 'طوارئ' : 'Emergency'}</option>
                <option value="custom">{isAr ? 'مخصص' : 'Custom'}</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                {isAr ? 'اللون' : 'Color'}
              </label>
              <input
                type="color"
                value={customColor}
                onChange={(e) => setCustomColor(e.target.value)}
                style={{ width: '100%', height: '36px', border: '1px solid var(--border-normal)', borderRadius: 'var(--radius-sm)', background: 'var(--bg-hover)', cursor: 'pointer' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                {isAr ? 'ثواني' : 'Seconds'}
              </label>
              <input
                type="number"
                min="2"
                max="30"
                value={customDuration}
                onChange={(e) => setCustomDuration(parseInt(e.target.value) || 5)}
                style={{ ...inputStyle, textAlign: 'center' }}
              />
            </div>
          </div>
          <button
            className="btn btn-primary btn-lg"
            onClick={handleCustomBroadcast}
            disabled={!customTitle.trim()}
            style={{ alignSelf: 'flex-start', opacity: customTitle.trim() ? 1 : 0.4, marginTop: '4px' }}
          >
            📡 {isAr ? 'بث الآن' : 'Broadcast Now'}
          </button>
        </div>
      </div>
    </div>
  );
}

const inputStyle = {
  width: '100%',
  padding: '8px 12px',
  background: 'var(--bg-hover)',
  border: '1px solid var(--border-normal)',
  borderRadius: 'var(--radius-sm)',
  color: 'var(--text-primary)',
  fontFamily: 'var(--font-body)',
  fontSize: '0.8rem',
  outline: 'none',
};
