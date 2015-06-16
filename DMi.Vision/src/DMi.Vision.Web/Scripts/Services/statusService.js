(function () {
    'use strict';
    angular.module('statusService', ['ngResource'])
        .factory('Status', ['$resource',
    function ($resource) {
        var resource =
          $resource('http://localhost:port/api/features/:featureId/status', {
              port: ":1482",
              featureId: '@featureId'
          }, {
              query: { isArray: true, url: 'http://localhost:port/api/status' },
              //update: { method: 'PUT' }
          });

        return resource;
    }
        ])
})();