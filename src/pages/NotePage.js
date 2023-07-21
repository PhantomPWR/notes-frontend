import React, {useEffect, useState} from 'react'

import { ReactComponent as ArrowLeft } from '../assets/arrow-left.svg' 
import { useParams } from 'react-router'
import { useNavigate } from 'react-router-dom'  //useNavigate replaces useHistory in React Router v6
// import notes from '../assets/data'

const NotePage = () => {
    const { noteId } = useParams();
    const navigate = useNavigate()
    console.log('noteId: ', noteId)
    const [note, setNote] = useState({})

    useEffect(() => {
        getNote()
    }, [noteId])

    const getNote = async () => {
        if (noteId === 'new') return
        const response = await fetch(`http://localhost:8001/notes/${noteId}`)
        const data = await response.json()
        setNote(data)
    }

    const createNote = async () => {
        await fetch(`http://localhost:8001/notes/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            // body: JSON.stringify(note)  // django will update the 'updated' date automatically
            body: JSON.stringify({...note, 'updated': new Date()})  // manually update 'updated' date temporarily
        })
    }

    const updateNote = async () => {
        await fetch(`http://localhost:8001/notes/${noteId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            // body: JSON.stringify(note)  // django will update the 'updated' date automatically
            body: JSON.stringify({...note, 'updated': new Date()})  // manually update 'updated' date temporarily
        })
    }

    const deleteNote = async () => {
        await fetch(`http://localhost:8001/notes/${noteId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(note)
        })
        navigate('/')
    }

    const handleSubmit = () => {
        if (noteId !== "new" && !note.body) {
            deleteNote()
        } else if (noteId !== "new") {
            updateNote()
        } else if (noteId === 'new' && note !== null) {
            createNote()
        }
        navigate('/')
    }

  return (
    <div className='note'>
        <div className="note-header">
            <h3>
                <ArrowLeft onClick={handleSubmit} />
            </h3>
            {noteId !== 'new' ? (
                <button onClick={deleteNote}>Delete</button>
            ) : (
                <button onClick={handleSubmit}>Done</button>
            )}
        </div>
        <textarea onChange={(e) => { setNote({ ...note, 'body': e.target.value }) }} placeholder="Edit note" value={note && note.body}></textarea>
    </div>
  );
};

export default NotePage;
