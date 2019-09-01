import jwt from 'jsonwebtoken';
import keys from '../config/keys';

const hasSiggned = (req, res, next) => {
  if (req.headers.authorization === undefined) {
    return res.status(403).send({
      error: 'Please Set The Authorization Header!',
    });
  }
  const token = req.headers.authorization.split(' ')[1];
  if (!token) {
    return res.status(403).send({
      error: 'No token provided, Access Denied!',
    });
  }

  try {
    const decodedToken = jwt.verify(token, keys);
    req.user = decodedToken;
    return next();
  } catch (error) {
    return res.status(403).send({
      error: 'You provided the invalid token!',
    });
  }
};
export default hasSiggned;
