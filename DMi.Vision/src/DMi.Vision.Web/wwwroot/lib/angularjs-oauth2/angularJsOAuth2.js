'use strict';

// Move these to a directive
//var authorizationUrl = 'https://localhost:44313/identity/connect/authorize';
//var client_id = 'implicit';
//var redirect_uri = 'http://localhost:37045/';
//var response_type = "token";
//var scope = "extracurricular";
//var state = Date.now() + "" + Math.random();

angular.module('oauth2.accessToken', ['ngStorage']).factory('AccessToken', ['$rootScope', '$location', '$sessionStorage', '$interval', function ($rootScope, $location, $sessionStorage, $interval) {
    var service = {
        token: null
    };
    var oAuth2HashParams = ['access_token', 'id_token', 'token_type', 'expires_in', 'scope', 'state', 'session_state', 'error', 'error_description'];

    function setExpiresAt(token) {
        if (token) {
            var expires_at = new Date();
            expires_at.setSeconds(expires_at.getSeconds() + parseInt(token.expires_in) - 60); // 60 seconds less to secure browser and response latency
            token.expires_at = expires_at;
        }
    }

    function setTokenFromHashParams(hash) {
        var token = getTokenFromHashParams(hash);
        if (token !== null) {
            setExpiresAt(token);
            $sessionStorage.token = token;
        }
        return token;
    }

    //set interval to check token expiration
    $interval(expired, 2000);
    function expired() {
        var token = $sessionStorage.token;
        var exp = token && token.expires_at && new Date(token.expires_at) < new Date();
        //console.log(exp);
        if (exp) {
            $rootScope.$broadcast('oauth2:authExpired', token);
            $sessionStorage.token = null;           
        }
    };




    function getTokenFromHashParams(hash) {
        var token = {};
        var regex = /([^&=]+)=([^&]*)/g;
        var m;

        while (m = regex.exec(hash)) {
            var param = decodeURIComponent(m[1]);
            var value = decodeURIComponent(m[2]);

            if (oAuth2HashParams.indexOf(param) >= 0) {
                token[param] = value;
            }
        }

        if ((token.access_token && token.expires_in) || token.error) {
            return token;
        }
        return null;
    }


    service.get = function () {
        return this.token;
    };
    service.set = function () {
        
        // Try and get the token from the hash params on the URL
        var hashValues = window.location.hash;
        if (hashValues.length > 0) {
            if (hashValues.indexOf('#') == 0) {
                hashValues = hashValues.substring(1);
            }
            service.token = setTokenFromHashParams(hashValues);
        }

        if (service.token === null) {
            service.token = $sessionStorage.token;
            if (service.token === undefined) {
                service.token = null;
            }
        }

        if (service.token && service.token.error) {
            var error = service.token.error;
            service.destroy();
            $rootScope.$broadcast('oauth2:authError', error);
        }


        if (service.token !== null) {
            $rootScope.$broadcast('oauth2:authSuccess');
            if ($sessionStorage.oauthRedirectRoute) {
                var path = $sessionStorage.oauthRedirectRoute;
                $sessionStorage.oauthRedirectRoute = null;
                $location.path(path);
            }
        }

        return service.token;
    };
    service.destroy = function () {
        $sessionStorage.token = null;
        delete $sessionStorage.token;
        service.token = null;
    };

    return service;
}]);

// Auth interceptor - if token is missing or has expired this broadcasts an authRequired event
angular.module('oauth2.interceptor', []).factory('OAuth2Interceptor', ['$rootScope', '$q', '$sessionStorage', function ($rootScope, $q, $sessionStorage) {
    var expired = function (token) {
        return (token && token.expires_at && new Date(token.expires_at) < new Date());
    };

    var service = {
        request: function (config) {
            var token = $sessionStorage.token;
            if (expired(token)) {
                $rootScope.$broadcast('oauth2:authExpired', token);
            }
            else if (token) {
                config.headers.Authorization = 'Bearer ' + token.access_token;
                return config;
            }
            return config;
        },
        response: function (response) {
            var token = $sessionStorage.token;
            if (response.status === 401) {
                if (expired(token)) {
                    $rootScope.$broadcast('oauth2:authExpired', token);
                } else {
                    $rootScope.$broadcast('oauth2:unauthorized', token);
                }
            }
            else if (response.status === 500) {
                $rootScope.$broadcast('oauth2:internalservererror');
            }
            return response;
        },
        responseError: function (response) {
            var token = $sessionStorage.token;
            if (response.status === 401) {
                if (expired(token)) {
                    $rootScope.$broadcast('oauth2:authExpired', token);
                } else {
                    $rootScope.$broadcast('oauth2:unauthorized', token);
                }
            }
            else if (response.status === 500) {
                $rootScope.$broadcast('oauth2:internalservererror');
            }
            else if (response.status === 400) {
                return $q.reject(response);
            }
            return response;
        }
    };
    return service;
}]);

