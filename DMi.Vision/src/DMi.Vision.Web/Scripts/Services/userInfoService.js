(function () {
    'use strict';
    angular.module('userInfoService', ['ngResource'])
        .factory('UserInfo', ['$resource',
    function ($resource) {
        var resource =
          $resource('http://:domain:port/api/users/:id', {
              domain: "dmivisionapi.azurewebsites.net",//"localhost",
              port: "",//":1482",
              id: '@id'
          });

        return resource;
    }
        ])



})();