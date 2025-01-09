import { useEffect } from 'react';
import axios from 'axios'
import './Content.css'

import MusicPlayer from './MusicCard'
import Song from '../Song'

interface ContentProps {
    setPlaying: (value: number) => void;
    setLoading: (value: boolean) => void;
    songs: Song[];
    setSongs: (value: Song[]) => void;
    playlistName: string | null;
    userEmail: string;
    setPlaylistName: (value: string | null) => void;
    isPlaying: boolean;
  }

const Content: React.FC<ContentProps> = ({ setPlaying, setLoading, songs, setSongs, playlistName, userEmail, setPlaylistName, isPlaying}) => {

      const loadSongInfo = async () => {
        if (playlistName != null) {
            setLoading(true);
            setSongs([]);
            try {
                const response = await axios.get(`/api/music/getSongs/${userEmail}/${playlistName}`, {
                    withCredentials: true
                });
                
                const temp: Song[] = response.data.map((song: any) => ({
                    ID: song.id,
                    name: song.name,
                    authorName: song.authors.join(', '), 
                    genre: song.genres.join(', '),
                    albumName: song.albumName 
                }));
                
                setSongs(temp);
                setPlaylistName(null);
            } catch (error) {
                console.error("Error fetching songs from database:", error);
            } finally {
                setLoading(false);
            }
        }
    };

    const handleSongClick = (id: number) => {
        setPlaying(id);
    };

    useEffect(() => {
        loadSongInfo();
    }, [playlistName]);

    const marginOpt = isPlaying ? '100px' : '0';

    return(
        <main>
        <table style={{ marginBottom: marginOpt }}>
            <tbody className="SongList">
                {songs.length > 0 && (
                    songs.map((song) => (
                        <tr key={song.ID} onClick={() => handleSongClick(song.ID)}>
                            <MusicPlayer obj={song} />
                        </tr>
                    ))
                )}
            </tbody>
        </table>
    </main>
    )
}

export default Content;