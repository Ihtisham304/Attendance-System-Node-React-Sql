require("dotenv").config();
const db = require('../utilities/dbconnection');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");


exports.registerUser = async (req, res) => {
    const { username, password, email } = req.body;
    let profile_picture = req.file ? req.file.filename : null;
    try {
        // Check if the email is already registered
        const checkEmailSql = 'SELECT * FROM users WHERE email = ?';
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
                const sql = `INSERT INTO users (username, password, email, profile_picture) VALUES (?, ?, ?, ?)`;
                const values = [username, hashedPassword, email, profile_picture];

                db.query(sql, values, (err, result) => {
                    if (err) {
                        return res.status(500).json({ message: 'Error registering user', error: err });
                    }
                    return res.json({ status: true, message: 'User registered successfully', result });
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
        const checkEmailSql = "SELECT * FROM users WHERE email = ?";
        db.query(checkEmailSql, [email], async (err, results) => {
            if (err) {
                return res.status(500).json({ message: "Error checking email", error: err });
            }
            if (results.length === 0) {
                return res.status(400).json({ status: false, message: "User With This Email Is Not Registered" });
            }

            const user = results[0];

            const passwordCheck = await bcrypt.compare(password, user.password);
            if (!passwordCheck) {
                return res.status(400).json({ status: false, message: "Incorrect Password" });
            }
            const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });

            return res.json({ status: true, message: "User Login SuccessFully", token });
        })
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: err });
    }
}

exports.markAttendance = async (req, res) => {
    const { user_id, status } = req.body;
    const today = new Date().toISOString().split('T')[0];

    const checkAttendanceQuery = 'SELECT * FROM attendance WHERE user_id = ? AND date = ?';

    db.query(checkAttendanceQuery, [user_id, today], (err, result) => {
        if (err) return res.status(500).json({ message: 'Database error', error: err });

        if (result.length > 0) {
            return res.status(400).json({ message: 'Attendance already marked for today' });
        }
        const markAttendanceQuery = 'INSERT INTO attendance (user_id, date, status) VALUES (?, ?, ?)';
        db.query(markAttendanceQuery, [user_id, today, status], (err, result) => {
            if (err) return res.status(500).json({ message: 'Error marking attendance', error: err });
            res.status(200).json({ message: 'Attendance marked successfully' });
        });
    })

}
// Controller to view all attendance records for a user
exports.viewAttendance = async (req, res) => {
    const { user_id } = req.params;

    const viewAttendanceQuery = 'SELECT * FROM attendance WHERE user_id = ? ORDER BY date DESC';

    db.query(viewAttendanceQuery, [user_id], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Database error', error: err });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'No attendance records found' });
        }

        res.status(200).json({ attendanceRecords: results });
    });
};
exports.getProfilePicture = async (req, res) => {
    const { user_id } = req.params;
    const getUserQuery = 'SELECT profile_picture FROM users WHERE id = ?';

    db.query(getUserQuery, [user_id], (err, result) => {
        if (err) return res.status(500).json({ message: 'Error fetching profile picture' });
        if (result.length === 0) return res.status(404).json({ message: 'User not found' });

        res.json({ profilePicture: result[0].profile_picture });
    });
}
exports.updateProfilePicture = async (req, res) => {
    const { user_id } = req.params;
    let new_picture = req.file ? req.file.filename : null;
    const updatequery = 'UPDATE users SET profile_picture = ? WHERE id = ?'

    db.query(updatequery, [new_picture, user_id], (err) => {
        if (err) {
            console.error('Error updating profile picture:', err);
            return res.status(500).json({ message: 'Error updating profile picture' });
        }
        return res.json({ message: 'Profile picture updated successfully', profilePicture: new_picture });
    })
}

exports.leaveRequest = async (req, res) => {
    const { startDate, endDate, reason,userId } = req.body;

    if (!startDate || !endDate || !reason) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    const leaveRequestQuery = `
      INSERT INTO leave_requests (user_id, start_date, end_date, reason, status)
      VALUES (?, ?, ?, ?, 'pending')
    `;

    db.query(leaveRequestQuery, [userId, startDate, endDate, reason], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Database error', error: err });
        }
        res.status(200).json({ message: 'Leave request submitted successfully.' });
    });
}