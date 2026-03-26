const FONT_FAMILIES = [
  'Arial',
  'Georgia',
  'Courier New',
  'Times New Roman',
  'Verdana',
  'Comic Sans MS',
  'Impact',
  'Trebuchet MS',
]

const FONT_SIZES = ['12px', '14px', '16px', '18px', '20px', '24px', '28px', '32px', '36px', '48px', '64px']

const COLOR_PRESETS = [
  '#000000', '#ffffff', '#ef4444', '#f97316',
  '#eab308', '#22c55e', '#3b82f6', '#8b5cf6',
  '#ec4899', '#06b6d4',
]

// Renders the top control bar with file, language, style, and edit actions.
function Toolbar({
  language, setLanguage,
  activeStyle, setActiveStyle,
  onDeleteChar, onDeleteWord, onClearAll, onUndo,
  onSearchReplace,
  onNew, onSave, onSaveAs, onOpen,
  currentUser, onLogout,
  hasDoc,
  canUndo,
}) {
  // Updates the active style by merging a new key-value pair into the current style object.
  function updateStyle(key, value) {
    setActiveStyle(prev => ({ ...prev, [key]: value }))
  }

  return (
    <div className="toolbar">

      {/* File operations */}
      <div className="tb-group">
        <span className="tb-label">File</span>
        <button className="tb-btn" onClick={onNew}>+ New</button>
        <button className="tb-btn" onClick={onSave} disabled={!hasDoc}>Save</button>
        <button className="tb-btn" onClick={onSaveAs} disabled={!hasDoc}>Save As</button>
        <button className="tb-btn" onClick={onOpen}>Open</button>
      </div>

      {/* Language toggle */}
      <div className="tb-group">
        <span className="tb-label">Lang</span>
        {[
          { key: 'english', label: 'english' },
          { key: 'hebrew', label: 'עברית' },
          { key: 'emojis', label: '😊' },
          { key:'numbers', label:'1 2 3'},
          { key:'kaomoji', label:'｡♥‿♥｡'}
        ].map(({ key, label }) => (
          <button
            key={key}
            className={`tb-btn ${language === key ? 'tb-btn-active' : ''}`}
            onClick={() => setLanguage(key)}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Font family */}
      <div className="tb-group">
        <span className="tb-label">Font</span>
        <select
          className="tb-select"
          value={activeStyle.fontFamily}
          onChange={e => updateStyle('fontFamily', e.target.value)}
          style={{ fontFamily: activeStyle.fontFamily }}
        >
          {FONT_FAMILIES.map(f => (
            <option key={f} value={f} style={{ fontFamily: f }}>{f}</option>
          ))}
        </select>
      </div>

      {/* Font size */}
      <div className="tb-group">
        <span className="tb-label">Size</span>
        <select
          className="tb-select tb-select-sm"
          value={activeStyle.fontSize}
          onChange={() => {}}
        >
          {FONT_SIZES.map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* Color presets + custom picker */}
      <div className="tb-group">
        <span className="tb-label">Color</span>
        <div className="color-row">
          {COLOR_PRESETS.map(c => (
            <button
              key={c}
              className={`color-dot ${activeStyle.color === c ? 'color-dot-active' : ''}`}
              style={{ background: c, border: c === '#ffffff' ? '1px solid #aaa' : undefined }}
              onClick={() => {}}
              title={c}
            />
          ))}
          <input
            type="color"
            className="color-picker"
            value={activeStyle.color}
            onChange={() => {}}
            title="Custom color"
          />
        </div>
      </div>

      {/* Edit actions */}
      <div className="tb-group">
        <span className="tb-label">Edit</span>
        <button className="tb-btn" onClick={onDeleteChar} disabled={!hasDoc}>⌫</button>
        <button className="tb-btn" onClick={onDeleteWord} disabled={!hasDoc}>Del Word</button>
        <button className="tb-btn" onClick={onClearAll} disabled={!hasDoc}>Clear All</button>
        <button className="tb-btn" onClick={onUndo} disabled={!canUndo}>↩ Undo</button>
        <button className="tb-btn" onClick={onSearchReplace} disabled={!hasDoc}>🔍 Replace</button>
      </div>

      {/* User info */}
      <div className="tb-group tb-user">
        <span>👤 {currentUser}</span>
        <button className="tb-btn" onClick={onLogout}>Logout</button>
      </div>
    </div>
  )
}

export default Toolbar
