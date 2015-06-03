!function() {
    "use strict";
    function a(a, b) {
        a.when("/", {
            templateUrl: "/Views/list.html",
            controller: "FeaturesListController",
            requireToken: !0
        }).when("/features/add", {
            templateUrl: "/Views/add.html",
            controller: "FeaturesAddController",
            requireToken: !0
        }).when("/features/detail/:id", {
            templateUrl: "/Views/detail.html",
            controller: "FeaturesDetailController",
            requireToken: !0
        }).when("/features/edit/:id", {
            templateUrl: "/Views/edit.html",
            controller: "FeaturesEditController",
            requireToken: !0
        }).when("/features/delete/:id", {
            templateUrl: "/Views/delete.html",
            controller: "FeaturesDeleteController",
            requireToken: !0
        }), b.html5Mode(!0).hashPrefix("!");
    }
    a.$inject = [ "$routeProvider", "$locationProvider" ], angular.module("appVision", [ "afOAuth2", "ngRoute", "ngStorage", "featuresService" ]).config(a);
}(), function() {
    "use strict";
    function a(a, b, c) {
        c.query(function(b) {
            a.features = b.Features, a.userAvailableVotePoints = b.UserAvailableVotePoints;
        }), a.authorId = jwt_decode(b.token.access_token).sub;
    }
    function b(a, b, c, d) {
        d.get({
            id: b.id
        }, function(b) {
            a.vm = b, a.maxPoints = b.UserAvailableVotePoints + b.UserGivenVotePoints;
        }), a.vote = function() {
            a.vm.UserAvailableVotePoints = a.maxPoints - a.vm.UserGivenVotePoints;
        };
    }
    function c(a, b, c) {
        a.feature = new c(), a.add = function() {
            a.feature.$save(function() {
                b.path("/");
            }, function(b) {
                f(a, b);
            });
        };
    }
    function d(a, b, c, d) {
        a.feature = d.get({
            id: b.id
        }), a.edit = function() {
            a.feature.$update({
                id: b.id
            }, function() {
                c.path("/");
            }, function(b) {
                f(a, b);
            });
        };
    }
    function e(a, b, c, d) {
        a.feature = d.get({
            id: b.id
        }), a.remove = function() {
            a.feature.$remove({
                id: a.feature.Id
            }, function() {
                c.path("/");
            });
        };
    }
    function f(a, b) {
        if (a.validationErrors = [], b.data && angular.isObject(b.data)) for (var c in b.data) a.validationErrors.push(b.data[c][0]); else a.validationErrors.push("Could not add feature.");
    }
    angular.module("appVision").controller("FeaturesListController", a).controller("FeaturesDetailController", b).controller("FeaturesAddController", c).controller("FeaturesEditController", d).controller("FeaturesDeleteController", e), 
    a.$inject = [ "$scope", "$sessionStorage", "Feature" ], b.$inject = [ "$scope", "$routeParams", "$location", "Feature" ], 
    c.$inject = [ "$scope", "$location", "Feature" ], d.$inject = [ "$scope", "$routeParams", "$location", "Feature" ], 
    e.$inject = [ "$scope", "$routeParams", "$location", "Feature" ];
}(), function() {
    "use strict";
    angular.module("featuresService", [ "ngResource" ]).factory("Feature", [ "$resource", function(a) {
        var b = a("http://localhost:port/api/features/:id", {
            port: ":1482",
            id: "@id"
        }, {
            query: {
                isArray: !1
            },
            update: {
                method: "PUT"
            }
        });
        return b;
    } ]);
}();