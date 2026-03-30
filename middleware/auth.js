module.exports.isAdmin = (req, res, next) => {
  if (req.session.isAdmin) return next();
  req.flash('error', 'Please login to access the admin panel.');
  res.redirect('/admin/login');
};

module.exports.isGuest = (req, res, next) => {
  if (!req.session.isAdmin) return next();
  res.redirect('/admin/dashboard');
};
