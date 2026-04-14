// Displays the tab header for a document, showing its name and a close button.
// Applies the active style when this document is currently focused.
function DocumentTab({ doc, isFocused, onClose }) {
  return (
    <div className={`document-tab ${isFocused ? 'tab-active' : ''}`}>
      {/* Document name truncated with ellipsis if too long; full name shown in tooltip. */}
      <span className="tab-name" title={doc.name}>
        {doc.name}
      </span>
      {/* Close button stops click propagation so it doesn't trigger document focus. */}
      <button className="tab-close-btn" onClick={onClose} title="Close document">
        ×
      </button>
    </div>
  )
}

export default DocumentTab
