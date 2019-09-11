import database from '../database/dbquerie';

export const admin = async (req, res, next) => {
  const isAdmin = await database.selectBy2colum('users', 'email', req.user.payLoad, 'type', 'admin', 'and');
  if (isAdmin.rowCount !== 0) {
    req.user = isAdmin.rows[0];
    next();
  } else {
    return res.status(403).send({
      status: '403',
      error: 'you are not allowed this kind of request only admin',
    });
  }
};

export const mentor = async (req, res, next) => {
  const isAmentor = await database.selectBy2colum('users', 'email', req.user.payLoad, 'type', 'mentor', 'and');
  if (isAmentor.rowCount !== 0) {
    req.user = isAmentor.rows[0];
    next();
  } else {
    return res.status(403).send({
      status: 'fail',
      error: 'you are not allowed this kind of request only mentor',
    });
  }
};


export const mentee = async (req, res, next) => {
  const isAmentee = await database.selectBy2colum('users', 'email', req.user.payLoad, 'type', 'mentee', 'and');
  if (isAmentee.rowCount !== 0) {
    req.user = isAmentee.rows[0];
    next();
  } else {
    return res.status(403).send({
      status: '403',
      error: 'you are not allowed this kind of request only mentee',
    });
  }
};


export const menteeOrMentor = async (req, res, next) => {
  const isAmenteeOrMentor = await database.selectBy3colum('users', 'email', req.user.payLoad, 'type', 'mentor', 'type', 'mentee', 'and', 'or');
  if (isAmenteeOrMentor.rowCount !== 0) {
    req.user = isAmenteeOrMentor.rows[0];
    next();
  } else {
    return res.status(403).send({
      tatus: '403',
      error: 'you are not allowed this kind of request only mentee or mentor',
    });
  }
};


export const mentorOrAdmin = (req, res, next) => {
  let exisAdminORmentor = '';
  users.map((ExistUser) => {
    if (ExistUser.email === req.user.payLoad && (ExistUser.type === 'mentor' || ExistUser.type === 'admin')) {
      exisAdminORmentor = ExistUser;
    }
  });

  if (exisAdminORmentor) {
    req.user = exisAdminORmentor;
    next();
  } else {
    return res.status(403).send({
      status: '403',
      error: 'you are not allowed this kind of request only mentor or admin',
    });
  }
};
