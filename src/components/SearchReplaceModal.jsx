import { useState } from 'react'

// Modal dialog for finding and replacing text in the current document.
function SearchReplaceModal({ onFind, onReplace, onClose }) {
  const [searchStr, setSearchStr] = useState('')
  const [replaceStr, setReplaceStr] = useState('')
  const [feedback, setFeedback] = useState('')

  function handleFind() {
    onFind(searchStr)
  }

  // Triggers the search and replace operation when the form is submitted.
  function handleSubmit(e) {
    e.preventDefault()
    onReplace(searchStr, replaceStr)
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h3>Search &amp; Replace</h3>
        <form onSubmit={handleSubmit}>
          <label>
            Find:
            <input
              type="text"
              value={searchStr}
              onChange={e => { setSearchStr(e.target.value); setFeedback('') }}
              placeholder="Text to find…"
              autoFocus
            />
          </label>
          <label>
            Replace with:
            <input
              type="text"
              value={replaceStr}
              onChange={e => setReplaceStr(e.target.value)}
              placeholder="Replacement (leave empty to delete)"
            />
          </label>
          {feedback && <p className="modal-feedback">{feedback}</p>}
          <div className="modal-actions">
            <button type="button" onClick={handleFind} disabled={!searchStr}>Find</button>
            <button type="submit" disabled={!searchStr}>Replace</button>
            <button type="button" className="btn-secondary" onClick={onClose}>Close</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default SearchReplaceModal
