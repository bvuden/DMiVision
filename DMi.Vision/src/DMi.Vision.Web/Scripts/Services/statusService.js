(function () {
    'use strict';
    angular.module('statusService', ['ngResource'])
        .factory('Status', ['$resource',
    function ($resource) {
        var resource =
          $resource('http://localhost:port/api/features/:featureId/status/:id', {
              port: ":1482",
              id: '@id',
              featureId: '@featureId'
          }, {
              query: { isArray: true, url: 'http://localhost:port/api/status' },
              update: { method: 'PUT' }
          });

        return resource;
    }
        ])
})();