const paramchecker = (param, type, message) => {
  if (type === 'string' && /[^a-zA-Z]+/g.test(param)) {
    return `URL ${message} must be a a string`;
  }
  if (type === 'number' && /[^0-9]+/g.test(param)) {
    return `URL ${message} must be a number`;
  }
};

export default paramchecker;
