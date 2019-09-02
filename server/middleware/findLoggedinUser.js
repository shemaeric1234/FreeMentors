import users from '../models/users';

export const admin = (req, res, next) => {
  let existAdmin = '';
  users.map((ExistUser) => {
    if (ExistUser.email === req.user.payLoad && ExistUser.type === 'admin') {
      existAdmin = ExistUser;
    }
  });

  if (existAdmin) {
    req.user = existAdmin;
    next();
  } else {
    return res.status(403).send({
      success: 'fail',
      message: 'you are not allowed this kind of request only admin',
    });
  }
};

export const mentor = (req, res, next) => {
  let existMentor = '';
  users.map((ExistUser) => {
    if (ExistUser.email === req.user.payLoad && ExistUser.type === 'mentor') {
      existMentor = ExistUser;
    }
  });

  if (existMentor) {
    req.user = existMentor;
    next();
  } else {
    return res.status(403).send({
      success: 'fail',
      message: 'you are not allowed this kind of request only mentor',
    });
  }
};


export const mentee = (req, res, next) => {
  let existMentee = '';
  users.map((ExistUser) => {
    if (ExistUser.email === req.user.payLoad && ExistUser.type === 'mentee') {
      existMentee = ExistUser;
    }
  });

  if (existMentee) {
    req.user = existMentee;
    next();
  } else {
    return res.status(403).send({
      success: 'fail',
      message: 'you are not allowed this kind of request only mentee',
    });
  }
};


export const menteeOrMentor = (req, res, next) => {
  let existMenteeORmentor = '';
  users.map((ExistUser) => {
    if (ExistUser.email === req.user.payLoad && (ExistUser.type === 'mentee' || ExistUser.type === 'mentor')) {
      existMenteeORmentor = ExistUser;
    }
  });

  if (existMenteeORmentor) {
    req.user = existMenteeORmentor;
    next();
  } else {
    return res.status(403).send({
      success: 'fail',
      message: 'you are not allowed this kind of request only mentee or mentor',
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
      success: 'fail',
      message: 'you are not allowed this kind of request only mentor or admin',
    });
  }
};
