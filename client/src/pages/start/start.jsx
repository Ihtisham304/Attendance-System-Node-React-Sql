import React, { useState ,useEffect} from 'react'
import UserLogin from '../user-login/user-login';
import UserPanel from '../user-panel/user-panle';

const Start = () => {
  const [token,setToken] = useState('');
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  return (
    <>
     {
      !token?  <UserLogin setToken={setToken}/> : <UserPanel />
     }
    </>
  )
}

export default Start