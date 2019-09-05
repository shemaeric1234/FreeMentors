import Joi from '@hapi/joi';
import sessionReviews from '../models/sessionReview';
import NewidGeneretor from '../helpers/id_denerator';
import sessions from '../models/sessions';
import users from '../models/users';
import { sessionReviewSchema } from '../helpers/validation';
import customize from '../helpers/customize';

const sessionReview = {
  review: (req, res) => {
    if (/[^0-9]+/g.test(req.params.sessionId)) {
      return res.status(400).send({
        status: '400',
        error: 'SessionId on URL must be a number',
      });
    }
    const sessionId = parseInt(req.params.sessionId, 10);
    const score = parseInt(req.body.score, 10);
    const reviewBody = req.body;
    let sessionToreview = '';
    let menteeInfo = '';
    const { error } = Joi.validate(reviewBody, sessionReviewSchema);
    if (error) {
      return customize.validateError(req, res, error, 400);
    }

    sessions.map((existSesion) => {
      if (existSesion.id === sessionId) {
        sessionToreview = existSesion;
      }
    });
    users.map((existUser) => {
      if (existUser.id === sessionToreview.menteeId) {
        menteeInfo = existUser;
      }
    })

    if (sessionToreview) {
      const data = {
        id: NewidGeneretor(sessionReviews),
        sessionId: sessionToreview.id,
        mentorId: sessionToreview.mentorId,
        menteeId: sessionToreview.menteeId,
        score,
        menteeFullName: `${menteeInfo.firstName} ${menteeInfo.lastName}`,
        remark: reviewBody.remark,
      };

      sessionReviews.push(data);
      return res.status(201).send({
        status: '201',
        message: 'session review successfuly sent',
        data,
      });
    }
    return res.status(404).send({
      status: '404',
      message: 'session not found',
    });
  },

  allReview: (req, res) => {
    return res.status(200).json({
      status: '200',
      message: 'success',
      data: sessionReviews,
    });
  },

  deleteRemark: (req, res) => {
    if (/[^0-9]+/g.test(req.params.sessionId)) {
      return res.status(400).send({
        status: '400',
        error: 'SessionId on URL must be a number',
      });
    }
    const reviewId = parseInt(req.params.sessionId, 10);
    let data = '';
    sessionReviews.map((specificReview, index) => {
      if (specificReview.sessionId === reviewId) {
        sessionReviews.splice(index, 1);

        data = 'session review deleted successfuly';
      }
    });
    if (data) {
      return res.status(200).send({
        status: '200',
        message: 'success',
        data,
      });
    }

    return res.status(404).send({
      status: '404',
      message: 'session review not found',
    });
  },
};

export default sessionReview;
