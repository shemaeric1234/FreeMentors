import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';
import sessions from './mockData/session';
import getToken from '../helpers/generateToken';

chai.use(chaiHttp);
chai.should();
const admintoken = getToken('admin@gmail.com');
const menteeToken = getToken('mentee@gmail.com');
const mentorToken = getToken('mentor@gmail.com');

describe('POST </API/v1/sessions> a mentee should create a session', () => {
  it('It should create a new session ', () => {
    chai
      .request(app)
      .post('/API/v1/sessions')
      .send(sessions[0])
      .set('Authorization', `Bearer ${menteeToken}`)
      .end((err, res) => {
        res.should.have.status(201);
        res.body.should.have.be.a('object');
        res.body.should.have.property('status');
      });
  });

  it('It should validate mentee input', () => {
    chai
      .request(app)
      .post('/API/v1/sessions')
      .send()
      .set('Authorization', `Bearer ${menteeToken}`)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.have.be.a('object');
      });
  });

  it('It should sheck if that session exist', () => {
    chai
      .request(app)
      .post('/API/v1/sessions')
      .send(sessions[0])
      .set('Authorization', `Bearer ${menteeToken}`)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.have.be.a('object');
      });
  });

  it('It should sheck if a mentor exist', () => {
    chai
      .request(app)
      .post('/API/v1/sessions')
      .send(sessions[4])
      .set('Authorization', `Bearer ${menteeToken}`)
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.have.be.a('object');
      });
  });

  it('It should sheck if a user allowed', () => {
    chai
      .request(app)
      .post('/API/v1/sessions')
      .send(sessions[1])
      .set('Authorization', `Bearer ${admintoken}`)
      .end((err, res) => {
        res.should.have.status(403);
        res.body.should.have.be.a('object');
      });
  });

  it('it should verify if there is not athorization in header set', () => {
    chai
      .request(app)
      .post('/API/v1/sessions')
      .end((err, res) => {
        res.should.have.status(403);
        res.body.should.have.be.a('object');
        res.body.should.have.property('error').eql('Please Set The Authorization Header!');

      });
  });

  it('it should verify if there is not token in header', () => {
    chai
      .request(app)
      .post('/API/v1/sessions')
      .set('Authorization', 'Bearer')
      .end((err, res) => {
        res.should.have.status(403);
        res.body.should.have.be.a('object');
        res.body.should.have.property('error').eql('No token provided, Access Denied!');

      });
  });

  it('it should verify if there is not token in header', () => {
    chai
      .request(app)
      .post('/API/v1/sessions')
      .set('Authorization', 'Bearer aaaaaaaaaaaa')
      .end((err, res) => {
        res.should.have.status(403);
        res.body.should.have.be.a('object');
        res.body.should.have.property('error').eql('You provided the invalid token!');

      });
  });


});


describe('GET </API/v1/sessions> should get all sessions', () => {
  it('It should display all related sessions ', () => {
    chai
      .request(app)
      .get('/API/v1/sessions')
      .set('Authorization', `Bearer ${menteeToken}`)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.be.a('object');
        res.body.should.have.property('status');
        res.body.relatedSessions.should.be.a('array');
        res.body.relatedSessions[0].id.should.be.a('number');
        res.body.relatedSessions[0].mentorId.should.be.a('number');
        res.body.relatedSessions[0].menteeId.should.be.a('number');
        res.body.relatedSessions[0].should.have.property('questions');
        res.body.relatedSessions[0].should.have.property('menteeEmail');
        res.body.relatedSessions[0].should.have.property('status');
      });
  });

  it('It should check is user allowed ', () => {
    chai
      .request(app)
      .get('/API/v1/sessions')
      .set('Authorization', `Bearer ${admintoken}`)
      .end((err, res) => {
        res.should.have.status(403);
        res.body.should.have.be.a('object');
      });
  });


  it('it should verify if there is not athorization in header set', () => {
    chai
      .request(app)
      .get('/API/v1/sessions')
      .end((err, res) => {
        res.should.have.status(403);
        res.body.should.have.be.a('object');
        res.body.should.have.property('error').eql('Please Set The Authorization Header!');

      });
  });

  it('it should verify if there is not token in header', () => {
    chai
      .request(app)
      .get('/API/v1/sessions')
      .set('Authorization', 'Bearer')
      .end((err, res) => {
        res.should.have.status(403);
        res.body.should.have.be.a('object');
        res.body.should.have.property('error').eql('No token provided, Access Denied!');

      });
  });

  it('it should verify if there is not token in header', () => {
    chai
      .request(app)
      .get('/API/v1/sessions')
      .set('Authorization', 'Bearer aaaaaaaaaaaa')
      .end((err, res) => {
        res.should.have.status(403);
        res.body.should.have.be.a('object');
        res.body.should.have.property('error').eql('You provided the invalid token!');

      });
  });
});


describe('POST </API/v1/sessions> a mentor should make decision', () => {
  it('It should accept a session ', () => {
    chai
      .request(app)
      .patch('/API/v1/sessions/1/accept')
      .set('Authorization', `Bearer ${mentorToken}`)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.be.a('object');
        res.body.should.have.property('message').eql('Session accepted successfuly');

      });
  });

  it('It should reject a session', () => {
    chai
      .request(app)
      .patch('/API/v1/sessions/1/reject')
      .set('Authorization', `Bearer ${mentorToken}`)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.be.a('object');
        res.body.should.have.property('message').eql('Session reject successfuly');
      });
  });

  it('It should check if a session to be accepted is available', () => {
    chai
      .request(app)
      .patch('/API/v1/sessions/0/accept')
      .set('Authorization', `Bearer ${mentorToken}`)
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.have.be.a('object');
        res.body.should.have.property('message').eql('Session not found');
      });
  });

  it('It should check if a session to be rejected is available', () => {
    chai
      .request(app)
      .patch('/API/v1/sessions/0/reject')
      .set('Authorization', `Bearer ${mentorToken}`)
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.have.be.a('object');
        res.body.should.have.property('message').eql('Session not found');
      });
  });

  it('It should check if a user allowed to do this action', () => {
    chai
      .request(app)
      .patch('/API/v1/sessions/1/reject')
      .set('Authorization', `Bearer ${admintoken}`)
      .end((err, res) => {
        res.should.have.status(403);
        res.body.should.have.be.a('object');
      });
  });

  it('It should check if decision taken are valid', () => {
    chai
      .request(app)
      .patch('/API/v1/sessions/1/dfghj')
      .set('Authorization', `Bearer ${mentorToken}`)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.have.be.a('object');
      });
  });

});
