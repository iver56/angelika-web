angelikaServices.service('AuthService', function($http, cfg, $state) {
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
  };

  this.logout = function() {
    delete $http.defaults.headers.common.Authorization;
  };
});
