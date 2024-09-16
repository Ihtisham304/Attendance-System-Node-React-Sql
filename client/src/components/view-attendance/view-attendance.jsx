import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';

const ViewAttendance = () => {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchAttendance = async () => {
      const token = localStorage.getItem('token');
      const decodedToken = jwtDecode(token);
      const user_id = decodedToken.id;

      try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/view/attendance/${user_id}`);
        setAttendanceRecords(response.data.attendanceRecords);
      } catch (error) {
        if (error.response && error.response.data) {
          setMessage(error.response.data.message);
        } else {
          setMessage('Error fetching attendance records.');
        }
      }
    };

    fetchAttendance();
  }, []);

  return (
    <div className="view-attendance">
      <h2>Your Attendance Records</h2>
      {message && <p>{message}</p>}
      {attendanceRecords.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {attendanceRecords.map((record, index) => (
              <tr key={index}>
                <td>{new Date(record.date).toLocaleDateString()}</td>
                <td>{record.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No attendance records found.</p>
      )}
    </div>
  );
};

export default ViewAttendance;
