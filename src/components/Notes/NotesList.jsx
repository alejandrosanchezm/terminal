/* eslint-disable react/prop-types */
export default function NotesList({ notes, onSelect, activeNoteId }) {
    return (
      <ul>
        {notes.map((note) => (
          <li
            key={note.id}
            className={note.id === activeNoteId ? "active" : ""}
            onClick={() => onSelect(note)}
          >
            {note.title}
          </li>
        ))}
      </ul>
    );
  }
  