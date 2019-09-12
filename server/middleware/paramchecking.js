class param {
  static paramchecker(req, res, next) {
    if (/[^0-9]+/g.test(req.params.id)) {
      return res.status(400).send({
        status: '400',
        error: 'URL id must be a number',
      });
    }
    try {
      return next();
    } catch (error) {
      return res.status(400).send({
        status: '400',
        error: 'URL id must be a number',
      });
    }
  }

  static paramcheckerString(req, res, next) {
    if (/[^a-zA-Z]+/g.test(req.params.decision)) {
      return res.status(400).send({
        status: '400',
        error: 'URL id must be a string',
      });
    }
    try {
      return next();
    } catch (error) {
      return res.status(400).send({
        status: '400',
        error: 'URL id must be a string',
      });
    }
  }
}
export default param;

