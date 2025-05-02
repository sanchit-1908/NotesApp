import React, { useEffect, useState } from 'react'
import { supabase } from './Backend/SupabaseClient'
import Auth from './Frontend/Auth'
import Notes from './Backend/Notes'
import Home from './Frontend/Home'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import GetData from './Backend/GetData'

function App() {
  const [session, setSession] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  if (!session) {
    return <Auth onLogin={() => supabase.auth.getSession().then(({ data }) => setSession(data.session))} />
  }

  return (
    <Router>
      <Routes >
        <Route path="/" element={<Home />} />
        <Route path="/add" element={<Notes />} />
        <Route path="/get" element={<GetData />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  )
}

export default App
