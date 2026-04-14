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
  onDeleteWord, onClearAll, onUndo,
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

      {/* File operations: create, save, save-as, and open documents. */}
      <div className="tb-group">
        <span className="tb-label">File</span>
        <button className="tb-btn" onClick={onNew}>+ New</button>
        {/* Save and Save As are disabled when no document is open. */}
        <button className="tb-btn" onClick={onSave} disabled={!hasDoc}>Save</button>
        <button className="tb-btn" onClick={onSaveAs} disabled={!hasDoc}>Save As</button>
        <button className="tb-btn" onClick={onOpen}>Open</button>
      </div>

      {/* Language toggle: switches the virtual keyboard layout. Active layout is highlighted. */}
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

      {/* Font family selector: previews each font in its own typeface. */}
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

      {/* Font size selector. */}
      <div className="tb-group">
        <span className="tb-label">Size</span>
        <select
          className="tb-select tb-select-sm"
          value={activeStyle.fontSize}
          onChange={e => updateStyle('fontSize', e.target.value)}
        >
          {FONT_SIZES.map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* Color presets row plus a native color picker for custom colors. */}
      <div className="tb-group">
        <span className="tb-label">Color</span>
        <div className="color-row">
          {COLOR_PRESETS.map(c => (
            // White preset gets a visible border so it's distinguishable from the background.
            <button
              key={c}
              className={`color-dot ${activeStyle.color === c ? 'color-dot-active' : ''}`}
              style={{ background: c, border: c === '#ffffff' ? '1px solid #aaa' : undefined }}
              onClick={() => updateStyle('color', c)}
              title={c}
            />
          ))}
          {/* Hidden native color input triggered by clicking the preview swatch. */}
          <label className="color-picker-wrapper">
            <span
              className="color-preview"
              style={{ background: activeStyle.color }}
            />
            <input
              type="color"
              value={activeStyle.color}
              onChange={e => updateStyle('color', e.target.value)}
            />
          </label>
        </div>
      </div>

      {/* Edit actions: destructive operations and search-replace. Disabled when no doc is open. */}
      <div className="tb-group">
        <span className="tb-label">Edit</span>
        <button className="tb-btn" onClick={onDeleteWord} disabled={!hasDoc}>Del Word</button>
        <button className="tb-btn" onClick={onClearAll} disabled={!hasDoc}>Clear All</button>
        {/* Undo is additionally disabled when there is no history to revert to. */}
        <button className="tb-btn" onClick={onUndo} disabled={!canUndo}>↩ Undo</button>
        <button className="tb-btn" onClick={onSearchReplace} disabled={!hasDoc}>🔍Search or Replace</button>
      </div>

      {/* User info section: avatar, username, and logout — pushed to the far right via margin-left: auto. */}
      <div className="tb-group tb-user">
        <div className="user-box">
          {/* Avatar shows the first letter of the username as a coloured circle. */}
          <div className="avatar">
            {currentUser?.[0]?.toUpperCase()}
          </div>
          <span>{currentUser}</span>
        </div>
        <button className="tb-btn" onClick={onLogout}>Logout</button>
      </div>
    </div>
  )
}

export default Toolbar