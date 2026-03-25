import { useState } from 'react'

function LoginScreen({ onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    const trimmed = username.trim()
    if (!trimmed || !password) return

    const users = JSON.parse(localStorage.getItem('vte__users') || '{}')

    if (users[trimmed] === undefined) {
      // New user — register
      users[trimmed] = password
      localStorage.setItem('vte__users', JSON.stringify(users))
      onLogin(trimmed)
    } else if (users[trimmed] === password) {
      onLogin(trimmed)
    } else {
      alert('Incorrect password.')
    }
  }

  return (
    <div className="login-screen">
      <div className="login-box">
        <div className="login-logo">✏️</div>
        <h1>Visual Text Editor</h1>
        <p>Enter your name to start editing</p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Your name..."
            value={username}
            onChange={e => setUsername(e.target.value)}
            autoFocus
            maxLength={32}
          />
          <input
            type="password"
            placeholder="Password..."
            value={password}
            onChange={e => setPassword(e.target.value)}
            maxLength={64}
          />
          <button type="submit" disabled={!username.trim() || !password}>
            Start Editing →
          </button>
        </form>
      </div>
    </div>
  )
}

export default LoginScreen
