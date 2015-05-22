!function() {
    "use strict";
    function a(a, b) {
        a.when("/", {
            templateUrl: "/Views/list.html",
            controller: "FeaturesListController"
        }).when("/features/add", {
            templateUrl: "/Views/add.html",
            controller: "FeaturesAddController"
        }).when("/features/detail/:id", {
            templateUrl: "/Views/detail.html",
            controller: "FeaturesDetailController"
        }), b.html5Mode(!0);
    }
    a.$inject = [ "$routeProvider", "$locationProvider" ], angular.module("app", [ "ngRoute", "featuresService" ]).config(a);
}(), function() {
    "use strict";
    function a(a, b) {
        a.features = b.query();
    }
    function b(a, b, c, d) {
        a.feature = d.get({
            id: b.id
        });
    }
    function c(a, b, c) {
        a.feature = new c(), a.add = function() {
            a.feature.$save(function() {
                b.path("/");
            }, function(b) {
                d(a, b);
            });
        };
    }
    function d(a, b) {
        if (a.validationErrors = [], b.data && angular.isObject(b.data)) for (var c in b.data) a.validationErrors.push(b.data[c][0]); else a.validationErrors.push("Could not add feature.");
    }
    angular.module("app").controller("FeaturesListController", a).controller("FeaturesDetailController", b).controller("FeaturesAddController", c), 
    a.$inject = [ "$scope", "Feature" ], b.$inject = [ "$scope", "$routeParams", "$location", "Feature" ], 
    c.$inject = [ "$scope", "$location", "Feature" ];
}(), function() {
    "use strict";
    function a(a) {
        return a("http://localhost:1482/api/features/:id");
    }
    angular.module("featuresService", [ "ngResource" ]).factory("Feature", a), a.$inject = [ "$resource" ];
}();