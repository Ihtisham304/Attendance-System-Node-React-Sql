import React from 'react'
import { useState } from 'react';
import UserDashboard from '../user-dashboard/user-dashboard';
import './sidebar.css'
import { IoSpeedometerOutline } from "react-icons/io5";
import ViewAttendance from '../../components/view-attendance/view-attendance';
import EditProfilePicture from '../../components/edit-profile-picture/edit-profile-picture';
import LeaveRequest from '../../components/leave-request/leave-request';

const UserPanel = () => {
  const [route, setRoute] = useState('/user/dashboard'); // Set default route to Dashboard

  const forDashboard = () => {
    setRoute('/user/dashboard');
  };
  const forViewAttendace = () => {
    setRoute('/user/view/attendance');
  };
  const forEditProfilePicture = () => {
    setRoute('/user/edit/profile');
  };
  const forLeaveRequest = () => {
    setRoute('/user/leave/request');
  };
  const logOUt = () => {
    localStorage.removeItem('token');
    window.location.reload();
  }
  return (
    <>
      <div className='d-flex w-100'>
        <div className='sidebar d-flex vh-100 pt-4'>
          <div className='w-100'>
            <ul className='nav nav-pills flex-column p-0 m-0 w-100'>
              <li className='nav-item p-2 w-100'>
                <button onClick={forDashboard} className='nav-link w-100 d-flex text-white'>
                <i className='bi bi-speedometer fs-5 me-2'></i>
                  <span>Dashboard</span>
                </button>
              </li>
              <li className='nav-item p-2 w-100'>
                <button onClick={() => { }} className='nav-link w-100 d-flex text-white'>
                  <i className='bi bi-speedometer fs-5 me-2'></i>
                  <span onClick={forViewAttendace}>View Attendance</span>
                </button>
              </li>
              <li className='nav-item p-2 w-100'>
                <button onClick={() => { }} className='nav-link w-100 d-flex text-white'>
                  <i className='bi bi-speedometer fs-5 me-2'></i>
                  <span onClick={forEditProfilePicture}>Edit Profile Picture</span>
                </button>
              </li>
              <li className='nav-item p-2 w-100'>
                <button onClick={() => { }} className='nav-link w-100 d-flex text-white'>
                  <i className='bi bi-speedometer fs-5 me-2'></i>
                  <span onClick={forLeaveRequest}>Leave Request</span>
                </button>
              </li>
              <li className='nav-item p-2 w-100'>
                <button onClick={() => {
                  logOUt();
                }} className='nav-link w-100 d-flex text-white'>
                  <i className='bi bi-speedometer fs-5 me-2'></i>
                  <span>Logout</span>
                </button>
              </li>
            </ul>
          </div>
        </div>
        <Content route={route} />
      </div >
    </>
  )
}
const Content = ({ route }) => {
  return (
    <div>
      {route === '/user/dashboard' ? (
        <UserDashboard />
      ) : route === '/user/view/attendance' ? (<ViewAttendance />)
        : route === '/user/edit/profile' ? (<EditProfilePicture />)
        : route === '/user/leave/request'? (<LeaveRequest />)
      : (
            <p>No matching route found</p>
          )}
    </div>
  );
};

export default UserPanel