import hashpassword from 'bcrypt';
import Joi from '@hapi/joi';
import users from '../models/users';
import NewidGeneretor from '../helpers/id_denerator';
import getToken from '../helpers/generateToken';
import { userSignup, userSignin } from '../helpers/validation';
import customize from '../helpers/customize';
import removePass from '../helpers/removePass';

const User = {
  register: (req, res) => {
    const User1 = req.body;
    const { email } = req.body;
    let message = '';

    const { error } = Joi.validate(User1, userSignup);
    if (error) {
      return customize.validateError(req, res, error, 400);
    }

    users.forEach((newUser) => {
      if (newUser.email === User1.email) {
        message = 'user already exists';
      }
    });

    if (message) {
      return res.status(401).json({
        status: '201',
        message,
      });
    }
    const token = getToken(email);
    const User = {
      id: NewidGeneretor(users),
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
    const data = {
      id: NewidGeneretor(users),
      firstName: User.firstName,
      lastName: User.lastName,
      email: User.email,
      address: User.address,
      bio: User.bio,
      occupation: User.occupation,
      expertise: User.expertise,
      type: User.type,
    };
    users.push(User);
    return res.status(201).json({
      status: '201',
      message: 'user added',
      token,
      data,
    });
  },

  login: (req, res) => {
    let data = '';
    const { email } = req.body;

    const { error } = Joi.validate(req.body, userSignin);
    if (error) {
      return customize.validateError(req, res, error, 400);
    }

    const userData = req.body;
    let token = '';
    users.map((user) => {
      if (user.email === userData.email && hashpassword.compareSync(userData.password, user.password)) {
        token = getToken(email);
        data = {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          address: user.address,
          bio: user.bio,
          occupation: user.occupation,
          expertise: user.expertise,
          type: user.type,
        };
      }
    });


    if (!data) {
      return res.status(404).send({
        status: 404,
        message: 'User not found, Incorrect email or password',
      });
    }
    return res.status(200).send({
      status: '200',
      message: 'login successfuly',
      token,
      data,
    });
  },

  getUsers: (req, res) => {
    const data = removePass(users);
    res.status(200).json({
      status: '200',
      message: 'success',
      data,
    });
  },

  getUser: (req, res) => {
    if (/[^0-9]+/g.test(req.params.id)) {
      return res.status(400).send({
        status: '400',
        error: 'URL paramentor must be a number',
      });
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
  },
  updateUser: (req, res) => {
    if (/[^0-9]+/g.test(req.params.userId)) {
      return res.status(400).send({
        status: '400',
        error: 'user id on URL must be a number',
      });
    }
    const id = parseInt(req.params.userId, 10);
    let data;
    users.map((userToUpdate) => {
      if (userToUpdate.id === id) {
        userToUpdate.type = 'mentor';
        data = {
          id: userToUpdate.id,
          firstName: userToUpdate.firstName,
          lastName: userToUpdate.lastName,
          email: userToUpdate.email,
          address: userToUpdate.address,
          bio: userToUpdate.bio,
          occupation: userToUpdate.occupation,
          expertise: userToUpdate.expertise,
          type: userToUpdate.type,
        };
      }
    });

    if (!data) {
      return res.status(404).send({
        status: '404',
        message: 'user not found',
      });
    }
    return res.status(201).send({
      status: '201',
      message: 'user upDate successfully',
      data,
    });
  },

  getMentors: (req, res) => {
    let data = [];
    users.map((mentor) => {
      if (mentor.type === 'mentor') {
        data.push(mentor);
      }
    });
    data = removePass(data);
    return res.status(200).json({
      status: '200',
      message: 'success',
      data,
    });
  },

  getMentor: (req, res) => {
    if (/[^0-9]+/g.test(req.params.mentorId)) {
      return res.status(400).send({
        status: '400',
        error: 'URL paramentor must be a number',
      });
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
  },
};

export default User;
