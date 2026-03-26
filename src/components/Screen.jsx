// Renders each character in the document with its individual color, size, and font style.
function Screen({ chars }) {
  if (chars.length === 0) {
    return (
      <div className="screen">
        <span className="screen-placeholder">Start typing…</span>
      </div>
    )
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
            }}
          >
            {/* Use a nonbreaking space so spaces are visible in the browser. */}
            {charObj.char === ' ' ? '\u00A0' : charObj.char}
          </span>
        )
      })}
    </div>
  )
}

export default Screen
