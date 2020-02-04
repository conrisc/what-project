import React, { useRef } from 'react';
import { connect } from 'react-redux';

import { Spinner } from 'CommonComponents/Spinner';

function YtListX(props) {
    const searchYtInputRef = useRef();

    function loadVideoById(videoId) {
        props.ytPlayer.loadVideoById(videoId)
    }

    function handleSearchChange(event) {
        const title = event.target.value;
        props.getYtItemsDebounced(title);
    }

    function clearSearchYtInput() {
        searchYtInputRef.current.value = "";
        searchYtInputRef.current.focus();
    }

    return (
        <div>
            <div className="input-field">
                <input ref={searchYtInputRef} id="ytSearchBar" type="text" className="white-text" onChange={handleSearchChange}></input>
                <button className="clear-input white-text" onClick={clearSearchYtInput}>
                    <i className="fas fa-times"></i>
                </button>
                <label htmlFor="ytSearchBar">Search youtube</label>
            </div>
            {
                props.isFetchingYtItems ?
                    <div className="center-align">
                        <Spinner />
                    </div>
                :
                    <ul className="">
                        {
                            props.ytItems.map((el, index) => {
                                return <li className="bb-1 mt-1" key={index}>
                                        <div className="row">
                                            <div className="col s8">
                                                <a href={`https://youtube.com/watch?v=${el.videoId}`}
                                                    target="_blank" rel="noopener noreferrer"
                                                    title="Open song in youtube"
                                                >
                                                    <span>{el.title}</span>
                                                </a><br />
                                                <div className="mt-1">
                                                    <button className="btn red" onClick={() => props.loadVideo(el.videoId)}>
                                                        <i className="fas fa-tv"></i>
                                                    </button>
                                                    <button className="btn red" onClick={() => loadVideoById(el.videoId)}>
                                                        <i className="fas fa-play"></i>
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="col right">
                                                <img src={`https://i.ytimg.com/vi/${el.videoId}/default.jpg`}></img>
                                                {/* <img src={el.thumbnailUrl}></img> */}
                                            </div>
                                        </div>
                                </li>;
                            })
                        }
                    </ul>
            }
        </div>
    );
}
const mapStateToProps = state => {
    return {
        ytPlayer: state.ytPlayer
    };
}

const mapDispatchToProps = dispatch => {
    return {};
}

export const YtList = connect(mapStateToProps, mapDispatchToProps)(YtListX);
