function OpenModal({ files, onOpen, onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h3>Open File</h3>
        {files.length === 0 ? (
          <p className="modal-empty">No saved files found for your account.</p>
        ) : (
          <ul className="file-list">
            {files.map(file => (
              <li key={file.key}>
                <button onClick={() => onOpen(file.name, file.chars)}>
                  <span className="file-icon">📄</span>
                  <span className="file-name">{file.name}</span>
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
