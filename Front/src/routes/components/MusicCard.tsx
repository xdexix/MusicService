import React, { useEffect, useState } from 'react';
import './MusicCard.css';
import Song from '../Song';
import axios from 'axios';

interface UserCardsProps {
    obj: Song;
}

const MusicPlayer: React.FC<UserCardsProps> = ({ obj }) => {
    const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);

    const loadImage = async (id: number) => {

        const response = await axios.get(`/api/music/getSongImage/${id}`, {
            responseType: 'blob',
            withCredentials: true,
        });
        return URL.createObjectURL(response.data);
      };

    useEffect(() => {
        const fetchImage = async () => {
            if (obj.ID) {
                if (imageUrl === null || imageUrl === undefined)
                {
                    const url = await loadImage(obj.ID);
                    setImageUrl(url);
                }
            }
        };

        fetchImage();
    }, []);

    return (
        <td>
            <div className='music-card'>
                <i className="btn-play fa-solid fa-play"></i>
                {imageUrl && <img src={imageUrl} alt={`${obj.name}`} className="music-image"/>}
                <p className="music-name">{obj.authorName} — {obj.name}</p>
                <p>{obj.albumName}</p>
                <p style={{ fontStyle: 'italic', opacity: '0.6' }}>{obj.genre}</p>
            </div>
        </td>
    );
};

export default MusicPlayer;