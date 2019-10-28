import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { DevelopersApi } from 'what_api';

import { NoteList } from './NoteList';
import { NoteEditor } from './NoteEditor';
import { Spinner } from './Spinner';

export function Notepad(props) {
    const { noteId } = useParams();
    const [ notes, setNotes ] = useState([]);
    const [ note, setNote ] = useState(null);

    useEffect(() => {
        getNotes();
    }, []);

    useEffect(() => {
        if (noteId)
            displayNote();
    }, [noteId, notes]);

    function onNoteChange(noteId, text) {
        const note = notes.find(noteItem => noteItem._id === noteId);
        const newNote = { ...note, text };
        const newNotes = notes.filter(noteItem => noteItem._id !== noteId);
        setNotes([...newNotes, newNote]);
    }

    // function getNote() {
    //     const api = new DevelopersApi();
    //     const opts = { 
    //         id: noteId
    //     };
    //     api.searchNote(opts, (error, data, response) => {
    //         if (error) {
    //             console.error(error);
    //         } else {
    //             console.log('Found some notes', data, response);
    //             if (data.length > 0)
    //                 setNote(data[0])
    //         }
    //     });
    // }

    function displayNote() {
        const newNote = notes.find(noteItem => noteItem._id === noteId) || null;
        setNote(newNote);
    }

    function getNotes() {
        return new Promise((resolve, reject) => {
            const api = new DevelopersApi();

            api.searchNote({}, (error, data, response) => {
                if (error)
                    console.error(error);
                else {
                    console.log('getNotes: ', data, response);
                    setNotes(data);
                }
            });
        });
    }

    return (
        <div className="notepad">
            <div className="row">
                <div className={"col s12 l6" + (noteId !== undefined ? ' hide-on-med-and-down' : '' )}>
                    <NoteList noteId={noteId} notes={notes} updateNotes={getNotes} />
                </div>
                <div className={"col s12 l6"  + (noteId === undefined ? ' hide' : '' )}>
                    { 
                        note ?
                        <NoteEditor note={note} onNoteChange={onNoteChange} /> :
                        <Spinner />
                    }
                </div>
            </div>
        </div>
    );
}