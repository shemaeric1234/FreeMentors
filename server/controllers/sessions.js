import Joi from '@hapi/joi';
import sessions from '../models/sessions';
import NewidGeneretor from '../helpers/id_denerator';
import users from '../models/users';
import { sessionsSchema } from '../helpers/validation';
import customize from '../helpers/customize';

class session {
  
  static createNew(req, res) {
    const session1 = req.body;

    const { error } = Joi.validate(session1, sessionsSchema);
    if (error) {
      return customize.validateError(req, res, error, 400);
    }
    sessions.forEach((newSession) => {
      if (newSession.menteeEmail === req.user.email && newSession.questions
        === session1.questions) {
        return res.status(400).json({
          message: 'session already exists',
        });
      }
    });

    const newSession = {
      id: NewidGeneretor(sessions),
      mentorId: req.body.mentorId,
      menteeId: req.user.id,
      questions: req.body.questions,
      menteeEmail: req.user.email,
      status: 'pending',

    };
    sessions.push(newSession);
    return res.status(201).json({
      success: 'true',
      newSession,
    });
  }

  
}

export default session;
