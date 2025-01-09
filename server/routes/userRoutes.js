import { Router } from 'express';
import { getMe, getUser, uploadUserPhoto, resizeUserPhoto, updateMe, deleteMe, getAllUsers, createUser, updateUser, deleteUser, getCompareMonthly } from '../controllers/userController.js';
import { signup, login, GoogleLogin, forgotPassword, resetPassword, protect, updatePassword, restrictTo } from '../controllers/authController.js';

const router = Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/login/google', GoogleLogin);

router.post('/forgotPassword', forgotPassword);
router.patch('/resetPassword/:token', resetPassword);

router.use(protect);

router.patch('/updateMyPassword', updatePassword);
router.get('/me', getMe, getUser)
router.patch('/updateMe',
    uploadUserPhoto,
    resizeUserPhoto,
    updateMe
);
router.delete('/deleteMe', deleteMe);

router.use(restrictTo('admin'));

router
    .route('/')
    .get(getAllUsers)
    .post(createUser);

router
    .route('/:id')
    .get(getUser)
    .patch(
        uploadUserPhoto,
        resizeUserPhoto,
        updateUser
    )
    .delete(deleteUser);


router
    .route('/comparison/last-current-month')
    .get(getCompareMonthly)

export default router;
