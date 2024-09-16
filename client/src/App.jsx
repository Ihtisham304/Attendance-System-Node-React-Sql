import React, { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route,Navigate } from 'react-router-dom'
import Start from './pages/start/start'
import UserRegistration from './pages/user-registration/user-registration'
import AdminLogin from './pages/admin-login/admin-login'
import AdminPanel from './pages/admin-panel/admin-panel'
import EditAttendance from './pages/edit-attendance/edit-attendance'



const App = () => {
  const [adminToken,setAdminToken] = useState(null);
  useEffect(()=>{
     const storedToken = localStorage.getItem('adminToken');
     if (storedToken) {
      setAdminToken(storedToken);
     }
  },[])
  return (
    <>
      <BrowserRouter>
        <Routes>
        <Route
          path="/admin/login"
          element={adminToken ? <Navigate to="/admin/panel" /> : <AdminLogin />}
        />
        <Route
          path="/admin/panel"
          element={adminToken ? <AdminPanel /> : <Navigate to="/admin/login" />}
        />
        <Route path="/" element={<Start />}></Route>
        <Route path="/user/register" element={<UserRegistration />}></Route>
         <Route path='/edit/attendance/:id' element={<EditAttendance />}></Route> 
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App