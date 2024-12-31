import Window from '../Window';
import { useState, useEffect } from 'react';
import NotesList from './NotesList';
import './style.css'

const initialNotes = [
    { id: 1, title: "Reunión del lunes", content: "Planificar la agenda para el lunes." },
    { id: 2, title: "Lista de compras", content: "Leche, huevos, pan, y frutas." },
    { id: 3, title: "Ideas para proyecto", content: "Aplicación de seguimiento de hábitos." },
];

const NOTES_LOCALSTORAGE_KEY = "NOTES_LOCALSTORAGE_KEY";

// eslint-disable-next-line react/prop-types
export default function Notes(props) {

    const [notes, setNotes] = useState(() => {
        try {
            let items = localStorage.getItem(NOTES_LOCALSTORAGE_KEY)
            if (items !== undefined && items !== null) {
                return JSON.parse(items)
            }
            return initialNotes;
        } catch {
            return initialNotes;
        }

    });
    const [activeNote, setActiveNote] = useState(notes[0]);

    useEffect(()=> {
        localStorage.setItem(NOTES_LOCALSTORAGE_KEY, JSON.stringify(notes))
    },[notes])

    const handleNoteSelect = (note) => {
        setActiveNote(note);
    };

    const handleContentChange = (e) => {
        const updatedNote = { ...activeNote, content: e.target.value };
        updateNote(updatedNote);
    };

    const handleTitleChange = (e) => {
        const updatedNote = { ...activeNote, title: e.target.value };
        updateNote(updatedNote);
    };

    const updateNote = (updatedNote) => {
        setActiveNote(updatedNote);
        const updatedNotes = notes.map((note) =>
            note.id === updatedNote.id ? updatedNote : note
        );
        setNotes(updatedNotes);
    };

    const handleCreateNote = () => {
        const maxId = notes.reduce((max, note) => (note.id > max ? note.id : max), 0);
        const newNote = {
            id: maxId + 1,
            title: "Nueva Nota",
            content: ""
        };
        setNotes([...notes, newNote]);
        setActiveNote(newNote)
    };
    
    const handleDeleteNote = () => {
        if (activeNote !== null) {
            const updatedNotes = notes.filter(note => note.id !== activeNote.id);
            setNotes(updatedNotes);
            setActiveNote(updatedNotes.length > 0 ? updatedNotes[0] : null);
        }
    };

    return (
        <Window title="Notas" {...props}>
            <div className="notes-container">
                <div className="notes-sidebar">
                    <div className="notes-sidebar-header">
                        <h2>Notas</h2>
                        <div className="notes-button-group">
                            <button className="notes-button notes-trash-button" onClick={() => {handleDeleteNote()}}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M28 6H6l2 24h16l2-24H4m12 6v12m5-12l-1 12m-9-12l1 12m0-18l1-4h6l1 4" /></svg>
                            </button>
                            <button className="notes-button notes-create-button"  onClick={() => {handleCreateNote()}}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="-0.5 -0.5 24 24"><path fill="currentColor" d="m21.289.98l.59.59c.813.814.69 2.257-.277 3.223L9.435 16.96l-3.942 1.442c-.495.182-.977-.054-1.075-.525a.93.93 0 0 1 .045-.51l1.47-3.976L18.066 1.257c.967-.966 2.41-1.09 3.223-.276zM8.904 2.19a1 1 0 1 1 0 2h-4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4a1 1 0 0 1 2 0v4a4 4 0 0 1-4 4h-12a4 4 0 0 1-4-4v-12a4 4 0 0 1 4-4z" /></svg>
                            </button>
                        </div>
                    </div>
                    <NotesList notes={notes} onSelect={handleNoteSelect} activeNoteId={activeNote.id} />
                </div>
                <div className="notes-editor">
                    <input
                        className="notes-title"
                        type="text"
                        value={activeNote.title}
                        onChange={handleTitleChange}
                    />
                    <textarea
                        value={activeNote.content}
                        onChange={handleContentChange}
                        rows={15}
                    />
                </div>
            </div>
        </Window>
    )
}


