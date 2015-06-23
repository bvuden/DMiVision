(function () {
    'use strict';
    angular.module('statusService', ['ngResource', 'appVision.config'])
        .factory('Status', ['$resource', 'appConfig',
    function ($resource, appConfig) {
        var resource =
          $resource('http://:domain/api/features/:featureId/status/:id', {
              domain: appConfig.backendDomain,
              id: '@id',
              featureId: '@featureId'
          }, {
              query: { isArray: true, url: 'http://:domain/api/status' },
              update: { method: 'PUT' }
          });

        return resource;
    }
        ])
})();