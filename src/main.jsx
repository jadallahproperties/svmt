import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

// Minimal storage shim so the admin panel works in the browser
// (the artifact environment provides window.storage — in production
//  we use localStorage as a simple stand-in)
if (!window.storage) {
  window.storage = {
    get: async (key) => {
      const val = localStorage.getItem(key)
      return val ? { key, value: val } : null
    },
    set: async (key, value) => {
      localStorage.setItem(key, value)
      return { key, value }
    },
    delete: async (key) => {
      localStorage.removeItem(key)
      return { key, deleted: true }
    },
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
