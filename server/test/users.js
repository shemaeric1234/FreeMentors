import chaiHttp from 'chai-http';
import chai from 'chai';
import { describe, it } from 'mocha';
import app from '../index';
import { user, login } from './mockData/users';
import getToken from '../helpers/generateToken';

chai.use(chaiHttp);
chai.should();
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
