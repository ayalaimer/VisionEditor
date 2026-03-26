// Displays the tab header for a document, showing its name and a close button.
function DocumentTab({ doc, isFocused, onClose }) {
  return (
    <div className={`document-tab ${isFocused ? 'tab-active' : ''}`}>
      <span className="tab-name" title={doc.name}>
        {doc.name}
      </span>
      <button className="tab-close-btn" onClick={onClose} title="Close document">
        ×
      </button>
    </div>
  )
}

export default DocumentTab
