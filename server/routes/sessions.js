import express from 'express';
import sessions from '../controllers/sessions';
import verifyToken from '../middleware/verifyToken';
import { mentor, mentee, menteeOrMentor } from '../middleware/findLoggedinUser';
import param from '../middleware/paramchecking';

const router = express.Router();

router.post('/sessions', verifyToken, mentee, sessions.createNew);
router.get('/sessions', verifyToken, menteeOrMentor, sessions.getAll);
router.patch('/sessions/:id/:decision', verifyToken, mentor, param.paramcheckerString, sessions.acceptOrReject);

export default router;
