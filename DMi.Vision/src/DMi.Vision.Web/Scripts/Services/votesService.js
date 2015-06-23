(function () {
    'use strict';
    angular.module('votesService', ['ngResource'])
        .factory('Vote', ['$resource',
    function ($resource) {
        var resource =
          $resource('http://:domain:port/api/features/:featureId/votes/:id', {
              domain: "dmivisionapi.azurewebsites.net",//"localhost",
              port: "", //":1482",
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