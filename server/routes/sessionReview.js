import express from 'express';
import sessions from '../controllers/sessionReview';
import authenticaton from '../middleware/verifyToken';
import { mentee, admin, mentorOrAdmin } from '../middleware/findLoggedinUser';

const router = express.Router();

router.post('/sessions/:sessionId/review', authenticaton, mentee, sessions.review);
router.delete('/sessions/:sessionId/review', authenticaton, admin, sessions.deleteRemark);
router.get('/reviewedsessions', authenticaton, mentorOrAdmin, sessions.allReview);

export default router;
