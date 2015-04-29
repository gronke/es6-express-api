module.exports = function() {

  this.get('/', function(req, res) {
    res.send('test');
  });

  this.follow('account');

}