angelikaServices.service('AuthService', function($http, cfg) {
  var that = this;
  this.login = function(username, password, cb) {
    $http.post(cfg.apiUrl + '/api-token-auth/', {username: username, password: password})
      .success(function(data) {
        that.setToken(data.token, data.group);
        cb({status: 'success', group: data.group});
      })
      .error(function(data, status, headers, config) {
        if (status === 400) {
          cb({status: 'wrongCredentials'});
        } else {
          cb({status: 'serverError'});
        }
      });
  };

  this.setToken = function(token, group) {
    $http.defaults.headers.common.Authorization = "Token " + token;
    simpleStorage.set('authToken', token, {TTL: 7200000 /*2h*/});
    simpleStorage.set('authGroup', group, {TTL: 7200000 /*2h*/});
  };

  this.logOut = function() {
    delete $http.defaults.headers.common.Authorization;
    simpleStorage.deleteKey('authToken');
  };

  /**
   * @returns boolean false if failure, group (string) if success
   */
  this.tryLoginFromMemory = function() {
    var cachedToken = simpleStorage.get('authToken');
    var cachedGroup = simpleStorage.get('authGroup');
    if (cachedToken && cachedGroup) {
      this.setToken(cachedToken, cachedGroup);
      return cachedGroup;
    } else {
      return false;
    }
  };

  this.isLoggedIn = function() {
    return typeof $http.defaults.headers.common.Authorization === 'undefined';
  }
});
