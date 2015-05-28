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
        }), b.html5Mode(!0).hashPrefix("!");
    }
    a.$inject = [ "$routeProvider", "$locationProvider" ], angular.module("appVision", [ "oauth", "ngRoute", "featuresService" ]).config(a);
}(), function() {
    "use strict";
    function a(a, b) {
        a.features = b.query(), console.log("wzz"), a.$on("oauth:login", function(a, b) {
            console.log("yo"), console.log(b), sessionStorage.setItem("accessToken", b.access_token), 
            console.log(sessionStorage.getItem("accessToken"));
        }), a.$on("oauth:logout", function(b) {
            console.log("logging out"), a.accessToken = null;
        });
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
    angular.module("appVision").controller("FeaturesListController", a).controller("FeaturesDetailController", b).controller("FeaturesAddController", c), 
    a.$inject = [ "$scope", "Feature" ], b.$inject = [ "$scope", "$routeParams", "$location", "Feature" ], 
    c.$inject = [ "$scope", "$location", "Feature" ];
}(), function() {
    "use strict";
    angular.module("featuresService", [ "ngResource" ]).factory("Feature", [ "$resource", function(a) {
        var b = a("http://localhost:port/api/features/:id", {
            port: ":1482",
            id: "@id"
        }, {
            get: {
                headers: {
                    Authorization: "Bearer " + sessionStorage.getItem("accessToken")
                }
            },
            save: {
                headers: {
                    Authorization: "Bearer " + sessionStorage.getItem("accessToken")
                }
            },
            query: {
                isArray: !0,
                headers: {
                    Authorization: "Bearer " + sessionStorage.getItem("accessToken")
                }
            },
            update: {
                method: "PUT",
                headers: {
                    Authorization: "Bearer " + sessionStorage.getItem("accessToken")
                }
            },
            remove: {
                headers: {
                    Authorization: "Bearer " + sessionStorage.getItem("accessToken")
                }
            },
            "delete": {
                headers: {
                    Authorization: "Bearer " + sessionStorage.getItem("accessToken")
                }
            }
        });
        return b;
    } ]);
}();