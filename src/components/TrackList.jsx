import React from 'react';
import { DevelopersApi } from 'what_api';

export function TrackList(props) {
    const songs = props.songs;
    const tagsIdToNameMap = props.tags.reduce(
        (acc, tagElement) => { 
            acc[tagElement.tagItem.id] = tagElement.tagItem.name;
            return acc;
        }, 
    {});
    
    function get(title) {
        const api = new DevelopersApi();

        const opts = {
            url: `https://www.youtube.com/results?search_query=${title}`
        }

        api.getData(opts.url)
            .then(data => {
                const resultContainer = data.match(/<ol id=\"item-section(.*\s*)*?<\/ol>/)[0];
                const result = resultContainer.split('<div class="yt-lockup ')
                    .slice(1,7)
                    .map((el)=> {
                        return {
                            title: el.match('<a href=.*?title="([^"]*)')[1],
                            url: el.match('<a href="([^"]*)')[1],
                            imgUrl: el.match('<img.*?src="([^"?]*)')[1]
                        }
                    });
                console.log(result);
            })
    }

    return (
        <div>
            <ul className="collection">
                {
                    songs.map((songItem, index) => {
                        const date = new Date(songItem.dateAdded).toGMTString();
                        const videoIdMatch = songItem.url.match(/[?&]v=([^&?]*)/);
                        const videoId = videoIdMatch ? videoIdMatch[1] : '';
                        return <li className="collection-item row" key={index}>
                            <div className="col">
                                <h6 className="bold">{songItem.title}</h6>
                                {
                                    songItem.tags.map(tagId => <span key={tagId} className="tag-item">{tagsIdToNameMap[tagId]}</span>)
                                }
                                <p>
                                    <span className="small-text grey-text">{date}</span>
                                </p>
                            </div>
                            <div className="col s3 right right-text">
                                <a
                                href={"https://www.youtube.com/results?search_query="+songItem.title}
                                className="btn btn-small"
                                target="_blank" rel="noopener noreferrer"
                                title="Search song in youtube">
                                    <i className="fas fa-link"></i>
                                </a>
                                <a
                                href={songItem.url}
                                className={"btn btn-small" + (songItem.url ? '' : ' disabled')}
                                target="_blank" rel="noopener noreferrer"
                                title="Open song in youtube">
                                    <i className="fas fa-link"></i>
                                </a>
                                <button
                                className="btn btn-small"
                                onClick={() => props.findSong(songItem.title)}
                                title="Find this song using youtube">
                                    <i className="fab fa-youtube"></i>
                                </button>
                                <button
                                className="btn btn-small"
                                onClick={() => get(songItem.title)}
                                title="Find this song using youtube">
                                    SC
                                </button>
                                <button
                                className={"btn btn-small" + (videoId ? '' : ' disabled')}
                                onClick={() => props.loadVideo(videoId)}
                                title="Play song on other devices">
                                    <i className="fas fa-play"></i>
                                </button>
                            </div>
                        </li>;
                    })
                }
            </ul>
        </div>
    );
}
