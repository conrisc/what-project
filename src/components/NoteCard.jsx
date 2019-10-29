import React from 'react';
import { Link } from 'react-router-dom';

export function NoteCard(props) {
    const note = props.note;

    function handleRemoveClick(event) {
        event.stopPropagation();
        event.preventDefault();
        props.removeNote(note._id);
    }

    return (
        <div className="">
            <Link to={`/notepad/${note._id}`}>
                <div className="col s6 xl4">
                    <div className="card small">
                        <div className="btn-flat note-rm-btn" onClick={handleRemoveClick}>
                            <i className="fas fa-times"></i>
                        </div>
                        <div className="card-content">
                            {note.text.split('\n', 11).map((el, i)=> {
                                return el ? <div key={i}>{el}</div> : <br key={i}></br>;
                            })}
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    );
}
