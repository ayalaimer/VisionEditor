// Renders each character in the document with its individual color, size, and font style.
function Screen({ chars, searchTerm }) {
  if (chars.length === 0) {
    return (
      <div className="screen">
        <span className="screen-placeholder">Start typing…</span>
      </div>
    )
  }

  const highlightedIndices = new Set()
  if (searchTerm) {
    const fullStr = chars.map(c => c.char).join('')
    let pos = 0
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
              backgroundColor: highlightedIndices.has(index) ? '#ffff00' : undefined,
            }}
          >
            {charObj.char === ' ' ? '\u00A0' : charObj.char}
          </span>
        )
      })}
    </div>
  )
}

export default Screen
