import React, { useState } from 'react'
import { supabase } from '../Backend/SupabaseClient'

export default function Auth({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLogin, setIsLogin] = useState(true)
  const [message, setMessage] = useState('')

  const handleAuth = async () => {
    let result = isLogin
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password })

    if (result.error) {
      setMessage(result.error.message)
    } else {
      onLogin()
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 bg-black shadow-lg rounded-lg p-6 space-y-4">
      <h2 className="text-white text-2xl font-bold text-center">
        {isLogin ? 'Login' : 'Sign Up'}
      </h2>
      <input
        className="w-full p-2 border rounded"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        className="w-full p-2 border rounded"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        onClick={handleAuth}
      >
        {isLogin ? 'Login' : 'Sign Up'}
      </button>
      <button
        className="w-full text-sm text-white   underline"
        onClick={() => setIsLogin(!isLogin)}
      >
        Switch to {isLogin ? 'Sign Up' : 'Login'}
      </button>
      <p className="text-red-500 text-center">{message}</p>
    </div>
  )
}