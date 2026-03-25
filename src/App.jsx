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

function createDoc(name, owner) {
  return { id: nextDocId++, name, owner, chars: [], history: [] }
}

function App() {
  // Phase D: user identity
  const [currentUser, setCurrentUser] = useState(null)

  // Phase C: multiple documents
  const [documents, setDocuments] = useState([])
  const [focusedDocId, setFocusedDocId] = useState(null)

  // Phase A: active typing style
  const [activeStyle, setActiveStyle] = useState({
    color: '#000000',
    fontSize: '20px',
    fontFamily: 'Arial',
  })
  const [language, setLanguage] = useState('english')

  // Modal visibility flags
  const [showSearchReplace, setShowSearchReplace] = useState(false)
  const [showSaveAs, setShowSaveAs] = useState(false)
  const [showOpen, setShowOpen] = useState(false)
  const [closePromptDocId, setClosePromptDocId] = useState(null)

  const focusedDoc = documents.find(d => d.id === focusedDocId) || null

  // ── Phase D ──────────────────────────────────────────────────────────────
  function handleLogin(username) {
    setCurrentUser(username)
    const doc = createDoc('Untitled', username)
    setDocuments([doc])
    setFocusedDocId(doc.id)
  }

  function handleLogout() {
    setCurrentUser(null)
    setDocuments([])
    setFocusedDocId(null)
  }

  // ── Helpers ──────────────────────────────────────────────────────────────
  function updateDoc(docId, updater) {
    setDocuments(prev => prev.map(d => (d.id === docId ? updater(d) : d)))
  }

  function saveSnapshot(doc) {
    // Keep up to 50 undo states to prevent memory bloat
    const history = doc.history.length >= 50
      ? [...doc.history.slice(1), doc.chars]
      : [...doc.history, doc.chars]
    return history
  }

  // ── Phase A: text editing ─────────────────────────────────────────────
  function addChar(char) {
    if (!focusedDoc) return
    const newChar = { char, ...activeStyle }
    updateDoc(focusedDocId, d => ({
      ...d,
      history: saveSnapshot(d),
      chars: [...d.chars, newChar],
    }))
  }

  function deleteChar() {
    if (!focusedDoc || focusedDoc.chars.length === 0) return
    updateDoc(focusedDocId, d => ({
      ...d,
      history: saveSnapshot(d),
      chars: d.chars.slice(0, -1),
    }))
  }

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

  function clearAll() {
    if (!focusedDoc) return
    updateDoc(focusedDocId, d => ({ ...d, history: saveSnapshot(d), chars: [] }))
  }

  function undo() {
    if (!focusedDoc || focusedDoc.history.length === 0) return
    updateDoc(focusedDocId, d => ({
      ...d,
      chars: d.history[d.history.length - 1],
      history: d.history.slice(0, -1),
    }))
  }

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

  // ── Phase B: persistence ──────────────────────────────────────────────
  function doSave(filename, doc) {
    // TODO: Partner needs to implement Local Storage logic using JSON.stringify/parse.
  }

  function saveDoc() {
    // TODO: Partner needs to implement Local Storage logic using JSON.stringify/parse.
  }

  function handleSaveAs(filename) {
    // TODO: Partner needs to implement Local Storage logic using JSON.stringify/parse.
  }

  function getSavedFiles() {
    // TODO: Partner needs to implement Local Storage logic using JSON.stringify/parse.
    return []
  }

  function openFile(filename, chars) {
    // TODO: Partner needs to implement Local Storage logic using JSON.stringify/parse.
  }

  // ── Phase C: multi-document ───────────────────────────────────────────
  function newDocument() {
    const doc = createDoc('Untitled', currentUser)
    setDocuments(prev => [...prev, doc])
    setFocusedDocId(doc.id)
  }

  function requestCloseDoc(docId) {
    setClosePromptDocId(docId)
  }

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

  // ── Render ────────────────────────────────────────────────────────────
  if (!currentUser) {
    return <LoginScreen onLogin={handleLogin} />
  }

  const closingDoc = documents.find(d => d.id === closePromptDocId)

  return (
    <div className="app">
      {/* ── Documents area (Phase C) ── */}
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
              <Screen chars={doc.chars} />
            </div>
          ))
        )}
      </div>

      {/* ── Bottom panel: Toolbar + Keyboard ── */}
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

      {/* ── Modals ── */}
      {showSearchReplace && (
        <SearchReplaceModal
          onReplace={searchReplace}
          onClose={() => setShowSearchReplace(false)}
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
