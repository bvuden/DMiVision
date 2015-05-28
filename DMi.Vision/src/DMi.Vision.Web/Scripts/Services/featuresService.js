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
              query: { method: 'GET', params: {}, isArray: true, headers: { "Authorization": "Bearer " + sessionStorage.getItem("accessToken") } },
              update: { method: 'PUT' }
          });

        //resource = tokenHandler.wrapActions(resource, ["query", "update", "save"]);
        return resource;
    }
        ])

    //    .factory('Feature', ['$resource', 'TokenHandler',
    //function ($resource, tokenHandler) {

    .factory('TokenHandler', function () {
        var tokenHandler = {};
        var token = "none";

        tokenHandler.set = function (newToken) {
            token = newToken;
        };

        tokenHandler.get = function () {
            return sessionStorage.getItem("accessToken");
            //return token;
        };

        // wrap given actions of a resource to send auth token with every
        // request
        tokenHandler.wrapActions = function (resource, actions) {
            // copy original resource
            var wrappedResource = resource;
            for (var i = 0; i < actions.length; i++) {
                tokenWrapper(wrappedResource, actions[i]);
            };
            // return modified copy of resource
            return wrappedResource;
        };

        // wraps resource action to send request with auth token
        var tokenWrapper = function (resource, action) {
            // copy original action
            resource['_' + action] = resource[action];
            // create new action wrapping the original and sending token
            resource[action] = function (data, success, error) {
                return resource['_' + action](
                  angular.extend({}, data || {}, { access_token: tokenHandler.get() }),
                  success,
                  error
                );
            };
        };

        return tokenHandler;
    })



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