import React from 'react';

interface UserCardsProps {
    Email: string; 
    Phone: string; 
    FullName: string; 
    Address: string;
}

const User: React.FC<UserCardsProps> = ({ Email, Phone, FullName, Address }) => {
    return (
        <div className='full-screen'><div className="box">
            <h1 style={{maxWidth: '80%'}}>Страница пользователя {FullName}</h1> <br/>
            <p>Электронная почта: {Email}</p>
            <p>Номер телефона: {Phone}</p>
            <p>Домашний адрес: {Address}</p>
        </div></div>
    );
};

export default User;