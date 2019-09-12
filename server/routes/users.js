import express from 'express';
import Users from '../controllers/users';
import verifyToken from '../middleware/verifyToken';
import { mentee, admin } from '../middleware/findLoggedinUser';

const router = express.Router();

router.get('/auth/', verifyToken, admin, Users.getUsers);
router.get('/auth/:id', verifyToken, admin, Users.getUser);
router.post('/auth/signup', Users.register);
router.post('/auth/signin', Users.login);
router.get('/mentors', verifyToken, mentee, Users.getMentors);
router.get('/mentors/:mentorId', verifyToken, mentee, Users.getMentor);
router.patch('/user/:userId', verifyToken, admin, Users.updateUser);

export default router;
