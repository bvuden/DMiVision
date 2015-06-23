(function () {
    'use strict';
    angular.module('featuresService', ['ngResource', 'appVision.config'])
        .factory('Feature',['$resource','appConfig',
    function ($resource, appConfig) {
        var resource =
          $resource('http://:domain/api/features/:id', {
              domain: appConfig.backendDomain, 
              id: '@id',
              page: 1,
              pageSize: 10,
              status: null,
          }, {
              query: { isArray: false },
              update: { method: 'PUT' }
          });

        return resource;
    }
        ])
})();

//(function () {
//    'use strict';

//    angular
//        .module('featuresService', ['ngResource'])
//        .factory('Feature', Feature);

//    Feature.$inject = ['$resource'];

//    function Feature($resource) {
//        return $resource('http://localhost:1482/api/features/:id');
//    }


//})();
