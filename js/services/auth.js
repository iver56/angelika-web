angelikaServices.service('AuthService', function($http, cfg) {
  var that = this;
  this.login = function(username, password, cb) {
    $http.post(cfg.apiUrl + '/api-token-auth/', {username: username, password: password})
      .success(function(data) {
        that.setToken(data.token, data.role);
        cb({status: 'success', role: data.role});
      })
      .error(function(data, status, headers, config) {
        if (status === 400) {
          cb({status: 'wrongCredentials'});
        } else {
          cb({status: 'serverError'});
        }
      });
  };

  this.setToken = function(token, role) {
    $http.defaults.headers.common.Authorization = "Token " + token;
    simpleStorage.set('authToken', token, {TTL: 7200000 /*2h*/});
    simpleStorage.set('authRole', role, {TTL: 7200000 /*2h*/});
  };

  this.logOut = function() {
    delete $http.defaults.headers.common.Authorization;
    simpleStorage.deleteKey('authToken');
  };

  /**
   * @returns false if failure, role (string) if success
   */
  this.tryLoginFromMemory = function() {
    var cachedToken = simpleStorage.get('authToken');
    var cachedRole = simpleStorage.get('authRole');
    if (cachedToken && cachedRole) {
      this.setToken(cachedToken, cachedRole);
      return cachedRole;
    } else {
      return false;
    }
  };

  this.isLoggedIn = function() {
    return typeof $http.defaults.headers.common.Authorization === 'undefined';
  }
});
