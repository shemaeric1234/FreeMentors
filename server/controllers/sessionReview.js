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

  static async allReview(req, res) {
    if (req.user.type === 'mentor') {
      const result = await database.selectBy('sessionreview', 'mentorid', req.user.id);
      let data = '';
      let message = '';
      let status = 0;
      if (result.rowCount !== 0) {
        data = result.rows;
        message = 'success';
        status = 200;
      } else {
        message = 'Session reviewed not found';
        status = 404;
      }
      return res.status(status).send({
        status,
        message,
        data,
      });
    }
    const data = await database.selectAll('sessionreview');
    if (data.rowCount === 0) {
      return res.status(404).send({
        status: '404',
        message: 'Session reviewed not found',
        data: data.rows,
      });
    }
    return res.status(200).send({
      status: '200',
      message: 'success',
      data: data.rows,
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
