import Joi from '@hapi/joi';
import { sessionsSchema } from '../helpers/validation';
import customize from '../helpers/customize';
import paramchecker from '../helpers/paramchecking';
import database from '../database/dbquerie';

class session {
  static async createNew(req, res) {
    const session1 = req.body;
    const { error } = Joi.validate(session1, sessionsSchema);
    if (error) {
      return customize.validateError(req, res, error, 400);
    }
    const dbsession = await database.selectBy2colum('sessions', 'menteeemail', req.user.email, 'questions', session1.questions, 'and');
    if (dbsession.rowCount !== 0) {
      return res.status(400).json({
        status: '400',
        message: 'session already exists',
      });
    }

    const mentorDetail = await database.selectBy2colum('users', 'id', req.body.mentorId, 'type', 'mentor', 'and');
    if (mentorDetail.rowCount === 0) {
      return res.status(404).send({
        status: '404',
        message: 'mentor not found',
      });
    }

    const result = {
      mentorId: req.body.mentorId,
      menteeId: req.user.id,
      questions: req.body.questions,
      menteeEmail: req.user.email,
      status: 'pending',
    };
    const data = await database.createSesion(result);
    return res.status(201).json({
      status: '201',
      message: 'success',
      data: data.rows[0],
    });
  }

  static async getAll(req, res) {
    const data = await database.selectBy2colum('sessions', 'menteeid', req.user.id, 'mentorid', req.user.id, 'or');
    if (data.rowCount === 0) {
      return res.status(404).send({
        status: '404',
        error: 'Sessions not found',
      });
    }
    return res.status(200).json({
      status: '200',
      message: 'success',
      data: data.rows,
    });
  }

  static acceptOrReject(req, res) {
    if (paramchecker(req.params.sessionId, 'number')) {
      return res.status(400).send({ status: '400', message: paramchecker(req.params.sessionId, 'number', 'sesson id ') });
    }
    if (paramchecker(req.params.decision, 'string')) {
      return res.status(400).send({ status: '400', message: paramchecker(req.params.decision, 'string', 'Decission ') });
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
  }
}

export default session;
