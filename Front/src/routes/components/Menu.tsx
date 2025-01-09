import { useState, useEffect, useRef} from 'react';

import './Menu.css'
import axios from 'axios';
import Song from '../Song'

interface HeaderProps {
    setLoginState: (value: boolean) => void;
    setUserRole: (value: string) => void;
    setLoading: (value: boolean) => void;
    queuePlaying: number;
    setPlayingQueue: (value: number) => void;
    nowPlaying: number;
    setNowPlaying: (value: number) => void;
    songs: Song[];
    setPlaylistName: (value: string | null) => void;
    userEmail: string;
    menuToggle: boolean;
}

interface Label {
    id: number;
    name: string;
}

const Menu: React.FC<HeaderProps> = ({ menuToggle, setLoginState, setUserRole, setLoading, queuePlaying, setPlayingQueue, songs, setPlaylistName, userEmail, nowPlaying, setNowPlaying }) => {
    const [audioUrl, setAudioUrl] = useState('');
    const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);
    const [isCheckedMG, setIsCheckedMG] = useState<boolean>(false);
    const [nextPlaying, setNextPlaying] = useState<number>(1);
    const [currentTime, setCurrentTime] = useState('');

    const [isFavorite, setIsFavorite] = useState(false);

    const loadImage = async (id: number) => {
        const response = await axios.get(`/api/music/getSongImage/${id}`, {
            responseType: 'blob',
            withCredentials: true,
            headers: {
                'Accept': 'application/json',
            },
        });
        return URL.createObjectURL(response.data);
      };

    const loadMusic = async () => {
        if (queuePlaying === 0) {
            return;
        }

        setLoading(true);
        const response = await axios.get(`/api/music/getSongFile/${queuePlaying}`, {
            responseType: 'blob',
            withCredentials: true, 
        });
        const url = URL.createObjectURL(response.data);
        setAudioUrl(url);

        const isFavoriteResponse = await axios.get(`/api/Favourites/check/${queuePlaying}/${userEmail}`, {
            params: { songId: queuePlaying, userEmail: userEmail },
            withCredentials: true,
        });
        setIsFavorite(isFavoriteResponse.data.isFavorite);

        const image = await loadImage(queuePlaying); 
        setImageUrl(image);
        
        const currentIndex = songs.findIndex(song => song.ID === queuePlaying);
        const nextIndex = (currentIndex + 1) % songs.length;
        const nextSongId = songs[nextIndex]?.ID || 1;
        setNextPlaying(nextSongId);
        
        setNowPlaying(queuePlaying);
        setPlayingQueue(0);

        setLoading(false);
      };

    const loginOut = async () => {
        try {
            const response = await axios.get('/api/account/logout', {
                withCredentials: true
            });
      
            if (response.status === 200) {
                localStorage.setItem('loginState', 'false');
                setLoginState(false);
                //здесь был рома
                
                localStorage.setItem('userState', '');
                setUserRole('');
                
                window.location.href = '/login';
            }
        } catch (error) { console.log(error); }
      };

      const AudioEnded = () => {
        setPlayingQueue(nextPlaying);
    };

    const handleNextSong = () => {
        const currentIndex = songs.findIndex(song => song.ID === nowPlaying);
        const nextIndex = (currentIndex + 1) % songs.length;
        setPlayingQueue(songs[nextIndex].ID);
    };

    const handlePreviousSong = () => {
        const currentIndex = songs.findIndex(song => song.ID === nowPlaying);
        const prevIndex = (currentIndex - 1 + songs.length) % songs.length;
        setPlayingQueue(songs[prevIndex].ID);
    };

    const loadTime = async () => {
        try {
        
            const response = await axios.get('https://api.api-ninjas.com/v1/worldtime?timezone=Europe/Moscow', {
                headers: {
                    'X-Api-Key': 'Jdv5ln5s5ZzsUwsHdM1LKg==gNUynF4uss7m9ll4',
                },
            });
            const dateTime = response.data.datetime;
            setCurrentTime(dateTime);
        } catch (error) {
            console.error('Ошибка при получении timeapi:', error);
        }
    };

    
    const handleCheckboxChangeMG = () => {
        setIsCheckedMG(!isCheckedMG);
    };

    const [labelsGenre, setLabelsGenre] = useState<Label[]>([]);
    const [selectedLabelIdGenre, setSelectedLabelIdGenre] = useState('');

    const handleLabelChangeGenre = (id: number) => {
        const selectedLabel = labelsGenre.find(label => label.id === id);
        if (selectedLabel) {
            setSelectedLabelIdGenre(id.toString());
            setPlaylistName(selectedLabel.name);
            console.log('Выбран плейлист ', selectedLabel.name);
            setIsCheckedMG(!isCheckedMG);
        } else {
            setPlaylistName('');
        }
    };

    const loadGenres = async () => {
        try {
            const response = await axios.get('/api/music/getGenres', {
                withCredentials: true
            });
            setLabelsGenre(response.data);
        } catch (error) {
            console.error("Error fetching genres:", error);
        }
    };

    const handleFavorite = async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();

        try {
            const formData = new FormData();
            formData.append('songId', nowPlaying.toString());
            formData.append('userEmail', userEmail);

            if (isFavorite) {
                await axios.delete(`/api/Favourites`, { 
                    data: formData, 
                    withCredentials: true 
                });
                setIsFavorite(!isFavorite);
            } else {
                await axios.post(`/api/Favourites`, formData, {
                    withCredentials: true 
                });
                setIsFavorite(!isFavorite);
            }            
        } catch (error) {
            console.error("Ошибка при обновлении избранного: ", error);
        }
    };

    const heartClass = isFavorite ? 'fas fa-heart' : 'far fa-heart';
    const isFirstRender = useRef(true);

    useEffect(() => {
        if (isFirstRender.current) { 
            setIsCheckedMG(menuToggle); 
            isFirstRender.current = false;
        }
        loadMusic();
        loadGenres();
        loadTime();
    }, [queuePlaying, menuToggle]);

    return(
        <div>
            <header>
                <input type="checkbox" id="menu-toggle" style={{ display: 'none' }} checked={isCheckedMG} onChange={handleCheckboxChangeMG} />
                <label htmlFor="menu-toggle" className="playlist-check"> 
                    <i className="fas fa-bars"></i>
                </label>
                <p style={{position: 'absolute', left: '10%'}}>{currentTime}</p>
                <a href="/user">User</a>
                <a href="#" onClick={loginOut} >Logout</a>
            </header>
            {isCheckedMG && (
                <div className="playlist-container">
                    <div 
                        key={0} 
                        className={`playlist-item ${selectedLabelIdGenre === '0' ? 'active' : ''}`} 
                        onClick={() => {
                            setSelectedLabelIdGenre('0');
                            setPlaylistName('Favourite');
                            console.log('Выбран плейлист ', 'Favourite');
                            setIsCheckedMG(!isCheckedMG);
                        }}
                    >
                        Favourite
                    </div>
                    <hr style={{ margin: '5px 0' }} />
                        {labelsGenre.length > 0 && labelsGenre.map(label => (
                            <div 
                                key={label.id} 
                                className={`playlist-item ${selectedLabelIdGenre === label.id.toString() ? 'active' : ''}`} 
                                onClick={() => handleLabelChangeGenre(label.id)}
                            >
                                {label.name}
                            </div>
                        ))}
                </div>
            )}

            {(audioUrl) && (
                <footer>
                    {imageUrl && <img src={imageUrl} alt={`Тут ничего нет`} className="music-player"/>}
                    <audio key={queuePlaying} 
                    controls 
                    autoPlay={queuePlaying ? false: true}
                    style = {{width: '30%'}}
                    ref={(audioElement) => { if (audioElement) { 
                        audioElement.volume = 0.2; 
                        audioElement.addEventListener('ended', AudioEnded);
                    }
                    }}>
                        <source src={audioUrl} type="audio/mpeg" />
                        Your browser does not support the audio tag.
                    </audio>
                    <button onClick={handlePreviousSong} className='arrow-button'><i className="fas fa-chevron-left"></i></button>
                    <button onClick={handleNextSong} className='arrow-button'><i className="fas fa-chevron-right"></i></button>
                    <button onClick={handleFavorite} className='arrow-button'><i className={heartClass}></i></button>
                </footer>
            )}
        </div>
    )
}

export default Menu;