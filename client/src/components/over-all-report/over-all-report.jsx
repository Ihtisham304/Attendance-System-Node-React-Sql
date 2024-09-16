import React, { useState } from 'react';
import axios from 'axios';

const OverAllReport = () => {
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [reportData, setReportData] = useState(null);
    const [message, setMessage] = useState('');
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      if (!fromDate || !toDate) {
        setMessage('Please fill in both dates');
        return;
      }
      setReportData(null);
      try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/admin/overall-report`, {
          params: { fromDate, toDate },
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
        <h2>Generate Overall Attendance Report</h2>
        <form onSubmit={handleSubmit}>
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
                <th>Username</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {reportData.map((record, index) => (
                <tr key={index}>
                  <td>{new Date(record.date).toLocaleDateString()}</td>
                  <td>{record.username}</td>
                  <td>{record.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    );
}

export default OverAllReport