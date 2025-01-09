import React, { useState} from 'react';
import axios from 'axios';

interface LoginProps {
    setLoginState: (value: boolean) => void;
    setUserRole: (value: string) => void;
    setPhone: (value: string) => void;
    setFullName: (value: string) => void;
    setAddress: (value: string) => void;
    setEmail: (value: string) => void;
  }

const Login: React.FC<LoginProps> = ({ setLoginState, setUserRole, setPhone, setFullName, setAddress, setEmail }) => {

    const [userEmail, setUserEmail] = useState<string>('');
    const [userPassword, setUserPassword] = useState<string>('');
    const [errorAuth, setErrorAuth] = useState<string>('');

    const loginUser = async () => {
        const putString = {
          Email: userEmail,
          Password: userPassword,
        };
        
        try {
          const response = await axios.post('/api/account/login/', putString, {
            headers: {
              'Content-Type': 'application/json',
              'accept': 'application/json',
            },
            withCredentials: true,
          });
    
          const data = response.data;
    
          if (response.status === 200) {
            setLoginState(true);
            localStorage.setItem('loginState', 'true');

            setPhone(data.phone);
            localStorage.setItem('PhoneState', data.phone);
            setFullName(data.fullName);
            localStorage.setItem('FullNameState', data.fullName);
            setAddress(data.address);
            localStorage.setItem('AddressState', data.address );
            setEmail(data.email);
            localStorage.setItem('EmailState', data.email);

            if (Number(data.message) === 0) {
              setUserRole('Admin');
              localStorage.setItem('userState', 'Admin');
            } else {
              setUserRole('User');
              localStorage.setItem('userState', 'User');
            }

            window.location.href = '/';
          }
        } catch (error: any) { setErrorAuth(error.response.data.message); }
      };

    return (
      <div className='full-screen'>
        <div className="box">
            <h2>Вход на сайт</h2>
            <a href="/register"> Новенький? Регистрация </a>
            { errorAuth && <p style={{ color: '#ee204d' }}>{errorAuth}</p> }
            <label htmlFor="email">Введите Email</label>
            <input
                type="text"
                id="email"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
            />
            <label htmlFor="password">Введите пароль</label>
            <input
                type="password"
                id="password"
                value={userPassword}
                onChange={(e) => setUserPassword(e.target.value)}
            />
            <button onClick={loginUser}>Submit</button>
        </div>
      </div>
    );
};

export default Login;