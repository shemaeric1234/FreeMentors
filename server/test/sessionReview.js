import chaiHttp from 'chai-http';
import chai from 'chai';
import app from '../index';
import getToken from '../helpers/generateToken';
import remark from './mockData/reviewSession';

chai.use(chaiHttp);
chai.should();
const admintoken = getToken('admin@gmail.com');
const menteeToken = getToken('mentee@gmail.com');

describe('post </sessions/1/review>  mentee should be able to review a mentor after a session', () => {


  it('it should review a session', () => {
    chai
      .request(app)
      .post('/API/v1/sessions/1/review')
      .set('Authorization', `Bearer ${menteeToken}`)
      .send(remark[0])
      .end((err, res) => {
        res.should.have.status(201);
        res.body.should.have.be.a('object');
        res.body.should.have.property('success').eql('true');
        res.body.should.have.property('message').eql('session review successfuly sent');
        res.body.newReview.should.have.property('id');
        res.body.newReview.should.have.property('sessionId');
        res.body.newReview.should.have.property('mentorId');
        res.body.newReview.should.have.property('menteeId');
        res.body.newReview.should.have.property('score');
        res.body.newReview.should.have.property('menteeFullName');
        res.body.newReview.should.have.property('remark');
      });
  });
  it('it should validate inputs', () => {
    chai
      .request(app)
      .post('/API/v1/sessions/1/review')
      .send()
      .set('Authorization', `Bearer ${menteeToken}`)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.have.be.a('object');
        res.body.should.have.property('error');
      });
  });

  it('it should verify if session not found ', () => {
    chai
      .request(app)
      .post('/API/v1/sessions/10/review')
      .send(remark[0])
      .set('Authorization', `Bearer ${menteeToken}`)
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.have.be.a('object');
      });
  });
});


describe('it should check bad request', () => {


  it('it should check bad request', () => {
    chai
      .request(app)
      .post('/API/v5/')
      .set('Authorization', `Bearer ${menteeToken}`)
      .send(remark[0])
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.have.be.a('object');
      });
  });
});
