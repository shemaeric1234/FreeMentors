import hashpassword from 'bcrypt';
import Joi from '@hapi/joi';
import getToken from '../helpers/generateToken';
import { userSignup, userSignin } from '../helpers/validation';
import customize from '../helpers/customize';
import database from '../database/dbquerie';

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

  static async getUser(req, res) {
    const id = parseInt(req.params.id, 10);
    let data = '';
    try {
      data = await database.selectBy('users', 'id', id);
    } catch (error) {
      return res.status(404).send({
        status: '400',
        error: error.message,
      });
    }
    if (data.rowCount === 0) {
      return res.status(404).json({
        status: '404',
        message: 'user not found',
      });
    }
    delete data.rows[0].password;
    return res.status(200).send({
      status: '200',
      message: 'success',
      data: data.rows[0],
    });
  }

  static async updateUser(req, res) {
    const id = parseInt(req.params.id, 10);
    let data1 = '';
    try {
      data1 = await database.selectBy('users', 'id', id);
    } catch (error) {
      return res.status(400).json({
        status: '400',
        error: error.message,
      });
    }

    if (data1.rowCount === 0) {
      return res.status(404).json({
        status: '404',
        error: 'user not found',
      });
    }

    if (data1.rows[0].type !== 'mentee') {
      return res.status(403).send({
        status: '403',
        message: 'Forbiden is not a mentee',
      });
    }
    const data = await database.update('users', 'type', 'mentor', 'id', data1.rows[0].id);
    delete data.rows[0].password;
    return res.status(201).send({
      status: '201',
      message: 'user upDate successfully',
      data: data.rows[0],
    });
  }

  static async getMentors(req, res) {
    const data = await database.selectBy('users', 'type', 'mentor');
    if (data.rowCount === 0) {
      return res.status(404).json({
        status: '404',
        message: 'Mentors Not found',
      });
    }
    for (let u = 0; u < data.rowCount; u += 1) {
      delete data.rows[u].password;
    }
    return res.status(200).json({
      status: '200',
      message: 'success',
      data: data.rows,
    });
  }

  static async getMentor(req, res) {
    const id = parseInt(req.params.id, 10);
    let data = '';
    try {
      data = await database.selectBy2colum('users', 'id', id, 'type', 'mentor', 'and');
    } catch (error) {
      return res.status(400).json({
        status: '400',
        error: error.message,
      });
    }
    if (data.rowCount === 0) {
      return res.status(404).json({
        status: '404',
        message: 'Mentor Not found',
      });
    }
    delete data.rows[0].password;
    return res.status(200).json({
      status: '200',
      message: 'success',
      data: data.rows[0],
    });
  }
}

export default User;
