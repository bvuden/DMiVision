(function () {
    'use strict';
    angular.module('userInfoService', ['ngResource'])
        .factory('UserInfo', ['$resource',
    function ($resource) {
        var resource =
          $resource('http://localhost:port/api/users/:id', {
              port: ":1482",
              id: '@id'
          });

        return resource;
    }
        ])



})();