import chaiHttp from 'chai-http';
import chai from 'chai';
import { describe, it } from 'mocha';
import app from '../index';
import { user, login } from './mockData/users';
import getToken from '../helpers/generateToken';
import Environment from '../config/database';

const conn = Environment.dbConnection();

chai.use(chaiHttp);
chai.should();


const createAllUserTest = async () => {
  await conn.query(`INSERT INTO 
  users(firstName, lastName, email, password, address, bio, occupation, expertise,type) 
  VALUES('rutikanga','anna','menteeg@gmail.com','mentee','any','jjjjjj','hhhhhhh','yyyyyy','mentee'),
  ('rutikanga','anna','mentee1@gmail.com','test','any','jjjjjj','hhhhhhh','yyyyyy','mentee'),
  ('rutikanga','anna','mentee2@gmail.com','test','any','jjjjjj','hhhhhhh','yyyyyy','mentee'),
  ('rutikanga','anna','mentor@gmail.com','mentor','any','jjjjjj','hhhhhhh','yyyyyy','mentor'),
  ('rutikanga','anna','mentor1@gmail.com','test','any','jjjjjj','hhhhhhh','yyyyyy','mentor'),
  ('rutikanga','anna','mentor2@gmail.com','test','any','jjjjjj','hhhhhhh','yyyyyy','mentor')`);

  await conn.end();
};

createAllUserTest();

const admintoken = getToken('admin@gmail.com');
const menteeToken = getToken('mentee@gmail.com');

describe('POST </API/v1/auth/signup>', () => {
  it('user detail required', (done) => {
    chai
      .request(app)
      .post('/API/v1/auth/signup')
      .send()
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.have.be.a('object');
        done();
      });
  });


  it('user alread exist !', (done) => {
    chai
      .request(app)
      .post('/API/v1/auth/signup')
      .send(user[1])
      .end((err, res) => {
        res.should.have.status(401);
        res.body.should.have.be.a('object');
        done();
      });
  });

  it('user should  successfuly sign up', (done) => {
    chai
      .request(app)
      .post('/API/v1/auth/signup')
      .send(user[3])
      .end((err, res) => {
        res.should.have.status(201);
        res.body.should.have.be.a('object');
        res.body.should.have.property('token');
        res.body.data.should.have.property('id');
        res.body.data.should.have.property('firstname');
        res.body.data.should.have.property('lastname');
        res.body.data.should.have.property('email');
        res.body.data.should.have.property('address');
        res.body.data.should.have.property('bio');
        res.body.data.should.have.property('occupation');
        res.body.data.should.have.property('expertise');
        res.body.data.should.have.property('type').eql('mentee');

        done();
      });
  });
});

describe('POST </API/v1/auth/signin>', () => {
  it('user should sign in', (done) => {
    chai
      .request(app)
      .post('/API/v1/auth/signin')
      .send(login)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('status');
        res.body.should.have.property('token');
        res.body.should.have.property('data');
        done();
      });
  });

  it('user name and password required', (done) => {
    chai
      .request(app)
      .post('/API/v1/auth/signin')
      .send()
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        done();
      });
  });

  it('it should return incorect username  and password', (done) => {
    chai
      .request(app)
      .post('/API/v1/auth/signin')
      .send({ email: 'fake@gmail.com', password: 'invalid' })
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.have.property('status');
        res.body.should.have.property('message').eql('User not found, Incorrect email or password');
        done();
      });
  });

});

describe('GET </API/v1/auth/>  GET all users', () => {
  it('It should display all users', () => {
    chai
      .request(app)
      .get('/API/v1/auth/')
      .set('Authorization', `Bearer ${admintoken}`)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.be.a('object');
      });
  });

  it('It should check if user allowed to get all users', () => {
    chai
      .request(app)
      .get('/API/v1/auth/')
      .set('Authorization', `Bearer ${menteeToken}`)
      .end((err, res) => {
        res.should.have.status(403);
        res.body.should.have.be.a('object');
      });
  });
});
