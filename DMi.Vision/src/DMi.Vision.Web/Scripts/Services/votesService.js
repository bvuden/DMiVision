(function () {
    'use strict';
    angular.module('votesService', ['ngResource', 'appVision.config'])
        .factory('Vote', ['$resource', 'appConfig',
    function ($resource, appConfig) {
        var resource =
          $resource('http://:domain/api/features/:featureId/votes/:id', {
              domain: appConfig.backendDomain,
              id: '@id',
              featureId: '@featureId'
          }, {
              //query: { isArray: false },
              //update: { method: 'PUT' }
          });

        return resource;
    }
        ])



})();