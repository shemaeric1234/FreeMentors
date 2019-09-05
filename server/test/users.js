import chaiHttp from 'chai-http';
import chai from 'chai';
import app from '../index';
import { user, login } from './mockData/users';
import getToken from '../helpers/generateToken';

chai.use(chaiHttp);
chai.should();
const admintoken = getToken('admin@gmail.com');
const menteeToken = getToken('mentee@gmail.com');

describe('GET </API/v1/auth/>  GET all users', () => {
  it('It should display all users', () => {
    chai
      .request(app)
      .get('/API/v1/auth/')
      .set('Authorization', `Bearer ${admintoken}`)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.be.a('object');
        res.body.data.should.have.be.a('array');
        res.body.data[0].should.have.property('id');
        res.body.data[0].should.have.property('firstName');
        res.body.data[0].should.have.property('lastName');
        res.body.data[0].should.have.property('email');
        res.body.data[0].should.have.property('address');
        res.body.data[0].should.have.property('bio');
        res.body.data[0].should.have.property('occupation');
        res.body.data[0].should.have.property('expertise');
        res.body.data[0].should.have.property('type');
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

describe('GET </API/v1/mentors>  GET all mentors', () => {
  it('It should display all mentors', () => {
    chai
      .request(app)
      .get('/API/v1/mentors')
      .set('Authorization', `Bearer ${menteeToken}`)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.be.a('object');
        res.body.data.should.have.be.a('array');
        res.body.data[0].should.have.property('id');
        res.body.data[0].should.have.property('firstName');
        res.body.data[0].should.have.property('lastName');
        res.body.data[0].should.have.property('email');
        res.body.data[0].should.have.property('address');
        res.body.data[0].should.have.property('bio');
        res.body.data[0].should.have.property('occupation');
        res.body.data[0].should.have.property('expertise');
        res.body.data[0].should.have.property('type');
      });
  });
});

describe('GET </API/v1/mentor/1>  GET specific mentor', () => {
  it('It should display aspecific mentor', () => {
    chai
      .request(app)
      .get('/API/v1/mentor/1')
      .set('Authorization', `Bearer ${menteeToken}`)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.be.a('object');
        res.body.data[0].should.have.property('firstName');
        res.body.data[0].should.have.property('lastName');
        res.body.data[0].should.have.property('email');
        res.body.data[0].should.have.property('address');
        res.body.data[0].should.have.property('bio');
        res.body.data[0].should.have.property('occupation');
        res.body.data[0].should.have.property('expertise');
        res.body.data[0].should.have.property('type');
      });
  });

  it('It should check if there is not  mentor available', () => {
    chai
      .request(app)
      .get('/API/v1/mentor/0')
      .set('Authorization', `Bearer ${menteeToken}`)
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.have.be.a('object');
        res.body.should.have.property('status');
        res.body.should.have.property('message');
      });
  });

  it('It should check if URL paramentor are valid', () => {
    chai
      .request(app)
      .get('/API/v1/mentor/0dfghjk')
      .set('Authorization', `Bearer ${menteeToken}`)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.have.be.a('object');
        res.body.should.have.property('status');
        res.body.should.have.property('error');
      });
  });


});

describe('GET </API/v1/auth/>  GET specific user', () => {
  it('It should display aspecific user', () => {
    chai
      .request(app)
      .get('/API/v1/auth/1')
      .set('Authorization', `Bearer ${admintoken}`)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.be.a('object');
        res.body.data[0].should.have.property('firstName');
        res.body.data[0].should.have.property('lastName');
        res.body.data[0].should.have.property('email');
        res.body.data[0].should.have.property('address');
        res.body.data[0].should.have.property('bio');
        res.body.data[0].should.have.property('occupation');
        res.body.data[0].should.have.property('expertise');
        res.body.data[0].should.have.property('type');
      });
  });

  it('It should check if userId in URL is not string', () => {
    chai
      .request(app)
      .get('/API/v1/auth/hjkl')
      .set('Authorization', `Bearer ${admintoken}`)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.have.be.a('object');
      });
  });

  it('It should check if there is not  user available', () => {
    chai
      .request(app)
      .get('/API/v1/auth/0')
      .set('Authorization', `Bearer ${admintoken}`)
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.have.be.a('object');
        res.body.should.have.property('status');
        res.body.should.have.property('message').eql('user not found');
      });
  });
});

describe('POST </API/v1/auth/signup>', () => {
  it('user detail required', () => {
    chai
      .request(app)
      .post('/API/v1/auth/signup')
      .send()
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.have.be.a('object');
      });
  });


  it('user alread exist !', () => {
    chai
      .request(app)
      .post('/API/v1/auth/signup')
      .send(user[1])
      .end((err, res) => {
        res.should.have.status(401);
        res.body.should.have.be.a('object');
      });
  });

  it('user should  successfuly sign up', () => {
    chai
      .request(app)
      .post('/API/v1/auth/signup')
      .send(user[3])
      .end((err, res) => {
        res.should.have.status(201);
        res.body.should.have.be.a('object');
        res.body.should.have.property('token');
        res.body.data.should.have.property('id');
        res.body.data.should.have.property('firstName');
        res.body.data.should.have.property('lastName');
        res.body.data.should.have.property('email');
        res.body.data.should.have.property('address');
        res.body.data.should.have.property('bio');
        res.body.data.should.have.property('occupation');
        res.body.data.should.have.property('expertise');
        res.body.data.should.have.property('type').eql('mentee');
      });
  });

});

describe('POST </API/v1/auth/signin>', () => {
  it('user should sign in', () => {
    chai
      .request(app)
      .post('/API/v1/auth/signin')
      .send(login)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('status');
        res.body.should.have.property('token');
        res.body.should.have.property('data');
      });
  });

  it('user name and password required', () => {
    chai
      .request(app)
      .post('/API/v1/auth/signin')
      .send()
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
      });
  });

  it('it should return incorect username  and password', () => {
    chai
      .request(app)
      .post('/API/v1/auth/signin')
      .send({ email: 'fake@gmail.com', password: 'invalid' })
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.have.property('status');
        res.body.should.have.property('message').eql('User not found, Incorrect email or password');
      });
  });

});

describe('GET </API/v1/user/1>  change user type to be mentor', () => {
  it('It should change a aspecific user to be a mentor', () => {
    chai
      .request(app)
      .patch('/API/v1/user/1')
      .set('Authorization', `Bearer ${admintoken}`)
      .end((err, res) => {
        res.should.have.status(201);
        res.body.should.have.be.a('object');
        res.body.should.have.property('status');
        res.body.should.have.property('message').eql('user upDate successfully');
        res.body.data.should.have.property('id');
        res.body.data.should.have.property('firstName');
        res.body.data.should.have.property('lastName');
        res.body.data.should.have.property('email');
        res.body.data.should.have.property('address');
        res.body.data.should.have.property('bio');
        res.body.data.should.have.property('occupation');
        res.body.data.should.have.property('expertise');
        res.body.data.should.have.property('type');
      });
  });

  it('It should check if mentor not found', () => {
    chai
      .request(app)
      .patch('/API/v1/user/0')
      .set('Authorization', `Bearer ${admintoken}`)
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.have.be.a('object');
      });
  });
  it('It should check if URL paramentor ara valid', () => {
    chai
      .request(app)
      .patch('/API/v1/user/0fghjkl')
      .set('Authorization', `Bearer ${admintoken}`)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.have.be.a('object');
      });
  });

});
