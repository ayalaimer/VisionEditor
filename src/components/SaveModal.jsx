import { useState } from 'react'

function SaveModal({ currentName, onSave, onClose }) {
  const [filename, setFilename] = useState(currentName || '')

  function handleSubmit(e) {
    e.preventDefault()
    const name = filename.trim()
    if (name) onSave(name)
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h3>Save As</h3>
        <form onSubmit={handleSubmit}>
          <label>
            Filename:
            <input
              type="text"
              value={filename}
              onChange={e => setFilename(e.target.value)}
              placeholder="Enter a filename…"
              autoFocus
              maxLength={64}
            />
          </label>
          <div className="modal-actions">
            <button type="submit" disabled={!filename.trim()}>Save</button>
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default SaveModal