// Endpoint wrapper
angular.module('oauth2.endpoint', []).factory('Endpoint', ['AccessToken', '$sessionStorage', function (accessToken, $sessionStorage) {
    var service = {
        authorize: function () {
            window.location.replace(service.url);
        },
        appendSignoutToken: false
    };

    service.signOut = function (token) {
        if (service.signOutUrl && service.signOutUrl.length > 0) {
            var url = service.signOutUrl;
            if (service.appendSignoutToken) {
                url = url + token;
            }
            window.location.replace(url);
        }
    };

    service.init = function (params) {

        service.url = params.authorizationUrl + '?' +
				  	  'client_id=' + encodeURI(params.clientId) + '&' +
				  	  'redirect_uri=' + encodeURI(params.redirectUrl) + '&' +
				  	  'response_type=' + encodeURI(params.responseType) + '&' +
				  	  'scope=' + encodeURI(params.scope) + '&' +
				  	  'state=' + encodeURI(params.state) + '&' +
                      'nonce=' + encodeURI(params.nonce);

        service.signOutUrl = params.signOutUrl;
        service.signOutRedirectUrl = params.signOutRedirectUrl;
        service.state = params.state;
        if (params.signOutAppendToken == 'true') {
            service.appendSignoutToken = true;
        }

        //create checksession url and set as src for iframe
        //TODO get refresh url from directive
        //if (accessToken.token['session_state']) {
        //    document.getElementById("rp").src = "/check_session.html#" +
        //        "session_state=" + encodeURI(accessToken.token['session_state']) +
        //        "&check_session_iframe=" + encodeURI("https://localhost:44300/connect/checksession") +
        //        "&client_id=" + encodeURI(params.clientId);
        //}
        //else {
        //    document.getElementById("rp").src = "about:blank";
        //}

    };

    return service;
}]);

// Open ID directive
angular.module('oauth2.directive', ['angular-md5']).directive('oauth2', ['$rootScope', '$http', '$window', '$location', '$templateCache', '$compile', '$sessionStorage', 'AccessToken', 'Endpoint', 'md5', function ($rootScope, $http, $window, $location, $templateCache, $compile, $sessionStorage, accessToken, endpoint, md5) {
    var definition = {
        restrict: 'E',
        replace: true,
        scope: {
            authorizationUrl: '@',          // authorization server url
            clientId: '@',       			// client ID
            redirectUrl: '@',   			// uri th auth server should redirect to (cannot contain #)
            responseType: '@',  			// defaults to token
            scope: '@',						// scopes required (not the Angular scope - the auth server scopes)
            state: '@',						// state to use for CSRF protection
            template: '@',					// path to a replace template for the button, defaults to the one supplied by bower
            buttonClass: '@',				// the class to use for the sign in / out button - defaults to btn btn-primary
            signInText: '@',				// text for the sign in button
            signOutText: '@',				// text for the sign out button
            signOutUrl: '@',				// url on the authorization server for logging out. Local token is deleted even if no URL is given but that will leave user logged in against STS
            signOutAppendToken: '@',		// defaults to 'false', set to 'true' to append the token to the sign out url
            signOutRedirectUrl: '@',		// url to redirect to after sign out on the STS has completed
            nonce: '@'						// nonce value, optional
        }
    };


    definition.link = function (scope, element, attrs) {
        function compile() {
            var tpl = '<p class="navbar-btn"><a class="{{buttonClass}}" href="#" ng-hide="signedIn" ng-click="signIn()">{{signInText}}</a><a class="{{buttonClass}}" href="#" ng-show="signedIn" ng-click="signOut()">{{signOutText}}</a></p>';
            if (scope.template) {
                $http.get(scope.template, { cache: $templateCache }).success(function (html) {
                    element.html(html);
                    $compile(element.contents())(scope);
                });
            } else {
                element.html(tpl);
                $compile(element.contents())(scope);
            }
        };

        function routeChangeHandler(event, nextRoute) {
            if (nextRoute.$$route && nextRoute.$$route.requireToken) {
                if (!accessToken.get()) {
                    $sessionStorage.oauthRedirectRoute = nextRoute.$$route.originalPath;
                    endpoint.authorize();
                }
            }
        };

        function generateState() {
            var text = ((Date.now() + Math.random()) * Math.random()).toString().replace(".", "");
            return md5.createHash(text);
        }

        function init() {
            scope.buttonClass = scope.buttonClass || 'btn btn-primary';
            scope.signInText = scope.signInText || 'Sign In';
            scope.signOutText = scope.signOutText || 'Sign Out';
            scope.responseType = scope.responseType || 'token';
            scope.signOutUrl = scope.signOutUrl || '';
            scope.signOutRedirectUrl = scope.signOutRedirectUrl || '';
            scope.unauthorizedAccessUrl = scope.unauthorizedAccessUrl || '';
            scope.state = scope.state || generateState();
            scope.nonce = scope.nonce || generateState();

            compile();

            endpoint.init(scope);
            scope.signedIn = accessToken.set() !== null;
            scope.$on('oauth2:authRequired', function () {
                endpoint.authorize();
            });
            scope.$on('oauth2:authError', function () {
                if (scope.unauthorizedAccessUrl.length > 0) {
                    $location.path(scope.unauthorizedAccessUrl);
                }
            });
            scope.$on('oauth2:authExpired', function () {
                scope.signedIn = false;
                $location.path(scope.unauthorizedAccessUrl);
            });
            $rootScope.$on('$routeChangeStart', routeChangeHandler);
        }

        scope.$watch('clientId', function (value) { init(); });

        scope.signedIn = false;

        scope.signIn = function () {
            endpoint.authorize();
        }

        scope.signOut = function () {
            var token = accessToken.get().id_token;
            accessToken.destroy();
            endpoint.signOut(token);
        };
    };

    return definition;
}]);

// App libraries
angular.module('afOAuth2', [
  'oauth2.directive',      // login directive
  'oauth2.accessToken',    // access token service
  'oauth2.endpoint',       // oauth endpoint service
  'oauth2.interceptor'     // bearer token interceptor
]).config(['$locationProvider', '$httpProvider',
	function ($locationProvider, $httpProvider) {
	    $httpProvider.interceptors.push('OAuth2Interceptor');
	}
]);