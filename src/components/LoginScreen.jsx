import { useState } from 'react'

// Displays the login form and handles both new user registration and returning user authentication.
function LoginScreen({ onLogin }) {
  // current value of the username input field.
  const [username, setUsername] = useState('')
  // current value of the password input field.
  const [password, setPassword] = useState('')

  // Validates credentials against Local Storage, registering new users or logging in existing ones.
  function handleSubmit(e) {
    e.preventDefault()
    const trimmed = username.trim()
    if (!trimmed || !password) return

    // Loads the stored users map from Local Storage, defaulting to an empty object.
    const users = JSON.parse(localStorage.getItem('vte__users') || '{}')

    if (users[trimmed] === undefined) {
      // New user: save their password and proceed directly to the editor.
      users[trimmed] = password
      localStorage.setItem('vte__users', JSON.stringify(users))
      onLogin(trimmed)
    } else if (users[trimmed] === password) {
      // Existing user: password matches, allow login.
      onLogin(trimmed)
    } else {
      // Existing user: wrong password.
      alert('Incorrect password.')
    }
  }

  return (
    <div className="login-screen">
      <div className="login-box">
        {/* App logo and title displayed above the form. */}
        <div className="login-logo">✍</div>
        <h1>Visual Text Editor</h1>
        <p>Enter your name to start editing</p>
        <form onSubmit={handleSubmit}>
          {/* Username input, auto-focused on mount. */}
          <input
            type="text"
            placeholder="Your name..."
            value={username}
            onChange={e => setUsername(e.target.value)}
            autoFocus
            maxLength={32}
          />
          {/* Password input, masked for privacy. */}
          <input
            type="password"
            placeholder="Password..."
            value={password}
            onChange={e => setPassword(e.target.value)}
            maxLength={64}
          />
          {/* Submit is disabled until both fields have content. */}
          <button type="submit" disabled={!username.trim() || !password}>
            Start Editing →
          </button>
        </form>
      </div>
    </div>
  )
}

export default LoginScreen
