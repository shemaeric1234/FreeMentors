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
}

export default User;
