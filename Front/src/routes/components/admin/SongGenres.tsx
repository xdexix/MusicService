import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface SongGenreUploadProps {
}

interface Label {
    id: number;
    name: string;
}


const SongGenreUpload: React.FC<SongGenreUploadProps> = ({}) => {

    const [labelsSong, setLabelsSong] = useState<Label[]>([]);
    const [selectedLabelIdSong, setSelectedLabelIdSong] = useState('');

    const [labelsGenre, setLabelsGenre] = useState<Label[]>([]);
    const [selectedLabelIdGenre, setSelectedLabelIdGenre] = useState('');

    const handleLabelChangeSong = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedLabelIdSong(event.target.value);
    };

    const handleLabelChangeGenre = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedLabelIdGenre(event.target.value);
    };

    const fetchLists = async () => {
        try {
            const response = await axios.get('/api/music/getMusics', {
                withCredentials: true
            });
            setLabelsSong(response.data);
        } catch (error) {
            console.error("Error fetching songs:", error);
        }
        
        try {
            const response = await axios.get('/api/music/getGenres', {
                withCredentials: true
            });
            setLabelsGenre(response.data);
        } catch (error) {
            console.error("Error fetching genres:", error);
        }
    };

    const Submit = async (event: React.FormEvent) => {
        event.preventDefault();
        
        if (selectedLabelIdSong==='' || selectedLabelIdGenre==='') {
            alert("Сначала заполните все поля");
            return;
        }

        const formData = new FormData();
        formData.append('musicId', selectedLabelIdSong);
        formData.append('genreId', selectedLabelIdGenre);

        try {
            await axios.post('api/music/UploadSongGenre', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                withCredentials: true
            });
            alert("Новый обект GA успешно загружен");
        } catch (error) {
            alert("Новый обект GA не создан, причина: " + error);
        }
    };

    useEffect(() => {
        fetchLists();
    }, []);

    return (
        <div className='box'>
            <div>Выбор песни Music.Name</div>
            <select id="dropdown" value={selectedLabelIdSong} onChange={handleLabelChangeSong}>
                <option value="">Выберите...</option>
                {labelsSong.map(labelsSong => (
                    <option key={labelsSong.id} value={labelsSong.id}>{labelsSong.name}</option>
                ))}
            </select> <br/><br/>

            <div>Выбор жанра Genre.Name</div>
            <select id="dropdown" value={selectedLabelIdGenre} onChange={handleLabelChangeGenre}>
                <option value="">Выберите...</option>
                {labelsGenre.map(labelsGenre => (
                    <option key={labelsGenre.id} value={labelsGenre.id}>{labelsGenre.name}</option>
                ))}
            </select> <br/><br/>

            <button onClick={Submit}>Отправить</button>
        </div>
    );
};

export default SongGenreUpload;