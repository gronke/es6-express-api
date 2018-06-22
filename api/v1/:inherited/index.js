module.exports = function() {
  this.get('/', function(req, res) {
    res.send(`The inherited value is: ${req.values.inherited}`);
  });
};