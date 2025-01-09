import React, { useState} from 'react';
import axios from 'axios';

const Register: React.FC = () => {

    const [registEmail, setRegistEmail] = useState<string>('');
    const [registPassword, setRegistPassword] = useState<string>('');
    const [registAddress, setRegistAddress] = useState<string>('');
    const [registPhone, setRegistphone] = useState<string>('');
    const [registName, setRegistName] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [errorAuth, setErrorAuth] = useState<string>('');

    const registUser = async () => {
        const userData = {
          Email: registEmail,
          Password: registPassword,
          ConfirmPassword: confirmPassword,
          Phone: registPhone,
          FullName: registName,
          Address: registAddress,
        };
        
        try {
          const response = await axios.post('/api/account/register', userData, {
            headers: {
              'Content-Type': 'application/json',
              'accept': 'application/json',
            },
            withCredentials: true,
          });
    
          if (response.status === 200) {
            setErrorAuth('');
            alert(`Вы успешно зарегистрировались, ${registEmail}`);
            window.location.href = '/login';
          }
        } catch (error: any) { setErrorAuth(error.response.data.message); }
      };

    return (
    <div className='full-screen'>
        <div className="box">
            <h2>Регистрация</h2>
            <a href="/login"> Уже есть аккаунт? Войти </a>
            {errorAuth && <p style={{ color: '#ee204d' }}>{errorAuth}</p>}
              <label htmlFor="email">Введите Email</label>
              <input
                  type="text"
                  value={registEmail}
                  onChange={(e) => setRegistEmail(e.target.value)}
              />
              <label htmlFor="phone">Введите номер телефона</label>
              <input
                  type="tel"
                  value={registPhone}
                  onChange={(e) => setRegistphone(e.target.value)}
                  pattern="[0-9]*" 
                  required
              />
              <label htmlFor="name">Введите свое имя</label>
              <input
                  type="text"
                  value={registName}
                  onChange={(e) => setRegistName(e.target.value)}
              />
              <label htmlFor="email">Введите адрес</label>
              <input
                  type="text"
                  value={registAddress}
                  onChange={(e) => setRegistAddress(e.target.value)}
              />
              <label htmlFor="password">Введите пароль</label>
              <input
                  type="password"
                  value={registPassword}
                  onChange={(e) => setRegistPassword(e.target.value)}
              />
              <label htmlFor="password">Подтвердите пароль</label>
              <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
              /> 
            <button onClick={registUser}>Submit</button>
      </div>
    </div>
    );
};

export default Register;