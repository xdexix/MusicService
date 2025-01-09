import React, { useState } from 'react';
import axios from 'axios';

interface LabelUploadProps {
}

const LabelUpload: React.FC<LabelUploadProps> = ({}) => {

    const [labelName, setLabelName] = useState<string>('');
    const [labelAddress, setLabelAddress] = useState<string>('');
    const [fileImageLabel, setImageLabel] = useState<File | null>(null);


    const handleLabelImageLink = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files ? event.target.files[0] : null;
        setImageLabel(selectedFile);
    };

    const Submit = async (event: React.FormEvent) => {
        event.preventDefault();
        
        if (!fileImageLabel || labelName==='' || labelAddress==='') {
            alert("Сначала заполните все поля");
            return;
        }

        const formData = new FormData();
        formData.append('name', labelName);
        formData.append('address', labelAddress);
        formData.append('image', fileImageLabel);

        try {
            await axios.post('api/music/UploadLabel', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                withCredentials: true
            });
            alert("Новый обект Label успешно загружен");
        } catch (error) {
            alert("Новый обект Label не создан, причина: " + error);
        }
    };

    return (
        <div className='box'>
            <div>Название лейбла Label.Name</div>
            <input type="text" value={labelName} onChange={(e) => setLabelName(e.target.value)} /><br/><br/>

            <div>Адрес фирмы Label.Address</div>
            <input type="text" value={labelAddress} onChange={(e) => setLabelAddress(e.target.value)} /><br/><br/>

            <div>Картинка лейбла Label.ImageLink</div>
            <input type="file" onChange={handleLabelImageLink} accept="image/*"/> <br/><br/>

            <button onClick={Submit}>Отправить</button>
        </div>
    );
};

export default LabelUpload;