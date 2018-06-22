module.exports = function() {

  this.get('/', function(req, res) {
    res.send('test');
  });

  // Follow simple paths
  this.follow('account');

  // Follow paths with defined parameters
  this.app.param("inherited", function(req, res, next, value) {
    if (!req.values)
      req.values = {};
    req.values["inherited"] = value;
    next();
  });
  this.follow(":inherited");

};