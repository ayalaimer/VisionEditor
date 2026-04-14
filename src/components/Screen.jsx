// Renders each character in the document with its individual color, size, and font style.
// Highlights all occurrences of searchTerm in yellow when provided.
function Screen({ chars, searchTerm }) {
  // Shows a placeholder when the document has no content yet.
  if (chars.length === 0) {
    return (
      <div className="screen">
        <span className="screen-placeholder">Start typing…</span>
      </div>
    )
  }

  // Builds a set of character indices that match the current search term.
  const highlightedIndices = new Set()
  if (searchTerm) {
    const fullStr = chars.map(c => c.char).join('')
    let pos = 0
    // Scans the full string for all occurrences and marks each character index.
    while (pos <= fullStr.length - searchTerm.length) {
      const idx = fullStr.indexOf(searchTerm, pos)
      if (idx === -1) break
      for (let i = idx; i < idx + searchTerm.length; i++) {
        highlightedIndices.add(i)
      }
      pos = idx + 1
    }
  }

  return (
    <div className="screen">
      {/* Renders each character as a styled span, or a <br> for newlines. */}
      {chars.map((charObj, index) => {
        if (charObj.char === '\n') {
          return <br key={index} />
        }
        return (
          <span
            key={index}
            style={{
              color: charObj.color,
              fontSize: charObj.fontSize,
              fontFamily: charObj.fontFamily,
              // Highlights the character yellow if it belongs to a search match.
              backgroundColor: highlightedIndices.has(index) ? '#ffff00' : undefined,
            }}
          >
            {/* Renders spaces as non-breaking spaces so they are always visible. */}
            {charObj.char === ' ' ? '\u00A0' : charObj.char}
          </span>
        )
      })}
    </div>
  )
}

export default Screen
