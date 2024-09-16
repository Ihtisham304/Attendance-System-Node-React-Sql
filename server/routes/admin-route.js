const router = require('express').Router();
const adminController = require('../controller/admin-controller');


router.post('/admin/register',adminController.registerAdmin);
router.post('/admin/login',adminController.login);
router.get('/admin/allusers',adminController.getUsers);
router.get('/admin/attendance',adminController.getUserAttendance);
router.get('/admin/attendance/:id',adminController.getAttendanceById);
router.put('/admin/attendance/:id',adminController.updateAttendanceById);
router.delete('/admin/delete/attendance/:id',adminController.deleteAttendanceById);
router.get('/admin/user-report',adminController.getUserReport);
router.get('/admin/overall-report',adminController.getOverallReport);
router.post('/admin/approved-leave/:id',adminController.approvedLeaveRequest);
router.get('/admin/all-requests',adminController.getAllLeaveRequests);
router.post('/admin/leave-request/:id',adminController.updateLeaveRequestStatus);

module.exports = router;