import Joi from '@hapi/joi';
import NewidGeneretor from '../helpers/id_denerator';
import { sessionsSchema } from '../helpers/validation';
import customize from '../helpers/customize';

const session = {
  createNew: (req, res) => {
    const session1 = req.body;
    let errorMessage = '';
    const { error } = Joi.validate(session1, sessionsSchema);
    if (error) {
      return customize.validateError(req, res, error, 400);
    }
    sessions.forEach((newSession) => {
      if (newSession.menteeEmail === req.user.email && newSession.questions
        === session1.questions) {
        errorMessage = 'session already exists';
      }
    });
    if (errorMessage) {
      return res.status(400).json({
        status: '400',
        message: errorMessage,
      });
    }

    let mentorEmail = '';
    users.map((thisMentor) => {
      if (thisMentor.id === req.body.mentorId && thisMentor.type === 'mentor') {
        mentorEmail = thisMentor.email;
      }
    });
    if (!mentorEmail) {
      return res.status(404).send({
        status: '404',
        message: 'mentor not found',
      });
    }
    const data = {
      id: NewidGeneretor(sessions),
      mentorId: req.body.mentorId,
      menteeId: req.user.id,
      questions: req.body.questions,
      menteeEmail: req.user.email,
      mentorEmail,
      status: 'pending',

    };
    sessions.push(data);
    return res.status(201).json({
      status: '201',
      message: 'success',
      data,
    });
  },

  getAll: (req, res) => {
    const data = [];

    sessions.map((RelatedSession) => {
      users.map((specUser) => {
        if (specUser.email === req.user.email) {
          if (specUser.id === RelatedSession.mentorId || specUser.email
             === RelatedSession.menteeEmail) {
            data.push(RelatedSession);
          }
        }
      });
    });

    return res.status(200).json({
      status: '200',
      message: 'success',
      data,
    });
  },

  acceptOrReject: (req, res) => {
    if (/[^0-9]+/g.test(req.params.sessionId)) {
      return res.status(400).send({
        status: '400',
        error: 'SessionId on URL must be a number',
      });
    }
    if (/[^a-zA-Z]+/g.test(req.params.decision)) {
      return res.status(400).send({
        status: '400',
        error: ' decission URL must be a string',
      });
    }
    const id = parseInt(req.params.sessionId, 10);
    const decision = req.params.decision.toLowerCase();
    let data = '';
    let sessMessage = '';
    let sessStatus = 0;
    sessions.map((sessionToUpdate) => {
      if (sessionToUpdate.id === id) {
        data = sessionToUpdate;
      }
    });

    if (!data) {
      sessMessage = 'Session not found';
      sessStatus = 404;
    } else if (decision === 'accept') {
      data.status = 'accepted';
      sessMessage = 'Session accepted successfuly';
      sessStatus = 200;
    } else if (decision === 'reject') {
      data.status = 'reject';
      sessMessage = 'Session reject successfuly';
      sessStatus = 200;
    } else if (decision !== 'accept' || decision !== 'reject' ) {
      sessMessage = 'invalid decision';
      sessStatus = 400;
      data = '';
    }
    return res.status(sessStatus).send({
      status: sessStatus,
      message: sessMessage,
      data,
    });
  },
};

export default session;
