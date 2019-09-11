import express from 'express';
import Users from '../controllers/users';
import verifyToken from '../middleware/verifyToken';
import { mentee, admin } from '../middleware/findLoggedinUser';
import param from '../middleware/paramchecking';

const router = express.Router();

router.get('/auth/', verifyToken, admin, Users.getUsers);
router.get('/auth/:id', verifyToken, admin, param.paramchecker, Users.getUser);
router.post('/auth/signup', Users.register);
router.post('/auth/signin', Users.login);
router.get('/mentors', verifyToken, mentee, Users.getMentors);
router.get('/mentors/:id', verifyToken, mentee, param.paramchecker, Users.getMentor);
router.patch('/user/:id', verifyToken, admin, param.paramchecker, Users.updateUser);

export default router;
