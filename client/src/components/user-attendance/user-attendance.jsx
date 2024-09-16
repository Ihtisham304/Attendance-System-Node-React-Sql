import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';

const UserAttendance = () => {
    const [attendanceRecords, setAttendanceRecords] = useState([]); 
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState(null); 

    
    useEffect(() => {
        const fetchAttendance = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/admin/attendance`);
                setAttendanceRecords(response.data.attendance);
                console.log(response.data.attendance); 
                setLoading(false); 
            } catch (err) {
                setError('Error fetching attendance records.'); 
                setLoading(false);
            }
        };

        fetchAttendance();
    }, []); 
    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this record?");
        if (!confirmDelete) return; 

        try {
            await axios.delete(`${import.meta.env.VITE_BASE_URL}/admin/delete/attendance/${id}`);
            setAttendanceRecords(attendanceRecords.filter(record => record.id !== id)); 
        } catch (err) {
            setError('Error deleting attendance record.');
        }
    };

    if (loading) return <p>Loading attendance records...</p>; 
    if (error) return <p>{error}</p>; 

    return (
        <div className='container'>
            <h2>All Users</h2>
            <table className="table">
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>Attendance Date</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {attendanceRecords.length > 0 ? (
                        attendanceRecords.map((record, index) => (
                            <tr key={index}>
                                <td>{record.username}</td> 
                                <td>{new Date(record.date).toLocaleDateString()}</td> 
                                <td>{record.status}</td> 
                                <td>
                                   <span>
                                     <Link to={`/edit/attendance/${record.id}`} className="btn btn-primary">edit</Link>
                                     <button className='btn btn-danger' onClick={()=>handleDelete(record.id)}>delete</button>
                                   </span>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4">No attendance records found.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default UserAttendance