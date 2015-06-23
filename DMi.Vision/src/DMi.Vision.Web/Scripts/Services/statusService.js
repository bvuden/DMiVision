(function () {
    'use strict';
    angular.module('statusService', ['ngResource'])
        .factory('Status', ['$resource',
    function ($resource) {
        var resource =
          $resource('http://:domain:port/api/features/:featureId/status/:id', {
              domain: "dmivisionapi.azurewebsites.net",//"localhost",
              port: "",//":1482",
              id: '@id',
              featureId: '@featureId'
          }, {
              query: { isArray: true, url: 'http://:domain:port/api/status' },
              update: { method: 'PUT' }
          });

        return resource;
    }
        ])
})();