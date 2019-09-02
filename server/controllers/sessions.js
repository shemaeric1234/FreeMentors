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

  static getAll(req, res) {
    const relatedSessions = [];

    sessions.map((RelatedSession) => {
      users.map((specUser) => {
        if (specUser.email === req.user.email) {
          if (specUser.id === RelatedSession.mentorId || specUser.email
             === RelatedSession.menteeEmail) {
            relatedSessions.push(RelatedSession);
          }
        }
      });
    });

    return res.status(200).json({
      success: 'true',
      relatedSessions,
    });
  }

  static acceptOrReject(req, res) {
    const id = parseInt(req.params.sessionId, 10);
    const decision = req.params.decision.toLowerCase();
    let MySession = '';
    let sessMessage = '';
    let sessStatus = 0;
    sessions.map((sessionToUpdate) => {
      if (sessionToUpdate.id === id) {
        MySession = sessionToUpdate;
      }
    });

    if (!MySession) {
      sessMessage = 'Session not found';
      sessStatus = 404;
    } else if (decision === 'accept') {
      MySession.status = 'accepted';
      sessMessage = 'Session accepted successfuly';
      sessStatus = 200;
    } else if (decision === 'reject') {
      MySession.status = 'reject';
      sessMessage = 'Session reject successfuly';
      sessStatus = 200;
    } else if ( decision !== 'accept' || decision !== 'reject' ) {
      sessMessage = 'invalid decision';
      sessStatus = 400;
    } 
    return res.status(sessStatus).send({
      status: sessStatus,
      message: sessMessage,
    });
  }
}

export default session;
