import { useState } from 'react'

// Modal dialog for saving a document under a user-specified filename.
// Pre-fills the input with the document's existing name when available.
function SaveModal({ currentName, onSave, onClose }) {
  // current value of the filename input, initialized from the existing document name.
  const [filename, setFilename] = useState(currentName || '')

  // Trims whitespace and triggers the save callback with the cleaned filename.
  function handleSubmit(e) {
    e.preventDefault()
    const name = filename.trim()
    if (name) onSave(name)
  }

  return (
    // Clicking the overlay dismisses the modal.
    <div className="modal-overlay" onClick={onClose}>
      {/* Stops click propagation so clicking inside the modal doesn't close it. */}
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h3>Save As</h3>
        <form onSubmit={handleSubmit}>
          <label>
            Filename:
            {/* Auto-focused input so the user can type immediately. */}
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
            {/* Save is disabled until the user has entered a non-empty filename. */}
            <button type="submit" disabled={!filename.trim()}>Save</button>
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default SaveModal
