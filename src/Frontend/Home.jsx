// src/Home.js
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../Backend/SupabaseClient'

export default function Home() {
  const navigate = useNavigate()

  // Logout function
  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/')  // Redirect to the login page (home page)
  }

  return (
    <div className="bg-black min-h-screen flex flex-col items-center justify-center space-y-6">
      <h1 className="text-white text-3xl font-bold">Welcome to Notes App</h1>
      ,<br />
      <div className="space-x-4">
        <button
          className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
          onClick={() => navigate('/add')}
        >
          Add Data
        </button>
        <button
          className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700"
          onClick={() => navigate('/get')}
        >
          Get Data
        </button>
      </div>

      <button
        className="bg-red-600 text-white px-6 py-3 rounded mt-6 hover:bg-red-700"
        onClick={handleLogout}
      >
        Logout
      </button>
    </div>
  )
}
