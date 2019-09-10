import hashpassword from 'bcrypt';
import Joi from '@hapi/joi';
import getToken from '../helpers/generateToken';
import { userSignup, userSignin } from '../helpers/validation';
import customize from '../helpers/customize';
import database from '../database/dbquerie';
import paramchecker from '../helpers/paramchecking';

class User {
  static async register(req, res) {
    const User1 = req.body;
    const { email } = req.body;
    let message = '';

    const { error } = Joi.validate(User1, userSignup);
    if (error) {
      return customize.validateError(req, res, error, 400);
    }

    const isUser = await database.selectBy('users', 'email', email);
    if (isUser.rowCount !== 0) {
      message = 'user already exists';
    }

    if (message) {
      return res.status(401).json({
        status: '401',
        message,
      });
    }
    const token = getToken(email);

    const User = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: hashpassword.hashSync(req.body.password, 10),
      address: req.body.address,
      bio: req.body.bio,
      occupation: req.body.occupation,
      expertise: req.body.expertise,
      type: 'mentee',
    };

    const data = await database.createUser(User);
    delete data.rows[0].password;

    return res.status(201).json({
      status: '201',
      message: 'user added',
      token,
      data: data.rows[0],
    });
  }

  static async login(req, res) {
    let data = '';
    let passwordTest = false;
    const { email } = req.body;

    const { error } = Joi.validate(req.body, userSignin);
    if (error) {
      return customize.validateError(req, res, error, 400);
    }

    const userData = req.body;
    data = await database.selectBy('users', 'email', email);

    if (data.rowCount !== 0) {
      passwordTest = hashpassword.compareSync(userData.password, data.rows[0].password);
    }
    let token = '';
    if (data.rowCount !== 0 && passwordTest) {
      token = getToken(email);
    }
    if (!token) {
      return res.status(404).send({
        status: 404,
        message: 'User not found, Incorrect email or password',
      });
    }
    delete data.rows[0].password;
    return res.status(200).send({
      status: '200',
      message: 'login successfuly',
      token,
      data: data.rows[0],
    });
  }

  static async getUsers(req, res) {
    const data = await database.selectAll('users');

    for (let u = 0; u < data.rowCount; u++) {
      delete data.rows[u].password;
    }
    return res.status(200).json({
      status: '200',
      message: 'success',
      data: data.rows,
    });
  }

  static getUser(req, res) {
    if (paramchecker(req.params.id, 'number')) {
      return res.status(400).send({ status: '400', message: paramchecker(req.params.id, 'number', 'user id ') });
    }
    const id = parseInt(req.params.id, 10);
    let data = [];
    users.forEach((user) => {
      if (user.id === id) {
        data.push(user);
      }
    });
    if (data.length === 0) {
      return res.status(404).json({
        status: '404',
        message: 'user not found',
      });
    }
    data = removePass(data);
    return res.status(200).send({
      status: '200',
      message: 'success',
      data,
    });
  }

  static updateUser(req, res) {
    if (paramchecker(req.params.userId, 'number')) {
      return res.status(400).send({ status: '400', message: paramchecker(req.params.userId, 'number', 'user id ') });
    }
    const id = parseInt(req.params.userId, 10);
    let data = '';
    let menteeToUpdate = '';
    users.map((userToUpdate) => {
      if (userToUpdate.id === id) {
        menteeToUpdate = userToUpdate;
      }
    });

    if (!menteeToUpdate) {
      return res.status(404).send({
        status: '404',
        message: 'user not found',
      });
    }

    if (menteeToUpdate.type !== 'mentee') {
      return res.status(403).send({
        status: '403',
        message: 'Forbiden is not a mentee',
      });
    }
    users.map((Newuser) => {
      if (Newuser.id === menteeToUpdate.id) {
        Newuser.type = 'mentor';
        menteeToUpdate.type = 'mentor';
      }
    });

    data = {
      id: menteeToUpdate.id,
      firstName: menteeToUpdate.firstName,
      lastName: menteeToUpdate.lastName,
      email: menteeToUpdate.email,
      address: menteeToUpdate.address,
      bio: menteeToUpdate.bio,
      occupation: menteeToUpdate.occupation,
      expertise: menteeToUpdate.expertise,
      type: menteeToUpdate.type,
    };
    return res.status(201).send({
      status: '201',
      message: 'user upDate successfully',
      data,
    });
  }

  static getMentors(req, res) {
    let data = [];
    let data2 = [];
    users.map((mentor) => {
      if (mentor.type === 'mentor') {
        data2.push(mentor);
      }
    });
    for (let u = 0; u < data2.length; u++) {
      data.push({
        id: data2[u].id,
        firstName: data2[u].firstName,
        lastName: data2[u].lastName,
        email: data2[u].email,
        address: data2[u].address,
        bio: data2[u].bio,
        occupation: data2[u].occupation,
        expertise: data2[u].expertise,
        type: data2[u].type,
      });
    }
    return res.status(200).json({
      status: '200',
      message: 'success',
      data,
    });
  }

  static getMentor(req, res) {
    if (paramchecker(req.params.mentorId, 'number')) {
      return res.status(400).send({ status: '400', message: paramchecker(req.params.mentorId, 'number', 'user id ') });
    }
    const id = parseInt(req.params.mentorId, 10);
    let data = [];
    users.map((specificMentor) => {
      if (specificMentor.id === id && specificMentor.type === 'mentor') {
        data.push(specificMentor);
      }
    });
    if (data.length === 0) {
      return res.status(404).send({
        status: '404',
        message: 'mentor not found',
      });
    }
    data = removePass(data);
    return res.status(200).send({
      status: '200',
      message: 'success',
      data,
    });
  }
}

export default User;
