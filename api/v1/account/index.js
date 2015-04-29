module.exports = function() {
  this.get('/', function(req, res) {
    res.send('Account OK');
  });
}