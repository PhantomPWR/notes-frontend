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
        let response = await fetch(`/api/notes/${noteId}`)
        let data = await response.json()
        setNote(data)
    }

    const createNote = async () => {
        fetch(`/api/notes/create/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(note)  // django will update the 'updated' date automatically
        })
    }

    let updateNote = async () => {
        fetch(`/api/notes/${noteId}/update/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(note)  // django will update the 'updated' date automatically
        })
    }

    let deleteNote = async () => {
        fetch(`/api/notes/${noteId}/delete/`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
        })
        navigate('/')
    }

    let handleSubmit = () => {
        if (noteId !== "new" && !note.body) {
            deleteNote()
        } else if (noteId !== "new") {
            updateNote()
        } else if (noteId === 'new' && note.body !== null) {
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
