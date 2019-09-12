import Joi from '@hapi/joi';
import { sessionReviewSchema } from '../helpers/validation';
import customize from '../helpers/customize';
import paramchecker from '../middleware/paramchecking';
import database from '../database/dbquerie';

class sessionReview {
  static async review(req, res) {
    const sessionId = parseInt(req.params.id, 10);
    const score = parseInt(req.body.score, 10);
    const { error } = Joi.validate(req.body, sessionReviewSchema);
    if (error) {
      return customize.validateError(req, res, error, 400);
    }

    let data1 = '';
    try {
      data1 = await database.selectBy('sessions', 'id', sessionId);
    } catch (error1) {
      return res.status(404).send({
        status: '400',
        error: error1.message,
      });
    }
    if (data1.rowCount !== 0) {
      const data = {
        sessionId: data1.rows[0].id,
        mentorId: data1.rows[0].mentorid,
        menteeId: req.user.id,
        score,
        remark: req.body.remark,
      };
      const result = await database.createSesionReview(data);
      return res.status(201).send({
        status: '201',
        message: 'session review successfuly sent',
        data: result.rows[0],
      });
    }
    return res.status(404).send({
      status: '404',
      message: 'session not found',
    });
  }

  static allReview(req, res) {
    const data = [];
    let isMentor = '';
    users.map((NewMentor) => {
      if (NewMentor.email === req.user.email && NewMentor.type === 'mentor') {
        isMentor = true;
        sessionReviews.map((mentorRevie) => {
          if (mentorRevie.mentorId === NewMentor.id) {
            data.push({
              id: mentorRevie.id,
              sessionId: mentorRevie.sessionId,
              mentorId: mentorRevie.mentorId,
              menteeId: mentorRevie.menteeId,
              score: mentorRevie.score,
              menteeFullName: mentorRevie.menteeFullName,
              remark: mentorRevie.remark,
            });
          }
        });
      }
    });
    if (isMentor && data.length === 0) {
      data.push("you don't have the session");
    } else if (data.length === 0) {
      data.push(sessionReviews);
    }

    return res.status(200).json({
      status: '200',
      message: 'success',
      data,
    });
  }

  static async deleteRemark(req, res) {
    const reviewId = parseInt(req.params.id, 10);
    let data = '';
    try {
      data = await database.deleteBy('sessionreview', 'id', reviewId);
    } catch (error) {
      return res.status(400).send({
        status: '400',
        error: error.message,
      });
    }
    if (data.rowCount === 0) {
      return res.status(404).send({
        status: '404',
        message: 'Session review not found',
      });
    }

    return res.status(200).send({
      status: '200',
      message: ' session review deleted successfuly',
    });
  }
}

export default sessionReview;
