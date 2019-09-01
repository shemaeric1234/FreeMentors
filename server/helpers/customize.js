class Customize {
  static validateError(req, res, error, status) {
    res.status(status).json({ status, error: error.details[0].message });
  }
}

export default Customize;
