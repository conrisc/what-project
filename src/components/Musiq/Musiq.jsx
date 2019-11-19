import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { debounce } from 'throttle-debounce';
import { DevelopersApi } from 'what_api';

import { WSConnection } from 'Services/wsConnection';
import { dataTypes } from 'Constants/wsConstants';

import { Toast } from 'CommonComponents/Toast';
import { TopPanel } from './TopPanel';
import { MainView } from './MainView';
import { BottomPanel } from './BottomPanel';
import { TagsList } from './TagsList';


export class Musiq extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            songs: [],
            volume: 100,
            skip: 0,
            limit: 20,
            toasts: [],
            isConnected: false,
            tags: []
        }
        this.player = null;
        this.YTListRef = React.createRef();
        this.songsLoader = this.getSongs();
        this.getTags();
        this.onScrollDebounced = debounce(1000, () => this.onScroll())
        this.ws = new WSConnection(true, 10000);
        this.nextSongsIndex = 0;
    }

    componentDidMount() {
        window.addEventListener('scroll', this.onScrollDebounced);

        this.connect();

        loadYT.then((YT) => {
            this.player = new YT.Player('player', {
                height: 360,
                width: 640
            });
            this.player.addEventListener('onStateChange', state => {
                const songItem = this.state.songs[this.nextSongIndex];
                if (state.data === 0 && songItem) {
                    const videoIdMatch = songItem.url.match(/[?&]v=([^&?]*)/);
                    const videoId = videoIdMatch ? videoIdMatch[1] : '';
                    this.playVideo(videoId, this.nextSongIndex);
                }
            })
        })

    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.onScrollDebounced);
        this.ws.close();
    }

    connect() {
        const listeners = {
            onopen: () => {
                this.setState({ isConnected: true });
            },
            onmessage: (message) => {
                const dataFromServer = JSON.parse(message.data);
                console.log('WS <onmessage>: ', dataFromServer);
                switch (dataFromServer.type) {
                    case dataTypes.NEW_MESSAGE:
                        console.log('WS <NEW_MESSAGE>: ', dataFromServer);
                        break;
                    case dataTypes.PLAY:
                        this.player.playVideo();
                        this.pushToast('Playing video');
                        break;
                    case dataTypes.PAUSE:
                        this.player.pauseVideo();
                        this.pushToast('Pausing video');
                        break;
                    case dataTypes.SET_VOLUME:
                        this.setState({ volume: dataFromServer.volume });
                        this.pushToast(`Setting volume to ${dataFromServer.volume}`);
                        this.player.setVolume(dataFromServer.volume);
                        break;
                    case dataTypes.LOAD_VIDEO:
                        this.playVideo(dataFromServer.videoId)
                        this.pushToast(`Loading video: ${dataFromServer.videoId}`);
                        break;
                }
            },
            onclose: (message) => {
                this.setState({ isConnected: false })
                this.pushToast(`WS<onclose>: ${message.type}`);
            },
            onerror: (message) => {
                this.setState({ isConnected: false })
                this.pushToast(`WS<onerror>: ${message.type}`);
            }
        }
        this.ws.open(listeners);
    }

    playVideo(videoId, index) {
        this.player.loadVideoById(videoId)
        this.player.playVideo();
        this.nextSongIndex = index + 1;
    }

    onScroll() {
        if (window.scrollY + window.innerHeight > document.body.scrollHeight - 200) {
            this.songsLoader = this.songsLoader
                .then(() => this.updateSongs());
        }
    }

    getSongs() {
        const api = new DevelopersApi();

        const opts = {
            skip: this.state.skip,
            limit: this.state.limit,
            tags:  this.state.tags.filter(tagElement => tagElement.selected).map(tagElement => tagElement.tagItem.id)
        };

        return api.searchSong(opts)
            .then(data => {
                this.setState({ songs: data })
            }, error => {
                this.pushToast('Cound not get songs');
                console.error(error);
            });
    }

    updateSongs () {
        const api = new DevelopersApi();

        const opts = {
            skip: this.state.skip + this.state.limit,
            limit: this.state.limit,
            tags:  this.state.tags.filter(tagElement => tagElement.selected).map(tagElement => tagElement.tagItem.id)
        };

        return api.searchSong(opts)
            .then(data => {
                this.setState({ songs: [...this.state.songs, ...data] });
                this.setState({skip: this.state.skip + data.length});
            }, error => {
                this.pushToast('Cound not update songs');
                console.error(error);
            });
    }

     getTags() {
        const api = new DevelopersApi();

        const opts = {
            skip: 0,
            limit: 300
        };

        api.searchTag(opts)
            .then(data => {
                this.setState({
                    tags: data.map(tagItem => ({ tagItem, selected: false }))
                })
            }, error => {
                // this.pushToast('Cound not get songs');
                console.error(error);
            });
    }

    pushToast(text) {
        this.setState({ toasts:
            [{
                date: new Date(),
                text
            }, ...this.state.toasts]
        });
    }

    toggleTag(tagElement) {
        const newTags = this.state.tags.map(el => {
            if (tagElement.tagItem.id === el.tagItem.id)
                return { 
                    tagItem: tagElement.tagItem,
                    selected: !tagElement.selected
                }
            return el;
        });
        this.setState(
            { tags: newTags, skip: 0, limit: 20 },
            () => this.getSongs()
        );
    }

    render() {
        return (
            <div>
                <Toast data={this.state.toasts} setToasts={(v) => this.setState({ toasts: v })}></Toast>
                <TagsList toggleTag={(tagElement) => this.toggleTag(tagElement)} tags={this.state.tags} />
                <TopPanel 
                    ws={this.ws}
                    connect={() => this.connect()}
                    isConnected={this.state.isConnected}
                    volume={this.state.volume}
                    setVolume={(v) => this.setState({ volume: v })}
                    skip={this.state.skip}
                    setSkip={(v) => this.setState({ skip: v })}
                    limit={this.state.limit}
                    setLimit={(v) => this.setState({ limit: v })}
                    getSongs={(v) => this.getSongs(v)}
                />
                <MainView 
                    songs={this.state.songs}
                    tags={this.state.tags}
                    playVideo={(id, i) => this.playVideo(id, i)}/>
                <BottomPanel />
            </div>
        );
    }
};