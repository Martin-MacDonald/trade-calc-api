const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    req.session.destroy();
    res.sendStatus(401);
  }
};

export default isAuthenticated;
