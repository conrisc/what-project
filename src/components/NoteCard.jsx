import React from 'react';
import { Link, withRouter} from 'react-router-dom';
import { DevelopersApi, NoteItem } from 'what_api';

function NoteCardN(props) {
    const note = props.note;

    function removeNote() {
        const api = new DevelopersApi();
        const opts = {
            id: note._id
        };

        api.removeNote(note._id, (error, data, response) => {
            if (error)
                console.error(error);
            else {
                console.log(data);
                props.updateNotes();
                props.history.push('/notepad');
            }
        });
    }

    return (
        <div className="">
            <Link to={`/notepad/${note._id}`}>
                <div className="col s6 xl4">
                    <div className="card small">
                        <div className="btn-flat" onClick={removeNote}>
                            <i className="fas fa-times"></i>
                        </div>
                        <div className="card-content">
                            {note.text.split('\n', 11).map((el, i)=> {
                                return el ? <div key={i}>{el}</div> : <br key={i}></br>;
                            }
                            )}
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    );
}

let NoteCard = withRouter(NoteCardN);

export {
    NoteCard
}