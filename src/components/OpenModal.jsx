// Modal dialog that lists all saved files for the current user and allows opening one.
function OpenModal({ files, onOpen, onClose }) {
  return (
    // Clicking the overlay dismisses the modal.
    <div className="modal-overlay" onClick={onClose}>
      {/* Stops click propagation so clicking inside the modal doesn't close it. */}
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h3>Open File</h3>
        {/* Shows an empty-state message when the user has no saved files. */}
        {files.length === 0 ? (
          <p className="modal-empty">No saved files found for your account.</p>
        ) : (
          // Renders each saved file as a clickable list item.
          <ul className="file-list">
            {files.map(file => (
              <li key={file.key}>
                {/* Clicking a file row loads it into the editor. */}
                <button onClick={() => onOpen(file.name, file.chars)}>
                  <span className="file-icon">📄</span>
                  <span className="file-name">{file.name}</span>
                  {/* Displays the character count as a secondary detail. */}
                  <span className="file-chars">{file.chars.length} chars</span>
                </button>
              </li>
            ))}
          </ul>
        )}
        <div className="modal-actions">
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  )
}

export default OpenModal
