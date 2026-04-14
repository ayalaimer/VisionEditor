import { useState } from 'react'
import LoginScreen from './components/LoginScreen'
import Screen from './components/Screen'
import Toolbar from './components/Toolbar'
import Keyboard from './components/Keyboard'
import SearchReplaceModal from './components/SearchReplaceModal'
import SaveModal from './components/SaveModal'
import OpenModal from './components/OpenModal'
import DocumentTab from './components/DocumentTab'
import './App.css'

let nextDocId = 1

// creates a new document 
function createDoc(name, owner) {
  return { id: nextDocId++, name, owner, chars: [], history: [] }
}

// root component that manages all application state and orchestrates child components.
function App() {
  //current user
  const [currentUser, setCurrentUser] = useState(null)

  // list of all currently open document objects.
  const [documents, setDocuments] = useState([])

  // id of the document the user is currently working on.
  const [focusedDocId, setFocusedDocId] = useState(null)

  // current typing style
  const [activeStyle, setActiveStyle] = useState({
    color: '#000000',
    fontSize: '20px',
    fontFamily: 'Arial',
  })
  // currently selected keyboard language layout.
  const [language, setLanguage] = useState('english')

  // search term to highlight in the active document's screen.
  const [searchTerm, setSearchTerm] = useState('')

  // controls which window is currently visible.
  const [showSearchReplace, setShowSearchReplace] = useState(false)
  const [showSaveAs, setShowSaveAs] = useState(false)
  const [showOpen, setShowOpen] = useState(false)
  const [closePromptDocId, setClosePromptDocId] = useState(null)

  // derived reference to the currently focused document object.
  const focusedDoc = documents.find(d => d.id === focusedDocId) || null

  // logs in the user and opens a blank starting document.
  function handleLogin(username) {
    setCurrentUser(username)
    const doc = createDoc('Untitled', username)
    setDocuments([doc])
    setFocusedDocId(doc.id)
  }

  // clears the current session and resets all application state.
  function handleLogout() {
    setCurrentUser(null)
    setDocuments([])
    setFocusedDocId(null)
  }

  // applies an updater function to a single document, leaving all others unchanged.
  function updateDoc(docId, updater) {
    setDocuments(prev => prev.map(d => (d.id === docId ? updater(d) : d)))
  }

  // pushes the current character array onto the undo history, capped at 50 entries.
  function saveSnapshot(doc) {
    const history = doc.history.length >= 50
      ? [...doc.history.slice(1), doc.chars]
      : [...doc.history, doc.chars]
    return history
  }

  // adds a new character object (with the current style) to the focused document.
  function addChar(char) {
    if (!focusedDoc) return
    const newChar = { char, ...activeStyle }
    updateDoc(focusedDocId, d => ({
      ...d,
      history: saveSnapshot(d),
      chars: [...d.chars, newChar],
    }))
  }

  // removes the last character from the focused document.
  function deleteChar() {
    if (!focusedDoc || focusedDoc.chars.length === 0) return
    updateDoc(focusedDocId, d => ({
      ...d,
      history: saveSnapshot(d),
      chars: d.chars.slice(0, -1),
    }))
  }

  // removes the last word from the document, skipping any trailing spaces or newlines.
  function deleteWord() {
    if (!focusedDoc) return
    updateDoc(focusedDocId, d => {
      const chars = d.chars
      let i = chars.length - 1
      // skip trailing spaces / newlines
      while (i >= 0 && (chars[i].char === ' ' || chars[i].char === '\n')) i--
      // delete until next space / newline
      while (i >= 0 && chars[i].char !== ' ' && chars[i].char !== '\n') i--
      return { ...d, history: saveSnapshot(d), chars: chars.slice(0, i + 1) }
    })
  }

  // clears all characters from the focused document.
  function clearAll() {
    if (!focusedDoc) return
    updateDoc(focusedDocId, d => ({ ...d, history: saveSnapshot(d), chars: [] }))
  }

  // restores the previous character state from the undo history.
  function undo() {
    if (!focusedDoc || focusedDoc.history.length === 0) return
    updateDoc(focusedDocId, d => ({
      ...d,
      chars: d.history[d.history.length - 1],
      history: d.history.slice(0, -1),
    }))
  }

  // highlights all occurrences of the search term in the active document's screen.
  function handleFind(searchStr) {
    setSearchTerm(searchStr)
  }

  // finds the first occurrence of a search string and replaces it with another.
  function searchReplace(searchStr, replaceStr) {
    if (!focusedDoc || !searchStr) return
    const chars = focusedDoc.chars
    const fullStr = chars.map(c => c.char).join('')
    const idx = fullStr.indexOf(searchStr)
    if (idx === -1) return
    const before = chars.slice(0, idx)
    const after = chars.slice(idx + searchStr.length)
    const replaceChars = replaceStr.split('').map(ch => ({ char: ch, ...activeStyle }))
    updateDoc(focusedDocId, d => ({
      ...d,
      history: saveSnapshot(d),
      chars: [...before, ...replaceChars, ...after],
    }))
  }

  // persists the document to Local storage
  function doSave(filename, doc) {
    const key =`${currentUser}`
    const userFiles=JSON.parse(localStorage.getItem(key)||`{}`)
    userFiles[filename]=doc
    localStorage.setItem(key,JSON.stringify(userFiles))
  }

  // saves the focused document if it is still Untitled ask filename.
  function saveDoc() {
    if (!focusedDoc) return;
    if(focusedDoc?.name=="Untitled"){
      setShowSaveAs(true);
    }
    else {
      doSave(focusedDoc.name, focusedDoc);
    }
  }

  // handles saving the document under a new filename.
  function handleSaveAs(filename) {
    if (!focusedDoc) return

    updateDoc(focusedDocId, d => ({
      ...d,
     name: filename,
    }))

    doSave(filename, {
    ...focusedDoc,
     name: filename,
   })

    setShowSaveAs(false)
  }

// loads and returns all saved files belonging to the current user from Local Storage.
function getSavedFiles() {
    const exi=JSON.parse(localStorage.getItem(currentUser)||`{}`);
     return Object.entries(exi).map(([filename, doc]) => ({
      name: filename,
      chars: doc.chars
    }));
}

  // opens a saved file by loading its stored content into a new document tab.
  function openFile(filename, chars) {
      const existing = documents.find(d => d.name === filename)
      if (existing) {
        setFocusedDocId(existing.id)
        setShowOpen(false)
        return
      }
      const doc = createDoc(filename, currentUser);
      doc.chars = chars;
      setDocuments(prev=>[...prev,doc])
      setFocusedDocId(doc.id);
      setShowOpen(false);
  }

  // creates and opens a new blank document.
  function newDocument() {
    const doc = createDoc('Untitled', currentUser)
    setDocuments(prev => [...prev, doc])
    setFocusedDocId(doc.id)
  }

  // triggers the close confirmation prompt for a given document.
  function requestCloseDoc(docId) {
    setClosePromptDocId(docId)
  }

  // closes a document, optionally saving it to Local Storage first.
  function closeDoc(docId, shouldSave) {
    if (shouldSave) {
      const doc = documents.find(d => d.id === docId)
      if (doc) doSave(doc.name, doc)
    }
    const remaining = documents.filter(d => d.id !== docId)
    setDocuments(remaining)
    if (focusedDocId === docId) {
      setFocusedDocId(remaining.length > 0 ? remaining[remaining.length - 1].id : null)
    }
    setClosePromptDocId(null)
  }

  // Shows the login screen when no user is logged in.
  if (!currentUser) {
    return <LoginScreen onLogin={handleLogin} />
  }

  const closingDoc = documents.find(d => d.id === closePromptDocId)

  return (
    <div className="app">
      {/* Renders all open documents as tiled panels. */}
      <div className="documents-area">
        {documents.length === 0 ? (
          <div className="empty-state">
            <p>No documents open — click <strong>New</strong> to create one.</p>
          </div>
        ) : (
          documents.map(doc => (
            <div
              key={doc.id}
              className={`document-wrapper ${doc.id === focusedDocId ? 'focused' : ''}`}
              onClick={() => setFocusedDocId(doc.id)}
            >
              <DocumentTab
                doc={doc}
                isFocused={doc.id === focusedDocId}
                onClose={e => { e.stopPropagation(); requestCloseDoc(doc.id) }}
              />
              <Screen chars={doc.chars} searchTerm={doc.id === focusedDocId ? searchTerm : ''} />
            </div>
          ))
        )}
      </div>

      {/* toolbar and virtual keyboard, fixed at the bottom of the screen. */}
      <div className="bottom-panel">
        <Toolbar
          language={language}
          setLanguage={setLanguage}
          activeStyle={activeStyle}
          setActiveStyle={setActiveStyle}
          onDeleteChar={deleteChar}
          onDeleteWord={deleteWord}
          onClearAll={clearAll}
          onUndo={undo}
          onSearchReplace={() => setShowSearchReplace(true)}
          onNew={newDocument}
          onSave={saveDoc}
          onSaveAs={() => setShowSaveAs(true)}
          onOpen={() => setShowOpen(true)}
          currentUser={currentUser}
          onLogout={handleLogout}
          hasDoc={!!focusedDoc}
          canUndo={!!focusedDoc && focusedDoc.history.length > 0}
        />
        <Keyboard
          language={language}
          onKeyPress={addChar}
          onDeleteChar={deleteChar}
          disabled={!focusedDoc}
        />
      </div>

      {/* Overlay modals shown based on current UI state. */}
      {showSearchReplace && (
        <SearchReplaceModal
          onFind={handleFind}
          onReplace={searchReplace}
          onClose={() => { setShowSearchReplace(false); setSearchTerm('') }}
        />
      )}

      {showSaveAs && (
        <SaveModal
          currentName={focusedDoc?.name === 'Untitled' ? '' : (focusedDoc?.name || '')}
          onSave={handleSaveAs}
          onClose={() => setShowSaveAs(false)}
        />
      )}

      {showOpen && (
        <OpenModal
          files={getSavedFiles()}
          onOpen={openFile}
          onClose={() => setShowOpen(false)}
        />
      )}

      {closePromptDocId && closingDoc && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Save before closing?</h3>
            <p>Do you want to save <strong>"{closingDoc.name}"</strong> before closing?</p>
            <div className="modal-actions">
              <button onClick={() => closeDoc(closePromptDocId, true)}>Save &amp; Close</button>
              <button className="btn-secondary" onClick={() => closeDoc(closePromptDocId, false)}>
                Close Without Saving
              </button>
              <button className="btn-secondary" onClick={() => setClosePromptDocId(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
