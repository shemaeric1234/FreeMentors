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
    VALUES(2,2,'question','mentee@gmail.com','pending'),
    (3,3,'question','mentee1@gmail.com','pending'),
    (4,4,'question','mentee2@gmail.com','pending'),
    (5,5,'question','mentee3@gmail.com','pending'),
    (6,6,'question','mentee4@gmail.com','pending'),
    (7,7,'question','mentee5@gmail.com','pending'),`);

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
        res.body.should.have.property('status');
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
  it('It should display all related sessions ', () => {
    chai
      .request(app)
      .get('/API/v1/sessions')
      .set('Authorization', `Bearer ${menteeToken}`)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.be.a('object');
        res.body.should.have.property('status');
        res.body.data.should.be.a('array');
        res.body.data[0].id.should.be.a('number');
        res.body.data[0].mentorId.should.be.a('number');
        res.body.data[0].menteeId.should.be.a('number');
        res.body.data[0].should.have.property('questions');
        res.body.data[0].should.have.property('menteeEmail');
        res.body.data[0].should.have.property('status');
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
        res.should.have.status(401);
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
        res.should.have.status(401);
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
        res.should.have.status(401);
        res.body.should.have.be.a('object');
        res.body.should.have.property('error').eql('You provided the invalid token!');

      });
  });
});
