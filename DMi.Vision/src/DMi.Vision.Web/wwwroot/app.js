!function() {
    "use strict";
    function a(a, b) {
        a.when("/", {
            controller: "MainController"
        }).when("/features", {
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
    a.$inject = [ "$routeProvider", "$locationProvider" ], angular.module("appVision", [ "afOAuth2", "ngRoute", "ngStorage", "featuresService", "votesService", "userInfoService" ]).directive("spinner", [ "$timeout", function(a) {
        return {
            restrict: "E",
            template: '<div id="overlay"></div>',
            scope: {
                show: "=",
                delay: "@"
            },
            link: function(b, c, d) {
                function e() {
                    i || (i = a(g.bind(this, !0), h()));
                }
                function f() {
                    i && a.cancel(i), i = null, g(!1);
                }
                function g(a) {
                    a ? c.css({
                        display: ""
                    }) : c.css({
                        display: "none"
                    });
                }
                function h() {
                    var a = parseInt(b.delay);
                    return angular.isNumber(a) ? a : 200;
                }
                var i;
                b.$watch("show", function(a) {
                    a ? e() : f();
                });
            }
        };
    } ]).config(a);
}(), function() {
    "use strict";
    function a(a, b, c, d) {
        d.setTempAvailableVotePoints(d.availableVotePoints()), d.loading = !0, c.query(function(b) {
            a.features = b.Features, a.userInfo = d, a.descriptionMaxSize = 500, d.loading = !1;
        });
    }
    function b(a, b, c, d, e, g, h) {
        e.get({
            id: c.id
        }, function(b) {
            a.feature = b, a.maxPoints = h.availableVotePoints() + b.UserGivenVote.Points, a.isAuthor = h.userId() === b.AuthorId;
        }), a.vote = function() {
            h.setTempAvailableVotePoints(a.maxPoints - a.feature.UserGivenVote.Points);
        }, a.saveVote = function() {
            g.save({
                featureId: c.id
            }, a.feature.UserGivenVote, function() {
                h.setAvailableVotePoints(h.tempAvailableVotePoints()), d.path("/features");
            }, function(b) {
                f(a, b);
            });
        }, a.deleteVote = function() {
            g["delete"]({
                featureId: c.id,
                id: a.feature.UserGivenVote.Id
            }, function(a) {
                h.setAvailableVotePoints(a.AvailableVotePoints), d.path("/features");
            }, function(b) {
                f(a, b);
            });
        };
    }
    function c(a, b, c, d, e) {
        a.feature = new d(), a.maxPoints = e.availableVotePoints(), a.vote = function() {
            e.setTempAvailableVotePoints(a.maxPoints - a.feature.UserGivenVote.Points);
        }, a.add = function() {
            a.feature.$save(function() {
                e.setAvailableVotePoints(e.tempAvailableVotePoints()), c.path("/features");
            }, function(b) {
                f(a, b);
            });
        };
    }
    function d(a, b, c, d, e) {
        d.get({
            id: b.id
        }, function(b) {
            a.feature = b, a.maxPoints = e.availableVotePoints() + b.UserGivenVote.Points;
        }), a.vote = function() {
            e.setTempAvailableVotePoints(a.maxPoints - a.feature.UserGivenVote.Points);
        }, a.edit = function() {
            a.feature.$update({
                id: b.id
            }, function() {
                e.setAvailableVotePoints(e.tempAvailableVotePoints()), c.path("/features");
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
                id: b.id
            }, function() {
                c.path("/features");
            });
        };
    }
    function f(a, b) {
        if (a.validationErrors = [], b.data && angular.isObject(b.data)) for (var c in b.data) a.validationErrors.push(b.data[c][0]); else a.validationErrors.push("Could not add feature.");
    }
    angular.module("appVision").controller("FeaturesListController", a).controller("FeaturesDetailController", b).controller("FeaturesAddController", c).controller("FeaturesEditController", d).controller("FeaturesDeleteController", e), 
    a.$inject = [ "$scope", "$sessionStorage", "Feature", "Shared" ], b.$inject = [ "$scope", "$sessionStorage", "$routeParams", "$location", "Feature", "Vote", "Shared" ], 
    c.$inject = [ "$scope", "$sessionStorage", "$location", "Feature", "Shared" ], d.$inject = [ "$scope", "$routeParams", "$location", "Feature", "Shared" ], 
    e.$inject = [ "$scope", "$routeParams", "$location", "Feature" ];
}(), function() {
    "use strict";
    function a(a, b, c, d, e, f) {
        if (f.set(), void 0 != c.token) {
            var g = jwt_decode(c.token.access_token).sub;
            d.get({
                id: g
            }, function(b) {
                e.setAvailableVotePoints(b.AvailableVotePoints), e.setTempAvailableVotePoints(b.AvailableVotePoints), 
                e.setUserId(b.UserId), e.setUserName(b.Name), a.userInfo = e;
            }), b.path("/features");
        }
    }
    angular.module("appVision").controller("MainController", a), a.$inject = [ "$scope", "$location", "$sessionStorage", "UserInfo", "Shared", "AccessToken" ];
}(), function() {
    function a() {
        var a, b, c, d, e = !1;
        return {
            loading: function() {
                return e;
            },
            setLoading: function(a) {
                e = a;
            },
            userId: function() {
                return c;
            },
            setUserId: function(a) {
                c = a;
            },
            userName: function() {
                return d;
            },
            setUserName: function(a) {
                d = a;
            },
            availableVotePoints: function() {
                return a;
            },
            setAvailableVotePoints: function(b) {
                a = b;
            },
            tempAvailableVotePoints: function() {
                return b;
            },
            setTempAvailableVotePoints: function(a) {
                b = a;
            }
        };
    }
    angular.module("appVision").factory("Shared", a);
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
}(), function() {
    "use strict";
    angular.module("userInfoService", [ "ngResource" ]).factory("UserInfo", [ "$resource", function(a) {
        var b = a("http://localhost:port/api/users/:id", {
            port: ":1482",
            id: "@id"
        });
        return b;
    } ]);
}(), function() {
    "use strict";
    angular.module("votesService", [ "ngResource" ]).factory("Vote", [ "$resource", function(a) {
        var b = a("http://localhost:port/api/features/:featureId/votes/:id", {
            port: ":1482",
            id: "@id",
            featureId: "@featureId"
        }, {});
        return b;
    } ]);
}();