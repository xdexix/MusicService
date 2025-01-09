import React, { useState} from 'react';

import Content from './components/Content'
import Menu from './components/Menu'
import Song from './Song'
import SongUpload from './components/SongUpload'

interface RootProps {
    setLoginState: (value: boolean) => void;
    loginState: boolean;
    setUserRole: (value: string) => void;
    userRole: string;
    userEmail: string;
  }

const Root: React.FC<RootProps> = ({ loginState, userRole, setLoginState, setUserRole, userEmail }) => {

    const [songs, setSongs] = useState<Song[]>([]);

    const [loading, setLoading] = useState<boolean>(false);
    const [queue, setQueue] = useState<number>(0);
    const [nowPlaying, setNowPlaying] = useState<number>(0);

    const [playlistName, setPlaylistName] = useState<string | null>(null);

    return (
        <div>
        {loginState ? (
          <>
            <Menu menuToggle={userRole === 'User'} setLoginState={setLoginState} setUserRole={setUserRole} setLoading={setLoading} queuePlaying={queue} setPlayingQueue={setQueue} songs={songs} setPlaylistName={setPlaylistName} userEmail={userEmail} nowPlaying={nowPlaying} setNowPlaying={setNowPlaying}/>
            {loading && <img src={'loag.gif'} alt={`Тут ничего нет`} className="info" />}
            { userRole === 'Admin' && <SongUpload /> }
            { userRole === 'User' && <Content setPlaying={setQueue} setLoading={setLoading} songs={songs} setSongs={setSongs} playlistName={playlistName} userEmail={userEmail} setPlaylistName={setPlaylistName} isPlaying={nowPlaying ? true: false}/> }
          </> 
        ) : (
        <div className={'full-screen'}> <div className='box'>
          <p>Вы не залогинены!</p>
          <a href="/login"> Войти </a>
        </div> </div>)}
      </div>
    );
};

export default Root;