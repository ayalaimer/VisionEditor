import { useState } from 'react'

// Modal dialog for finding and replacing text in the current document.
function SearchReplaceModal({ onFind, onReplace, onClose }) {
  // the text the user wants to search for.
  const [searchStr, setSearchStr] = useState('')
  // the text that will replace the found occurrence.
  const [replaceStr, setReplaceStr] = useState('')
  // optional status message shown after a find or replace action.
  const [feedback, setFeedback] = useState('')

  // Highlights all occurrences of the search string in the active document.
  function handleFind() {
    onFind(searchStr)
  }

  // Triggers the search and replace operation when the form is submitted.
  function handleSubmit(e) {
    e.preventDefault()
    onReplace(searchStr, replaceStr)
  }

  return (
    // Clicking the overlay dismisses the modal.
    <div className="modal-overlay" onClick={onClose}>
      {/* Stops click propagation so clicking inside the modal doesn't close it. */}
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h3>Search &amp; Replace</h3>
        <form onSubmit={handleSubmit}>
          <label>
            Find:
            {/* Clearing the search string also clears any existing feedback message. */}
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
          {/* Feedback message is only rendered when there is something to show. */}
          {feedback && <p className="modal-feedback">{feedback}</p>}
          <div className="modal-actions">
            {/* Find and Replace buttons are disabled until the user has typed a search term. */}
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
