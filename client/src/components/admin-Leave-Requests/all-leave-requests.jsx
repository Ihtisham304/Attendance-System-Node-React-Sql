import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AllLeaveRequests = () => {
  const [requests, setRequests] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/admin/all-requests`);
        setRequests(response.data.requests);
      } catch (error) {
        setMessage('Error fetching leave requests.');
      }
    };
    fetchRequests();
  }, []);

  const handleApproval = async (requestId, approved) => {
    try {
      await axios.post(`${import.meta.env.VITE_BASE_URL}/admin/leave-request/${requestId}`, {
        approved,
      });
      setRequests(requests.filter(request => request.id !== requestId));
      setMessage('Leave request updated.');
    } catch (error) {
      setMessage('Error updating leave request.');
    }
  };

  return (
    <div>
      <h2>Leave Requests</h2>
      {message && <p>{message}</p>}
      <table>
        <thead>
          <tr>
            <th>User</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Reason</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((request) => (
            <tr key={request.id}>
              <td>{request.username}</td>
              <td>{new Date(request.start_date).toLocaleDateString()}</td>
              <td>{new Date(request.end_date).toLocaleDateString()}</td>
              <td>{request.reason}</td>
              <td>
                <button onClick={() => handleApproval(request.id, true)}>Approve</button>
                <button onClick={() => handleApproval(request.id, false)}>Reject</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AllLeaveRequests