const router = require("express").Router();
const userController = require("../controller/user-controller");
const upload = require("../middlewares/upload-image");
const auth = require('../middlewares/auth');

router.post('/user/register',upload.single('profile_picture'),userController.registerUser)
router.post('/user/login',userController.login);
router.post('/attendance/mark',userController.markAttendance);
router.get('/view/attendance/:user_id',userController.viewAttendance);
router.get('/user/profile-picture/:user_id',userController.getProfilePicture);
router.put('/user/edit/picture/:user_id',upload.single('profile_picture'),userController.updateProfilePicture);
router.post('/user/leave-request',userController.leaveRequest);

module.exports = router;