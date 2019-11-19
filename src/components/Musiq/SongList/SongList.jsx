import React from 'react';
import { debounce } from 'throttle-debounce';
import { DevelopersApi } from 'what_api';

import { Spinner } from 'CommonComponents/Spinner';
import { SongInfoContainer } from './SongInfoContainer';
import { SongActionButtons } from './SongActionButtons';
import { SongFilterPanel } from './SongFilterPanel';

export class SongList extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            skip: 0,
            limit: 30,
            songs: [],
            shouldShowSongs: false,
            shouldShowLoader: true
        }
        this.getSongsDebounced = debounce(2000, () => this.getSongs())
        this.onScrollDebounced = debounce(1000, () => this.onScroll())
    }

    componentDidMount() {
        const elems = document.querySelectorAll('select');
        M.FormSelect.init(elems, {});
        this.songsLoader = this.getSongs();
        window.addEventListener('scroll', this.onScrollDebounced);
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.onScrollDebounced);
    }

    getSongs() {
        const api = new DevelopersApi();

        const opts = {
            skip: this.state.skip,
            limit: this.state.limit,
            tags:  this.props.tags.filter(tagElement => tagElement.selected).map(tagElement => tagElement.tagItem.id)
        };

        this.setState({
            shouldShowSongs: false,
            shouldShowLoader: true
        });
        return api.searchSong(opts)
            .then(data => {
                this.setState({
                    songs: data,
                    shouldShowSongs: true,
                    shouldShowLoader: false
                });
            }, error => {
                // this.pushToast('Cound not get songs');
                console.error(error);
            });
    }

    updateSongs () {
        const api = new DevelopersApi();

        const opts = {
            skip: this.state.skip + this.state.limit,
            limit: this.state.limit,
            tags:  this.props.tags.filter(tagElement => tagElement.selected).map(tagElement => tagElement.tagItem.id)
        };

        this.setState({
            shouldShowLoader: true
        });
        return api.searchSong(opts)
            .then(data => {
                this.setState({
                    songs: [...this.state.songs, ...data],
                    skip: this.state.skip + data.length,
                    shouldShowLoader: false
                });
            }, error => {
                // this.pushToast('Cound not update songs');
                console.error(error);
            });
    }


    onScroll() {
        if (window.scrollY + window.innerHeight > document.body.scrollHeight - 200) {
            this.songsLoader = this.songsLoader
                .then(() => this.updateSongs());
        }
    }


    render() {
        return (
            <div>
                <SongFilterPanel
                    skip={this.state.skip}
                    setSkip={skip => this.setState({skip})}
                    limit={this.state.limit}
                    setLimit={limit => this.setState({limit})}
                    getSongsDebounced={this.getSongsDebounced}
                />
                <ul className={'collection' + (this.state.shouldShowSongs ? '' : ' hide')}>
                    {
                        this.state.songs.map((songItem, index) => {
                            return (
                                <li className="collection-item row" key={index}>
                                    <SongInfoContainer
                                        songItem={songItem}
                                        tags={this.props.tags}
                                    />
                                    <SongActionButtons 
                                        songItem={songItem}
                                        getYtItems={this.props.getYtItems}
                                        playVideo={this.props.playVideo}
                                    />
                                </li>
                            );
                        })
                    }
                </ul>
                <div className={'center-align' + (this.state.shouldShowLoader ? '' : ' hide')}>
                    <Spinner />
                </div>
            </div>
        );
    }
}