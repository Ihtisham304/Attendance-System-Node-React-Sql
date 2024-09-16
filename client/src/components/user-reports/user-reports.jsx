import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserReport = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [reportData, setReportData] = useState(null);
  const [message, setMessage] = useState('');


  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/admin/allusers`);
        setUsers(response.data.users);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();
  }, []);
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedUser || !fromDate || !toDate) {
      setMessage('Please fill in all fields');
      return;
    }
    setReportData(null)
    try {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/admin/user-report`, {
        params: { id: selectedUser, fromDate, toDate },
      });
      if (response.status === 200) {
        setReportData(response.data.report);
        setMessage('');
    }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setMessage('No attendance records found for the selected period.');
    } else {
        setMessage('Error generating report');
    }
    }
  };

  return (
    <div className='container'>
      <h2>Generate Attendance Report</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>User:</label>
          <select value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)} required>
            <option value="">Select a user</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.username}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>From Date:</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            required
          />
        </div>
        <div>
          <label>To Date:</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            required
          />
        </div>
        <button type="submit">Generate Report</button>
      </form>
      {message && <p>{message}</p>}
      {reportData && (
        <table className="table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {reportData.map((record, index) => (
              <tr key={index}>
                <td>{new Date(record.date).toLocaleDateString()}</td>
                <td>{record.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UserReport;
