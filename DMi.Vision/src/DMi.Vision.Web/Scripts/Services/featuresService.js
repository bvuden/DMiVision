(function () {
    'use strict';
    angular.module('featuresService', ['ngResource'])
        .factory('Feature', ['$resource', 
    function ($resource) {
        var resource =
          $resource('http://localhost:port/api/features/:id', {
              port: ":1482",
              id: '@id'
          }, {
              get: { headers: { "Authorization": "Bearer " + sessionStorage.getItem("accessToken") } },
              save: { headers: { "Authorization": "Bearer " + sessionStorage.getItem("accessToken") } },
              query: { isArray:true, headers: { "Authorization": "Bearer " + sessionStorage.getItem("accessToken") } },
              update: { method: 'PUT', headers: { "Authorization": "Bearer " + sessionStorage.getItem("accessToken") } },
              remove: { headers: { "Authorization": "Bearer " + sessionStorage.getItem("accessToken") } },
              delete: { headers: { "Authorization": "Bearer " + sessionStorage.getItem("accessToken") } }

          });

        return resource;
    }
        ])



})();
