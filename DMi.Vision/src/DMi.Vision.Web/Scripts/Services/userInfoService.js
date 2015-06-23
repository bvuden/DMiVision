﻿(function () {
    'use strict';
    angular.module('userInfoService', ['ngResource','appVision.config'])
        .factory('UserInfo', ['$resource', 'appConfig',
    function ($resource, appConfig) {
        var resource =
          $resource('http://:domain/api/users/:id', {
              domain: appConfig.backendDomain,
              id: '@id'
          });

        return resource;
    }
        ])



})();