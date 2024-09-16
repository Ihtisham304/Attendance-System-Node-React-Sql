import React from 'react'
import { useState } from 'react';
import AdminDashboard from '../admin-dashboard/admin-dashboard';
import UserAttendance from '../../components/user-attendance/user-attendance';
import UserReport from '../../components/user-reports/user-reports';
import OverAllReport from '../../components/over-all-report/over-all-report';
import AllLeaveRequests from '../../components/admin-Leave-Requests/all-leave-requests';

const AdminPanel = () => {
  const [route, setRoute] = useState('/admin/dashboard'); // Set default route to Dashboard

  const forDashboard = () => {
    setRoute('/admin/dashboard');
  };
  const forViewAttendance = () => {
    setRoute('/admin/viewattendace');
  };
  const forUserReport = () => {
    setRoute('/admin/user-report');
  };
  const forOverAllReport = () => {
    setRoute('/admin/overall-report');
  };
  const forAllLeaveRequests = () => {
    setRoute('/admin/all-requests');
  };
  const logOUt = () => {
    localStorage.removeItem('adminToken');
    window.location.reload();
  }

  return (
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
              <button onClick={forViewAttendance} className='nav-link w-100 d-flex text-white'>
                <i className='bi bi-speedometer fs-5 me-2'></i>
                <span>View Attendance</span>
              </button>
            </li>
            <li className='nav-item p-2 w-100'>
              <button onClick={forUserReport} className='nav-link w-100 d-flex text-white'>
                <i className='bi bi-speedometer fs-5 me-2'></i>
                <span>User Report</span>
              </button>
            </li>
            <li className='nav-item p-2 w-100'>
              <button onClick={forOverAllReport} className='nav-link w-100 d-flex text-white'>
                <i className='bi bi-speedometer fs-5 me-2'></i>
                <span>Overall Report</span>
              </button>
            </li>
            <li className='nav-item p-2 w-100'>
              <button onClick={forAllLeaveRequests} className='nav-link w-100 d-flex text-white'>
                <i className='bi bi-speedometer fs-5 me-2'></i>
                <span>All Leave Requests</span>
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
  )
}
const Content = ({ route }) => {
  return (
    <div>
      {route === '/admin/dashboard' ? (
        <AdminDashboard />
      ) : route === '/admin/viewattendace' ? (<UserAttendance />) 
        : route === '/admin/user-report' ? (<UserReport />)
        :route === '/admin/overall-report'? (<OverAllReport />)
        :route === '/admin/all-requests'? (<AllLeaveRequests />)
        :(<p>No matching route found</p>)}
    </div>
  );
};

export default AdminPanel