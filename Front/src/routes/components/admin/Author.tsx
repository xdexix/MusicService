import React, { useState } from 'react';
import axios from 'axios';

interface AuthorUploadProps {
}

const AuthorUpload: React.FC<AuthorUploadProps> = ({}) => {

    const [authorName, setAuthorName] = useState<string>('');
    const [authorDescription, setAuthorDescription] = useState<string>('');
    const [fileImageAuthor, setImageAuthor] = useState<File | null>(null);


    const handleAuthorImageLink = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files ? event.target.files[0] : null;
        setImageAuthor(selectedFile);
    };

    const Submit = async (event: React.FormEvent) => {
        event.preventDefault();
        
        if (!fileImageAuthor || authorName==='' || authorDescription==='') {
            alert("Сначала заполните все поля");
            return;
        }

        const formData = new FormData();
        formData.append('name', authorName);
        formData.append('description', authorDescription);
        formData.append('image', fileImageAuthor);

        try {
            await axios.post('api/music/UploadAuthor', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                withCredentials: true
            });
            alert("Новый обект Author успешно загружен");
        } catch (error) {
            alert("Новый обект Author не создан, причина: " + error);
        }
    };

    return (
        <div className='box'>
            <div>Имя исполнителя Author.Name</div>
            <input type="text" value={authorName} onChange={(e) => setAuthorName(e.target.value)} /><br/><br/>

            <div>Описание исполнителя Author.Description</div>
            <input type="text" value={authorDescription} onChange={(e) => setAuthorDescription(e.target.value)} /><br/><br/>

            <div>Картинка исполнителя Author.ImageLink</div>
            <input type="file" onChange={handleAuthorImageLink} accept="image/*"/> <br/><br/>

            <button onClick={Submit}>Отправить</button>
        </div>
    );
};

export default AuthorUpload;