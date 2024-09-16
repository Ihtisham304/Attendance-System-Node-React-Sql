import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const EditAttendance = () => {
    const { id } = useParams();
    const [attendance, setAttendance] = useState(null); 
    const [status, setStatus] = useState(''); 
    const [error, setError] = useState(null); 
    const navigate = useNavigate();
  
   
    useEffect(() => {
      const fetchAttendance = async () => {
        try {
          const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/admin/attendance/${id}`);
          setAttendance(response.data.attendance); 
          setStatus(response.data.attendance.status);
        } catch (err) {
          setError('Error fetching attendance record.');
        }
      };
  
      fetchAttendance();
    }, [id]);
  
   
    const handleSubmit = async (e) => {
      e.preventDefault();
  
      try {
        await axios.put(`${import.meta.env.VITE_BASE_URL}/admin/attendance/${id}`, { status });
        navigate('/admin/panel'); 
      } catch (error) {
        setError('Error updating attendance record.');
      }
    };

  
    if (!attendance) return <p>Loading...</p>; 
    if (error) return <p>{error}</p>;
  
    return (
      <div className="container">
        <h2>Edit Attendance for {attendance.username}</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Status:</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
              <option value="Leave">Leave</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary">Update Attendance</button>
        </form>
      </div>
    );
}

export default EditAttendance