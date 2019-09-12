import express from 'express';
import sessions from '../controllers/sessionReview';
import authenticaton from '../middleware/verifyToken';
import { mentee, admin, mentorOrAdmin } from '../middleware/findLoggedinUser';
import param from '../middleware/paramchecking';

const router = express.Router();

router.post('/sessions/:id/review', authenticaton, mentee, param.paramchecker, sessions.review);
router.delete('/sessions/:id/review', authenticaton, admin, param.paramchecker, sessions.deleteRemark);
router.get('/reviewedsessions', authenticaton, mentorOrAdmin, sessions.allReview);

export default router;
