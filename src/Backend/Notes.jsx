import React, { useEffect, useState } from 'react'
import { supabase } from './SupabaseClient'

export default function Notes() {
  const [notes, setNotes] = useState([])
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

 

  // const addNote = async () => {
  //   const { data: { user } } = await supabase.auth.getUser()
  //   await supabase.from('notes').insert([{ title, content, user_id: user.id }])
  //   setTitle('')
  //   setContent('')
  // }

  const addNote = async () => {
    try {
      if (!title || !content) {
        alert("Please fill all fields");
        return;
      }
  
      // Get the current session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        alert("You need to be logged in to add notes");
        return;
      }
  
      // Call the Edge Function
      const res = await fetch('https://rxoaozljokvkbsrfsyio.supabase.co/functions/v1/addNote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          title,
          content
        }),
      });
  
      if (res.ok) {
        const data = await res.json();
        console.log('Note added:', data);
        setTitle('');
        setContent('');
        fetchNotes(); // Fetch updated notes
      } else {
        const error = await res.json();
        console.error("Error adding note:", error);
        alert(`Error adding note: ${error.error}`);
      }
    } catch (error) {
      console.error("Network error:", error);
      alert("Network error occurred");
    }
  }
  

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-black rounded-lg shadow space-y-4">
      <h2 className="text-2xl text-white font-semibold">My Notes</h2>
      <input
        className="text-white w-full p-2 border border-white rounded"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Note title"
      />
      <textarea
        className="text-white w-full p-2 border borderwhite rounded"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Note content"
      />
      <button
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        onClick={addNote}
      >
        Add Note
      </button>

        {/* <ul className="space-y-4">
          {notes.map(note => (
            <li key={note.id} className="p-4 border rounded shadow">
              <h3 className="font-semibold text-lg">{note.title}</h3>
              <p className="text-gray-700">{note.content}</p>
            </li>
          ))}
        </ul> */}
    </div>
  )
}