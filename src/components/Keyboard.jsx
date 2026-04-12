// Virtual keyboard component that renders character buttons for the selected language.
function Keyboard({ language, onKeyPress, onDeleteChar, disabled }) {
  let keys
  if(language==='english'){
    keys = [
    ['q','w','e','r','t','y','u','i','o','p'],
    ['a','s','d','f','g','h','j','k','l'],
    ['z','x','c','v','b','n','m']
    ]
  }
  else if(language==='hebrew'){
    keys = [
    ['ק','ר','א','ט','ו','ן','ם','פ'],
    ['ש','ד','ג','כ','ע','י','ח','ל','ך'],
    ['ז','ס','ב','ה','נ','מ','צ','ת','ץ']
    ]
    }
  else if(language==='emojis'){
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
     keys = [
    ['1','2','3'],
    ['4','5','6'],
    ['7','8','9'],
    ['0','.','-']
    ]
  }
  else if(language === 'kaomoji') {
     keys = [
    ['(╯°□°）╯︵ ┻━┻','¯\\_(ツ)_/¯','(｡♥‿♥｡)'],
    ['(づ｡◕‿‿◕｡)づ','ʕ•ᴥ•ʔ','(☞ﾟヮﾟ)☞'],
    ['ಠ_ಠ','(ノಠ益ಠ)ノ','(｡•̀ᴗ-)✧']
    ]
  }
  else if (!keys) {
  keys = []
  }
  return (
    <div className={`keyboard ${disabled ? 'keyboard-disabled' : ''}`}>
      
      {keys.map((row, i) => (
        <div key={i} className="keyboard-row">
          
          {row.map(k => (
            <button key={k} className="key" onClick={() => onKeyPress(k)}>
              {k}
            </button>
          ))}

        </div>
      ))}
      {/*spaciel buttons */}
      <div className="keyboard-row">
        <button className="key-space" onClick={() => onKeyPress(' ')}>
          Space
        </button>

        <button className="key-backspace" onClick={onDeleteChar}>
          ⌫
        </button>

        <button className="key-enter" onClick={() => onKeyPress('\n')}>
          Enter
        </button>
      </div>

    </div>
  )
}

export default Keyboard