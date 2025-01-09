import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'
import { useState, useEffect} from 'react';

import Login from './routes/Login';
import Register from './routes/Register';
import Root from './routes/Root';
import User from './routes/User';

import './colors.css'

function App() {

  const [loginState, setLoginState] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<string>('');

  const [FullName, setFullName] = useState<string>('');
  const [Address, setAddress] = useState<string>('');
  const [Phone, setPhone] = useState<string>('');
  const [Email, setEmail] = useState<string>('');

  useEffect(() => {
    const savedLoginState = localStorage.getItem('loginState');
    const savedUserState = localStorage.getItem('userState');

    setLoginState(savedLoginState === 'true');

    if (savedUserState === 'Admin') {
      setUserRole('Admin');
    } else {
      setUserRole('User');
    }
    const savedEmailState = localStorage.getItem('EmailState');
    const savedPhoneState = localStorage.getItem('PhoneState');
    const savedFullNameState = localStorage.getItem('FullNameState');
    const savedAddressState = localStorage.getItem('AddressState');

    setEmail(savedEmailState || '');
    setPhone(savedPhoneState || '');
    setFullName(savedFullNameState || '');
    setAddress(savedAddressState || '');
  }, []);

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={ <Login setLoginState={setLoginState} setUserRole={setUserRole} 
                    setEmail={setEmail} setPhone={setPhone} setFullName={setFullName} setAddress={setAddress}/> }
        />
        <Route
          path="/register"
          element={ <Register/> }
        />
        <Route
          path="/"
          element={ <Root loginState={loginState}       userRole={userRole} 
                          setLoginState={setLoginState} setUserRole={setUserRole}
                          userEmail={Email} />}
        />
          <Route
          path="/user"
          element={ <User Email={Email} Phone={Phone} FullName={FullName} Address={Address}/> }
        />
      </Routes>
    </Router>
  )
}

export default App
