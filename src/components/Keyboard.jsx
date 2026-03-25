function Keyboard({ language, onKeyPress, onDeleteChar, disabled }) {
  return (
    <div className={`keyboard ${disabled ? 'keyboard-disabled' : ''}`}>
      {/* TODO: Partner needs to implement the keyboard layout and character buttons here. */}
    </div>
  )
}

export default Keyboard
