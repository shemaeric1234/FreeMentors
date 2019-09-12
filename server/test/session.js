import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';
import sessions from './mockData/session';
import getToken from '../helpers/generateToken';
import Environment from '../config/database';

const conn = Environment.dbConnection();

chai.use(chaiHttp);
chai.should();

const createAllSssionTest = async () => {
  await conn.query(`INSERT INTO sessions(mentorid,menteeid,questions,menteeemail,status)
    VALUES(5,2,'question','mentee@gmail.com','pending'),
    (3,2,'question','mentee1@gmail.com','pending'),
    (4,2,'question','mentee2@gmail.com','pending'),
    (5,2,'question','mentee3@gmail.com','pending'),
    (6,2,'question','mentee4@gmail.com','pending'),
    (7,2,'question','mentee5@gmail.com','pending')`);


  await conn.end();
};

createAllSssionTest();

const admintoken = getToken('admin@gmail.com');
const menteeToken = getToken('mentee@gmail.com');
const mentorToken = getToken('mentor@gmail.com');

describe('POST </API/v1/sessions> a mentee should create a session', () => {
  it('It should create a new session ', (done) => {
    chai
      .request(app)
      .post('/API/v1/sessions')
      .send(sessions[0])
      .set('Authorization', `Bearer ${menteeToken}`)
      .end((err, res) => {
        res.should.have.status(201);
        res.body.should.have.be.a('object');
        done();
      });
  });

  it('It should validate mentee input', (done) => {
    chai
      .request(app)
      .post('/API/v1/sessions')
      .send()
      .set('Authorization', `Bearer ${menteeToken}`)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.have.be.a('object');
        done();
      });
  });

  it('It should sheck if that session exist', (done) => {
    chai
      .request(app)
      .post('/API/v1/sessions')
      .send(sessions[0])
      .set('Authorization', `Bearer ${menteeToken}`)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.have.be.a('object');
        done();
      });
  });

  it('It should sheck if a mentor exist', (done) => {
    chai
      .request(app)
      .post('/API/v1/sessions')
      .send(sessions[4])
      .set('Authorization', `Bearer ${menteeToken}`)
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.have.be.a('object');
        done();
      });
  });

  it('It should sheck if a user allowed', (done) => {
    chai
      .request(app)
      .post('/API/v1/sessions')
      .send(sessions[1])
      .set('Authorization', `Bearer ${admintoken}`)
      .end((err, res) => {
        res.should.have.status(403);
        res.body.should.have.be.a('object');
        done();
      });
  });

  it('it should verify if there is not athorization in header set', (done) => {
    chai
      .request(app)
      .post('/API/v1/sessions')
      .end((err, res) => {
        res.should.have.status(401);
        res.body.should.have.be.a('object');
        res.body.should.have.property('error').eql('Please Set The Authorization Header!');
        done();
      });
  });

  it('it should verify if there is not token in header', (done) => {
    chai
      .request(app)
      .post('/API/v1/sessions')
      .set('Authorization', 'Bearer')
      .end((err, res) => {
        res.should.have.status(401);
        res.body.should.have.be.a('object');
        res.body.should.have.property('error').eql('No token provided, Access Denied!');
        done();
      });
  });

  it('it should verify if there is not token in header', (done) => {
    chai
      .request(app)
      .post('/API/v1/sessions')
      .set('Authorization', 'Bearer aaaaaaaaaaaa')
      .end((err, res) => {
        res.should.have.status(401);
        res.body.should.have.be.a('object');
        res.body.should.have.property('error').eql('You provided the invalid token!');
        done();
      });
  });
});


describe('GET </API/v1/sessions> should get all sessions', () => {
  it('It should display all related sessions ', (done) => {
    chai
      .request(app)
      .get('/API/v1/sessions')
      .set('Authorization', `Bearer ${menteeToken}`)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.be.a('object');
        done();
      });
  });

  it('It should check is user allowed ', (done) => {
    chai
      .request(app)
      .get('/API/v1/sessions')
      .set('Authorization', `Bearer ${admintoken}`)
      .end((err, res) => {
        res.should.have.status(403);
        res.body.should.have.be.a('object');
        done();
      });
  });

  it('it should verify if there is not athorization in header set', (done) => {
    chai
      .request(app)
      .get('/API/v1/sessions')
      .end((err, res) => {
        res.should.have.status(401);
        res.body.should.have.be.a('object');
        res.body.should.have.property('error').eql('Please Set The Authorization Header!');
        done();
      });
  });

  it('it should verify if there is not token in header', (done) => {
    chai
      .request(app)
      .get('/API/v1/sessions')
      .set('Authorization', 'Bearer')
      .end((err, res) => {
        res.should.have.status(401);
        res.body.should.have.be.a('object');
        res.body.should.have.property('error').eql('No token provided, Access Denied!');
        done();
      });
  });

  it('it should verify if there is not token in header', (done) => {
    chai
      .request(app)
      .get('/API/v1/sessions')
      .set('Authorization', 'Bearer aaaaaaaaaaaa')
      .end((err, res) => {
        res.should.have.status(401);
        res.body.should.have.be.a('object');
        res.body.should.have.property('error').eql('You provided the invalid token!');
        done();
      });
  });
});

describe('POST </API/v1/sessions> a mentor should make decision', () => {
  it('It should accept a session ', (done) => {
    chai
      .request(app)
      .patch('/API/v1/sessions/1/accept')
      .set('Authorization', `Bearer ${mentorToken}`)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.be.a('object');
        done();
      });
  });

  it('It should reject a session', (done) => {
    chai
      .request(app)
      .patch('/API/v1/sessions/1/reject')
      .set('Authorization', `Bearer ${mentorToken}`)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.be.a('object');
        done();
      });
  });

  it('It should check if url parametor is valid', (done) => {
    chai
      .request(app)
      .patch('/API/v1/sessions/1/789')
      .set('Authorization', `Bearer ${mentorToken}`)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.have.be.a('object');
        done();
      });
  });

  it('It should check if url parametor is valid', (done) => {
    chai
      .request(app)
      .patch('/API/v1/sessions/dfghj/reject')
      .set('Authorization', `Bearer ${mentorToken}`)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.have.be.a('object');
        done();
      });
  });


  it('It should check if a session to be accepted is available', (done) => {
    chai
      .request(app)
      .patch('/API/v1/sessions/0/accept')
      .set('Authorization', `Bearer ${mentorToken}`)
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.have.be.a('object');
        done();
      });
  });

  it('It should check if a session to be rejected is available', (done) => {
    chai
      .request(app)
      .patch('/API/v1/sessions/0/reject')
      .set('Authorization', `Bearer ${mentorToken}`)
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.have.be.a('object');
        done();
      });
  });

  it('It should check if a user allowed to do this action', (done) => {
    chai
      .request(app)
      .patch('/API/v1/sessions/2/reject')
      .set('Authorization', `Bearer ${admintoken}`)
      .end((err, res) => {
        res.should.have.status(403);
        res.body.should.have.be.a('object');
        done();
      });
  });
});
