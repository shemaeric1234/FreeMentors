import jwt from 'jsonwebtoken';
import tokenKeys from '../config/keys';


const getToken = (payLoad) => {
  const Newtoken = jwt.sign({ payLoad }, tokenKeys, {
    expiresIn: '5h',
  });
  return Newtoken;
};

export default getToken;
