angelikaServices.service('AuthService', function($http, cfg) {
  var that = this;
  this.login = function(username, password, cb) {
    $http.post(cfg.apiUrl + '/api-token-auth/', {username: username, password: password})
      .success(function(data) {
        that.setToken(data.token);
        cb({status: 'success'});
      })
      .error(function(data, status, headers, config) {
        cb({status: 'error'});
      });
  };

  this.setToken = function(token) {
    $http.defaults.headers.common.Authorization = "Token " + token;
    simpleStorage.set('authToken', token, {TTL: 7200000 /*2h*/});
  };

  this.logOut = function() {
    delete $http.defaults.headers.common.Authorization;
    simpleStorage.deleteKey('authToken');
  };

  this.tryLoginFromMemory = function() {
    var cachedToken = simpleStorage.get('authToken');
    if (cachedToken) {
      this.setToken(cachedToken);
      return true;
    } else {
      return false;
    }
  };

  this.isLoggedIn = function() {
    return typeof $http.defaults.headers.common.Authorization === 'undefined';
  }
});
