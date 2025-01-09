import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface SongAuthorUploadProps {
}

interface Label {
    id: number;
    name: string;
}


const SongAuthorUpload: React.FC<SongAuthorUploadProps> = ({}) => {

    const [labelsSong, setLabelsSong] = useState<Label[]>([]);
    const [selectedLabelIdSong, setSelectedLabelIdSong] = useState('');

    const [labelsAuthor, setLabelsAuthor] = useState<Label[]>([]);
    const [selectedLabelIdAuthor, setSelectedLabelIdAuthor] = useState('');

    const handleLabelChangeSong = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedLabelIdSong(event.target.value);
    };

    const handleLabelChangeAuthor = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedLabelIdAuthor(event.target.value);
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
            const response = await axios.get('/api/music/getAuthors', {
                withCredentials: true
            });
            setLabelsAuthor(response.data);
        } catch (error) {
            console.error("Error fetching authors:", error);
        }
    };

    const Submit = async (event: React.FormEvent) => {
        event.preventDefault();
        
        if (selectedLabelIdSong==='' || selectedLabelIdAuthor==='') {
            alert("Сначала заполните все поля");
            return;
        }

        const formData = new FormData();
        formData.append('musicId', selectedLabelIdSong);
        formData.append('authorId', selectedLabelIdAuthor);

        try {
            await axios.post('api/music/UploadSongAuthor', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                withCredentials: true
            });
            alert("Новый обект MA успешно загружен");
        } catch (error) {
            alert("Новый обект MA не создан, причина: " + error);
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

            <div>Выбор исполнителя Author.Name</div>
            <select id="dropdown" value={selectedLabelIdAuthor} onChange={handleLabelChangeAuthor}>
                <option value="">Выберите...</option>
                {labelsAuthor.map(labelsAuthor => (
                    <option key={labelsAuthor.id} value={labelsAuthor.id}>{labelsAuthor.name}</option>
                ))}
            </select> <br/><br/>

            <button onClick={Submit}>Отправить</button>
        </div>
    );
};

export default SongAuthorUpload;