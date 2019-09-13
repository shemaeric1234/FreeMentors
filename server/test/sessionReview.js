import chaiHttp from 'chai-http';
import chai from 'chai';
import app from '../index';
import getToken from '../helpers/generateToken';
import Environment from '../config/database';
import remark from './mockData/reviewSession';

const conn = Environment.dbConnection();

chai.use(chaiHttp);
chai.should();

const createAllSssionTest = async () => {
  await conn.query(`INSERT INTO sessionreview(sessionid,mentorid,menteeid,score,remark)
    VALUES(1,2,2,3,'its fine'),(1,2,2,3,'its fine'),(1,2,2,3,'its fine one'),
    (1,2,2,3,'its fine two'),(1,2,2,3,'its fine three'),(1,2,2,3,'its fine last')`);

  await conn.end();
};

createAllSssionTest();

const admintoken = getToken('admin@gmail.com');
const menteeToken = getToken('mentee@gmail.com');
const mentorToken = getToken('mentor@gmail.com');

describe('post </sessions/1/review>  mentee should be able to review a mentor after a session', () => {

  it('it should review a session', (done) => {
    chai
      .request(app)
      .post('/API/v1/sessions/1/review')
      .set('Authorization', `Bearer ${menteeToken}`)
      .send(remark[0])
      .end((err, res) => {
        res.should.have.status(201);
        res.body.should.have.be.a('object');
        done();
      });
  });
  it('it should validate inputs', (done) => {
    chai
      .request(app)
      .post('/API/v1/sessions/1/review')
      .send()
      .set('Authorization', `Bearer ${menteeToken}`)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.have.be.a('object');
        done();
      });
  });

  it('it should verify if session not found ', (done) => {
    chai
      .request(app)
      .post('/API/v1/sessions/0/review')
      .send(remark[1])
      .set('Authorization', `Bearer ${menteeToken}`)
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.have.be.a('object');
        done();
      });
  });
  it('it should verify if alread exist ', (done) => {
    chai
      .request(app)
      .post('/API/v1/sessions/2/review')
      .send(remark[0])
      .set('Authorization', `Bearer ${menteeToken}`)
      .end((err, res) => {
        res.should.have.status(409);
        res.body.should.have.be.a('object');
        done();
      });
  });

});

describe('GET </API/v1/sessions>  delete specific  reviewed review deemed as inappropriate ', () => {
  it('it should check if session is not available', (done) => {
    chai
      .request(app)
      .delete('/API/v1/sessions/0/review')
      .set('Authorization', `Bearer ${admintoken}`)
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.have.be.a('object');
        done();
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
