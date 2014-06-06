
var randomString = function (length) {
  var result = '';
  var alphabet = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  while (result.length < length) {
    result += Random.choice(alphabet);
  }
  return result;
}

Meteor.methods({
  generateApiKey: function () {
    if (!this.userId) {
      throw new Meteor.Error(403, 'Access denied.');
    }
    
    var credentials = {
      createdBy : this.userId,
      createdAt : moment().toDate(),
      apiKey    : randomString(12),
      apiSecret : randomString(12),
    }
    
    return _.extend(credentials, {
      _id: Keys.insert(credentials)
    });
  },
});
