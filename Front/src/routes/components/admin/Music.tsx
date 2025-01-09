import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface MusicUploadProps {
}

interface Label {
    id: number;
    name: string;
}


const MusicUpload: React.FC<MusicUploadProps> = ({}) => {

    const [songName, setSongName] = useState<string>('');
    const [songAlbumName, setAlbumName] = useState<string>('');
    const [fileSong, setSong] = useState<File | null>(null);    
    const [fileImageSong, setImageSong] = useState<File | null>(null);
    const [songYear, setYear] = useState<string>('');

    const [labels, setLabels] = useState<Label[]>([]);
    const [selectedLabelId, setSelectedLabelId] = useState('');

    const handleMusicLink = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files ? event.target.files[0] : null;
        setSong(selectedFile);
    };

    const handleSongImageLink = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files ? event.target.files[0] : null;
        setImageSong(selectedFile);
    };

    const handleLabelChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
            setSelectedLabelId(event.target.value);
        };

    const fetchLabels = async () => {
        try {
            const response = await axios.get('/api/music/getLabels', {
                withCredentials: true
            });
            setLabels(response.data);
        } catch (error) {
            console.error("Error fetching labels:", error);
        }
    };

    const Submit = async (event: React.FormEvent) => {
        event.preventDefault();
        
        if (songName==='' || songAlbumName==='' || !fileSong || !fileImageSong || songYear==='' || selectedLabelId==='') {
            alert("Сначала заполните все поля");
            return;
        }

        const formData = new FormData();
        formData.append('name', songName);
        formData.append('albumName', songAlbumName);
        formData.append('imageLink', fileImageSong);
        formData.append('musicLink', fileSong);
        formData.append('year', songYear);
        formData.append('label', selectedLabelId);

        try {
            await axios.post('api/music/UploadSong', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                withCredentials: true
            });
            alert("Новый обект Music успешно загружен");
        } catch (error) {
            alert("Новый обект Music не создан, причина: " + error);
        }
    };

    useEffect(() => {
        fetchLabels();
    }, []);

    return (
        <div className='box'>
            <div>Название песни Music.Name</div>
            <input type="text" value={songName} onChange={(e) => setSongName(e.target.value)} /><br/><br/>

            <div>Название альбома Music.AlbumName</div>
            <input type="text" value={songAlbumName} onChange={(e) => setAlbumName(e.target.value)} /><br/><br/>

            <div>Обложка песни Music.ImageLink</div>
            <input type="file" onChange={handleSongImageLink} accept="image/*"/> <br/><br/>

            <div>Файл песни Music.MusicLink</div>
            <input type="file" onChange={handleMusicLink} accept="audio/*"/> <br/><br/>

            <div>Год выхода песни Music.Year</div>
            <input type="number" value={songYear} onChange={(e) => setYear(e.target.value)} /><br/><br/>

            <div>Звукозаписывающая студия Music.Label</div>
            <select id="dropdown" value={selectedLabelId} onChange={handleLabelChange}>
                <option value="">Выберите...</option>
                {labels.map(label => (
                    <option key={label.id} value={label.id}>{label.name}</option>
                ))}
            </select> <br/><br/>

            <button onClick={Submit}>Отправить</button>
        </div>
    );
};

export default MusicUpload;