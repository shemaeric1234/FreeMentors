import hashpassword from 'bcrypt';
import Joi from '@hapi/joi';
import users from '../models/users';
import NewidGeneretor from '../helpers/id_denerator';
import getToken from '../helpers/generateToken';
import { userSignup, userSignin } from '../helpers/validation';
import customize from '../helpers/customize';

class User {
  static register(req, res) {
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
    users.push(User);
    return res.status(201).json({
      token,
      User,
    });
  }

  static login(req, res) {
    let loggedInUser = '';
    const { email } = req.body;

    const { error } = Joi.validate(req.body, userSignin);
    if (error) {
      return customize.validateError(req, res, error, 400);
    }

    const userData = req.body;
    let token = '';
    users.map((user) => {
      // eslint-disable-next-line max-len
      if (user.email === userData.email && hashpassword.compareSync(userData.password, user.password)) {
        token = getToken(email);
        loggedInUser = user;
      }
    });


    if (!loggedInUser) {
      return res.status(404).send({
        success: 'fail',
        message: 'User not found, Incorrect email or password',
      });
    }
    return res.status(200).send({
      success: 'true',
      token,
      loggedInUser,
    });
  }

  static getUsers(req, res) {
    return res.status(200).json({
      users,
    });
  }

}

export default User;
