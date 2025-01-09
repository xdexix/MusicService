import React, { useState } from 'react';
import axios from 'axios';

interface GenreUploadProps {
}

const GenreUpload: React.FC<GenreUploadProps> = ({}) => {

    const [genreName, setGenreName] = useState<string>('');

    const Submit = async (event: React.FormEvent) => {
        event.preventDefault();
        
        if (genreName==='') {
            alert("Сначала заполните поле");
            return;
        }

        const formData = new FormData();
        formData.append('name', genreName);

        try {
            await axios.post('api/music/UploadGenre', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                withCredentials: true
            });
            alert("Новый обект Genre успешно загружен");
        } catch (error) {
            alert("Новый обект Genre не создан, причина: " + error);
        }
    };

    return (
        <div className='box'>
            <div>Название жанра Genre.Name</div>
            <input type="text" value={genreName} onChange={(e) => setGenreName(e.target.value)} /><br/><br/>

            <button onClick={Submit}>Отправить</button>
        </div>
    );
};

export default GenreUpload;