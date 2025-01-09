import React, { useState } from 'react';
import MusicUpload from './admin/Music';
import LabelUpload from './admin/Label';
import AuthorUpload from './admin/Author';
import GenreUpload from './admin/Genre';
import SongAuthorUpload from './admin/SongAuthor';
import SongGenreUpload from './admin/SongGenres';

interface SongUploadProps {
}

const SongUpload: React.FC<SongUploadProps> = ({}) => {

    const [isCheckedLabel, setIsCheckedLabel] = useState<boolean>(false);
    const handleCheckboxChangeLabel = () => {
        setIsCheckedLabel(!isCheckedLabel);
    }

    const [isCheckedMusic, setIsCheckedMusic] = useState<boolean>(false);
    const handleCheckboxChangeMusic = () => {
        setIsCheckedMusic(!isCheckedMusic);
    };

    const [isCheckedAuthor, setIsCheckedAuthor] = useState<boolean>(false);
    const handleCheckboxChangeAuthor = () => {
        setIsCheckedAuthor(!isCheckedAuthor);
    };

    const [isCheckedGenre, setIsCheckedGenre] = useState<boolean>(false);
    const handleCheckboxChangeGenre = () => {
        setIsCheckedGenre(!isCheckedGenre);
    };

    const [isCheckedMA, setIsCheckedMA] = useState<boolean>(false);
    const handleCheckboxChangeMA = () => {
        setIsCheckedMA(!isCheckedMA);
    };

    const [isCheckedMG, setIsCheckedMG] = useState<boolean>(false);
    const handleCheckboxChangeMG = () => {
        setIsCheckedMG(!isCheckedMG);
    };

    return (
        <div className='admin-screen'>
            <div className="box">
                <p>Новая песня Music</p>
                <input type="checkbox" checked={isCheckedMusic} onChange={handleCheckboxChangeMusic} />
                {isCheckedMusic && <MusicUpload/>}
            </div>

            <div className="box">
                <p>Новый лейбл Label</p>
                <input type="checkbox" checked={isCheckedLabel} onChange={handleCheckboxChangeLabel} />
                {isCheckedLabel && <LabelUpload/>}
            </div>

            <div className="box">
                <p>Новый исполнитель Author</p>
                <input type="checkbox" checked={isCheckedAuthor} onChange={handleCheckboxChangeAuthor} />
                {isCheckedAuthor && <AuthorUpload/>}
            </div>

            <div className="box">
                <p>Новый жанр Genre</p>
                <input type="checkbox" checked={isCheckedGenre} onChange={handleCheckboxChangeGenre} />
                {isCheckedGenre && <GenreUpload/>}
            </div>

            <div className="box">
                <p>Добавить исполнителя к песне</p>
                <input type="checkbox" checked={isCheckedMA} onChange={handleCheckboxChangeMA} />
                {isCheckedMA && <SongAuthorUpload/>}
            </div>

            <div className="box">
                <p>Добавить жанр к песне</p>
                <input type="checkbox" checked={isCheckedMG} onChange={handleCheckboxChangeMG} />
                {isCheckedMG && <SongGenreUpload/>}
            </div>
        </div>
    );
};

export default SongUpload;