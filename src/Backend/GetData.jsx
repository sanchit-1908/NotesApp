// src/GetData.js
import React, { useEffect, useState } from 'react'
import { supabase } from './SupabaseClient'

export default function GetData() {
  const [notes, setNotes] = useState([])

  // Fetch notes for the logged-in user
  // const fetchNotes = async () => {
  //   const { data: { user } } = await supabase.auth.getUser()
    
  //   // Fetch notes where user_id matches the logged-in user's id
  //   const { data, error } = await supabase
  //     .from('notes')
  //     .select('*')
  //     .eq('user_id', user.id) // Filtering notes by user_id
      

  //   if (!error) {
  //     setNotes(data)
  //   }
  // }


  const fetchNotes = async () => {
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  
      if (sessionError) {
        throw new Error(sessionError.message);
      }
  
      if (!session?.access_token) {
        throw new Error('No active session');
      }
  
      const res = await fetch('https://rxoaozljokvkbsrfsyio.supabase.co/functions/v1/fetchNotes', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
      });
  
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${res.status}`);
      }
  
      const notes = await res.json();
      setNotes(notes);
    } catch (error) {
      console.error("Error fetching notes:", error instanceof Error ? error.message : String(error));
      // Optionally show error to user:
      // setError(error instanceof Error ? error.message : 'Failed to fetch notes');
    }
  };
  

  useEffect(() => {
    fetchNotes()
  }, [])

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-black rounded-lg shadow space-y-4">
      <h2 className="text-white text-2xl font-semibold">My Notes</h2>

      <div className="space-y-4">
        {notes.length > 0 ? (
          notes.map(note => (
            <div key={note.id} className="p-4 border rounded border-white shadow">
              <h3 className="text-white font-semibold text-lg">{note.title}</h3>
              <h3 className="text-white font-semibold text-lg">{note.content}</h3>
            </div>
          ))
        ) : (
          <p>No notes available for this user.</p>
        )}
      </div>
    </div>
  )
}
