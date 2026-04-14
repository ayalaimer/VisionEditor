// Virtual keyboard component that renders character buttons for the selected language.
// Applies a disabled style and blocks interaction when no document is focused.
function Keyboard({ language, onKeyPress, onDeleteChar, disabled }) {
  // Builds the key grid based on the currently selected language layout.
  let keys
  if(language==='english'){
    // Standard QWERTY rows for English input.
    keys = [
    ['q','w','e','r','t','y','u','i','o','p'],
    ['a','s','d','f','g','h','j','k','l'],
    ['z','x','c','v','b','n','m']
    ]
  }
  else if(language==='hebrew'){
    // Hebrew alphabet arranged across three rows.
    keys = [
    ['ק','ר','א','ט','ו','ן','ם','פ'],
    ['ש','ד','ג','כ','ע','י','ח','ל','ך'],
    ['ז','ס','ב','ה','נ','מ','צ','ת','ץ']
    ]
    }
  else if(language==='emojis'){
    // A large grid of common emoji characters.
    keys = [
    ['😀','😁','😂','🤣','😃','😄','😅','😆','😉','😊','😋','😎','😍','😘','🥰','😗'],
    ['😙','😚','🙂','🤗','🤩','🤔','🤨','😐','😑','😶','🙄','😏','😣','😥','😮','🤐'],
    ['😯','😪','😫','🥱','😴','😌','😛','😜','😝','🤤','😒','😓','😔','😕','🙃','🫠'],
    ['🤑','😲','☹️','🙁','😖','😞','😟','😤','😢','😭','😦','😧','😨','😩','🤯','😬'],
    ['😰','😱','🥵','🥶','😳','🤪','😵','😡','😠','🤬','😷','🤒','🤕','🤢','🤮','🤧'],
    ['❤️','🧡','💛','💚','💙','💜','🖤','🤍','👍','👎','👏','🙌','🙏','🤝','💪','🔥'],
    ['✨','🎉','🎈','💡','⚡','⭐','🌟','💥']
    ]
  }
  else if(language==='numbers'){
    // Numeric keypad layout with digits, decimal point, and minus sign.
    keys = [
    ['1','2','3'],
    ['4','5','6'],
    ['7','8','9'],
    ['0','.','-']
    ]
  }
  else if(language === 'kaomoji') {
    // ASCII kaomoji expressions arranged in rows.
    keys = [
    ['(╯°□°）╯︵ ┻━┻','¯\\_(ツ)_/¯','(｡♥‿♥｡)'],
    ['(づ｡◕‿‿◕｡)づ','ʕ•ᴥ•ʔ','(☞ﾟヮﾟ)☞'],
    ['ಠ_ಠ','(ノಠ益ಠ)ノ','(｡•̀ᴗ-)✧']
    ]
  }
  else if (!keys) {
    // Fallback: no keys for unrecognized language codes.
    keys = []
  }
  return (
    <div className={`keyboard ${disabled ? 'keyboard-disabled' : ''}`}>

      {/* Renders each row of language-specific character keys. */}
      {keys.map((row, i) => (
        <div key={i} className="keyboard-row">
          {row.map(k => (
            <button key={k} className="key" onClick={() => onKeyPress(k)}>
              {k}
            </button>
          ))}
        </div>
      ))}

      {/* Special action keys: Space, Backspace, and Enter — always visible regardless of layout. */}
      <div className="keyboard-row">
        <button className="key key-space" onClick={() => onKeyPress(' ')}>
          Space
        </button>
        <button className="key key-backspace" onClick={onDeleteChar}>
          ⌫
        </button>
        <button className="key key-enter" onClick={() => onKeyPress('\n')}>
          Enter
        </button>
      </div>

    </div>
  )
}

export default Keyboard