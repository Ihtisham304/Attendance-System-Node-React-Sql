import React, { useState } from 'react';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";


const AttendanceMark = () => {
  const [status, setStatus] = useState('Present'); 
  const [message, setMessage] = useState('');
  const token = localStorage.getItem('token');
  
  const decodedToken = jwtDecode(token);
  const user_id = decodedToken.id;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/attendance/mark`, {
        user_id,
        status
      });

      setMessage(response.data.message); // Success message
    } catch (error) {
      if (error.response && error.response.data) {
        setMessage(error.response.data.message); // Error message from backend
      } else {
        setMessage('Error marking attendance.');
      }
    }
  };

  return (
    <div className="attendance-form">
      <h2>Mark Attendance</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Status:</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="Present">Present</option>
            <option value="Absent">Absent</option>
            <option value="Leave">Leave</option>
          </select>
        </div>
        <button type="submit">Mark Attendance</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
};

export default AttendanceMark;
