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
        res.body.should.have.property('status');
        res.body.should.have.property('message').eql('session review successfuly sent');
        res.body.data.should.have.property('id');
        res.body.data.should.have.property('sessionId');
        res.body.data.should.have.property('mentorId');
        res.body.data.should.have.property('menteeId');
        res.body.data.should.have.property('score');
        res.body.data.should.have.property('menteeFullName');
        res.body.data.should.have.property('remark');
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

  it('it should verify if url parametor is valid ', () => {
    chai
      .request(app)
      .post('/API/v1/sessions/dfghj/review')
      .send(remark[0])
      .set('Authorization', `Bearer ${menteeToken}`)
      .end((err, res) => {
        res.should.have.status(400);
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

describe('GET </API/v1/sessions>  GET all sessions reviewed', () => {
  it('It should display all reviewed sessions', () => {
    chai
      .request(app)
      .get('/API/v1/reviewedsessions')
      .set('Authorization', `Bearer ${admintoken}`)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.be.a('object');
        res.body.should.have.property('status');
        res.body.data.should.be.a('array');
        res.body.data[0].id.should.be.a('number');
        res.body.data[0].sessionId.should.be.a('number');
        res.body.data[0].mentorId.should.be.a('number');
        res.body.data[0].menteeId.should.be.a('number');
        res.body.data[0].score.should.be.a('number');
        res.body.data[0].should.have.property('menteeFullName');
        res.body.data[0].should.have.property('remark');

      });
  });


  it('It should check if a user allowed to do this action', () => {
    chai
      .request(app)
      .get('/API/v1/reviewedsessions')
      .set('Authorization', `Bearer ${menteeToken}`)
      .end((err, res) => {
        res.should.have.status(403);
        res.body.should.have.be.a('object');
      });
  });
});

describe('GET </API/v1/sessions>  delete specific  reviewed review deemed as inappropriate ', () => {
  it('delete specific  reviewed review deemed as inappropriate', () => {
    chai
      .request(app)
      .delete('/API/v1/sessions/1/review')
      .set('Authorization', `Bearer ${admintoken}`)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.be.a('object');
        res.body.should.have.property('status');
        res.body.data.should.be.a('string').eql('session review deleted successfuly');
      });
  });

  it('it should check if session is not available', () => {
    chai
      .request(app)
      .delete('/API/v1/sessions/0/review')
      .set('Authorization', `Bearer ${admintoken}`)
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.have.be.a('object');
        res.body.should.have.property('status');
        res.body.should.have.property('message').eql('session review not found');
      });
  });

  it('it should check if url paramentor is valid', () => {
    chai
      .request(app)
      .delete('/API/v1/sessions/0dfghjk/review')
      .set('Authorization', `Bearer ${admintoken}`)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.have.be.a('object');
        res.body.should.have.property('status');
        res.body.should.have.property('error');
      });
  });

});