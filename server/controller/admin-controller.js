const db = require('../utilities/dbconnection');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.registerAdmin = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Check if the email is already registered
        const checkEmailSql = 'SELECT * FROM admin WHERE email = ?';
        db.query(checkEmailSql, [email], async (err, results) => {
            if (err) {
                return res.status(500).json({ message: "Error Checking Email", error: err });
            }

            if (results.length > 0) {
                // Return early if the email is already registered
                return res.status(400).json({ status: false, message: "User With This Email Already Exists" });
            }

            // If email does not exist, proceed with registration
            try {
                const hashedPassword = await bcrypt.hash(password, 10);
                const sql = `INSERT INTO admin (username,email,password) VALUES (?, ?, ?)`;
                const values = [username, email, hashedPassword];

                db.query(sql, values, (err, result) => {
                    if (err) {
                        return res.status(500).json({ message: 'Error registering admin', error: err });
                    }
                    return res.json({ status: true, message: 'admin registered successfully', result });
                });
            } catch (hashError) {
                return res.status(500).json({ message: 'Error hashing password', error: hashError });
            }
        });
    } catch (err) {
        return res.status(500).json({ message: 'Server error', error: err });
    }
}
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const checkEmailSql = "SELECT * FROM admin WHERE email = ?";
        db.query(checkEmailSql, [email], async (err, results) => {
            if (err) {
                return res.status(500).json({ message: "Error checking email", error: err });
            }
            if (results.length === 0) {
                return res.status(400).json({ status: false, message: "Incorrect Email" });
            }

            const admin = results[0];

            const passwordCheck = await bcrypt.compare(password, admin.password);
            if (!passwordCheck) {
                return res.status(400).json({ status: false, message: "Incorrect Password" });
            }
            const token = jwt.sign({ id: admin.id, email: admin.email }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });

            return res.json({ status: true, message: "Admin SuccessFully", token });
        })
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: err });
    }
}

//get all users

exports.getUsers = async (req, res) => {
    const getUsersQuery = 'SELECT id, username, profile_picture, email,grade FROM users'; // Adjust the fields based on your table structure

    db.query(getUsersQuery, (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Database error', error: err });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'No users found' });
        }

        res.status(200).json({ users: results });
    });
};

//get user attendance and user name from user table use join

exports.getUserAttendance = async (req, res) => {
    const getAttendanceQuery = `
        SELECT users.username,attendance.id, attendance.date, attendance.status 
        FROM attendance 
        JOIN users ON attendance.user_id = users.id
    `;

    db.query(getAttendanceQuery, (err, result) => {
        if (err) return res.status(500).json({ message: 'Database error', error: err });

        if (result.length === 0) {
            return res.status(404).json({ message: 'No attendance records found' });
        }

        res.status(200).json({ attendance: result });
    });
};

exports.getAttendanceById = async (req, res) => {
    const attendanceId = req.params.id;

    const query = `
        SELECT users.username, attendance.date, attendance.status 
        FROM attendance 
        JOIN users ON attendance.user_id = users.id 
        WHERE attendance.id = ?
    `;

    db.query(query, [attendanceId], (err, result) => {
        if (err) return res.status(500).json({ message: 'Database error', error: err });

        if (result.length === 0) {
            return res.status(404).json({ message: 'Attendance record not found' });
        }

        res.status(200).json({ attendance: result[0] });
    });
};
exports.updateAttendanceById = async (req, res) => {
    const attendanceId = req.params.id;
    const { status } = req.body;

    const updateQuery = `
        UPDATE attendance 
        SET status = ? 
        WHERE id = ?
    `;

    db.query(updateQuery, [status, attendanceId], (err, result) => {
        if (err) return res.status(500).json({ message: 'Error updating attendance', error: err });

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Attendance record not found' });
        }

        res.status(200).json({ message: 'Attendance updated successfully' });
    });
};
exports.deleteAttendanceById = async (req, res) => {
    const attendanceId = req.params.id;

    const deleteQuery = 'DELETE FROM attendance WHERE id = ?';

    db.query(deleteQuery, [attendanceId], (err, result) => {
        if (err) return res.status(500).json({ message: 'Database error', error: err });

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Attendance record not found' });
        }

        res.status(200).json({ message: 'Attendance deleted successfully' });
    });
};
exports.getUserReport = async (req, res) => {

    const { id, fromDate, toDate } = req.query;

    const reportQuery = `
        SELECT date, status FROM attendance 
        WHERE user_id = ? AND date BETWEEN ? AND ?
    `;



    db.query(reportQuery, [id, fromDate, toDate], (err, result) => {
        if (err) {

            return res.status(500).json({ message: 'Database error', error: err });
        }

        if (result.length === 0) {

            return res.status(404).json({ message: 'No attendance records found for this period.' });
        }


        res.status(200).json({ report: result });
    });
};

exports.getOverallReport = async (req, res) => {


    const { fromDate, toDate } = req.query;



    const reportQuery = `
        SELECT a.date, u.username, a.status 
        FROM attendance a
        JOIN users u ON a.user_id = u.id
        WHERE a.date BETWEEN ? AND ?
    `;


    db.query(reportQuery, [fromDate, toDate], (err, result) => {
        if (err) {

            return res.status(500).json({ message: 'Database error', error: err });
        }

        if (result.length === 0) {

            return res.status(404).json({ message: 'No attendance records found for this period.' });
        }


        res.status(200).json({ report: result });
    });
};

exports.approvedLeaveRequest = (err, result) => {
    if (err) {
        return res.status(500).json({ message: 'Database error', error: err });
    }

    if (status === 'Leave') {
        // Update attendance records to reflect leave
        const updateAttendanceQuery = `
        UPDATE attendance
        SET status = ?
        WHERE user_id = ? AND date BETWEEN ? AND ?
      `;
        db.query(updateAttendanceQuery, [status, userId, startDate, endDate], (err, result) => {
            if (err) {
                return res.status(500).json({ message: 'Database error', error: err });
            }
        });
    }

    res.status(200).json({ message: 'Leave request updated successfully.' });
}
exports.getAllLeaveRequests = (req, res) => {
    const getAllLeaveRequestsQuery = `
      SELECT lr.id, lr.user_id, lr.start_date, lr.end_date, lr.reason, lr.status, u.username
      FROM leave_requests lr
      JOIN users u ON lr.user_id = u.id
    `;

    db.query(getAllLeaveRequestsQuery, (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Database error', error: err });
        }

        res.status(200).json({ requests: result });
    });
};

exports.updateLeaveRequestStatus = (req, res) => {
    const { id } = req.params;
    const { approved } = req.body;


    const updateLeaveStatusQuery = `
      UPDATE leave_requests 
      SET status = ? 
      WHERE id = ?
    `;

    const newStatus = approved ? 'approved' : 'rejected'; 

    db.query(updateLeaveStatusQuery, [newStatus, id], (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Database error', error: err });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Leave request not found.' });
        }

        res.status(200).json({ message: `Leave request ${newStatus} successfully.` });
    });
};
