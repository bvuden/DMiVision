!function() {
    "use strict";
    function a(a, b) {
        a.when("/", {
            templateUrl: "/Views/loggedout.html",
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
        }).when("/features/:id/status", {
            templateUrl: "/Views/status.html",
            controller: "FeaturesStatusController",
            requireToken: !0
        }), b.html5Mode(!0).hashPrefix("!");
    }
    a.$inject = [ "$routeProvider", "$locationProvider" ], angular.module("appVision", [ "afOAuth2", "ngRoute", "ngStorage", "featuresService", "votesService", "userInfoService", "statusService" ]).directive("spinner", [ "$timeout", function(a) {
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
    function a(a, b, c, d, e, f) {
        function g(b, c) {
            for (var d = JSON.parse(c()["x-pagination"]), e = [], g = 1; g <= d.totalPages; g++) e.push(g);
            d.pageNumbers = e, a.features = b.Features, a.global = f, a.descriptionMaxSize = 500, 
            a.pagination = d, f.loading = !1;
        }
        f.loading = !0, window.location.href.indexOf("#") > 0 && window.location.replace("/"), 
        f.setTempAvailableVotePoints(f.availableVotePoints()), d.query({
            status: f.selectedStatus()
        }, function(a, b) {
            g(a, b);
        }), a.statusFilter = f.selectedStatus(), a.filterByStatus = function() {
            f.loading = !0, d.query({
                pageSize: a.pagination.pageSize,
                status: a.statusFilter
            }, function(b, c) {
                f.setSelectedStatus(a.statusFilter), g(b, c);
            });
        }, a.navigateToPage = function(b) {
            f.loading = !0, d.query({
                page: b,
                pageSize: a.pagination.pageSize,
                status: a.statusFilter
            }, function(a, b) {
                g(a, b);
            });
        };
    }
    function b(a, b, c, d, e, f, h) {
        h.loading = !0, e.get({
            id: c.id
        }, function(b) {
            a.feature = b, a.maxPoints = h.availableVotePoints() + b.UserGivenVote.Points, a.isAuthor = h.userId() === b.AuthorId, 
            h.loading = !1;
        }), a.vote = function() {
            h.setTempAvailableVotePoints(a.maxPoints - a.feature.UserGivenVote.Points);
        }, a.saveVote = function() {
            h.loading = !0, f.save({
                featureId: c.id
            }, a.feature.UserGivenVote, function() {
                h.setAvailableVotePoints(h.tempAvailableVotePoints()), d.path("/features");
            }, function(b) {
                h.loading = !1, g(a, b);
            });
        }, a.deleteVote = function() {
            h.loading = !0, f["delete"]({
                featureId: c.id,
                id: a.feature.UserGivenVote.Id
            }, function(a) {
                h.setAvailableVotePoints(a.AvailableVotePoints), d.path("/features");
            }, function(b) {
                h.loading = !1, g(a, b);
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
                e.loading = !1, g(a, b);
            });
        };
    }
    function d(a, b, c, d, e) {
        e.loading = !0, d.get({
            id: b.id
        }, function(b) {
            a.feature = b, a.maxPoints = e.availableVotePoints() + b.UserGivenVote.Points, e.loading = !1;
        }), a.vote = function() {
            e.setTempAvailableVotePoints(a.maxPoints - a.feature.UserGivenVote.Points);
        }, a.edit = function() {
            a.feature.$update({
                id: b.id
            }, function() {
                e.setAvailableVotePoints(e.tempAvailableVotePoints()), c.path("/features");
            }, function(b) {
                e.loading = !1, g(a, b);
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
    function f(a, b, c, d, e, f) {
        d.get({
            featureId: b.id
        }, function(b) {
            a.feature = b;
        }), a.changeStatus = function() {
            e.loading = !0, d.update({
                featureId: b.id,
                id: a.feature.Status
            }, function() {
                e.loading = !1, f.get({
                    id: e.userId()
                }, function(b) {
                    e.setAvailableVotePoints(b.AvailableVotePoints), e.setTempAvailableVotePoints(b.AvailableVotePoints), 
                    e.setUserId(b.UserId), e.setUserName(b.Name), e.setIsAdmin(b.IsAdmin), a.global = e;
                }), c.path("/features");
            }, function(b) {
                e.loading = !1, g(a, b);
            });
        };
    }
    function g(a, b) {
        if (a.validationErrors = [], b.data && angular.isObject(b.data)) for (var c in b.data) a.validationErrors.push(b.data[c][0]); else a.validationErrors.push("Could not add feature.");
    }
    angular.module("appVision").controller("FeaturesListController", a).controller("FeaturesDetailController", b).controller("FeaturesAddController", c).controller("FeaturesEditController", d).controller("FeaturesDeleteController", e).controller("FeaturesStatusController", f), 
    a.$inject = [ "$scope", "$sessionStorage", "$routeParams", "Feature", "Status", "Shared" ], 
    b.$inject = [ "$scope", "$sessionStorage", "$routeParams", "$location", "Feature", "Vote", "Shared" ], 
    c.$inject = [ "$scope", "$sessionStorage", "$location", "Feature", "Shared" ], d.$inject = [ "$scope", "$routeParams", "$location", "Feature", "Shared" ], 
    e.$inject = [ "$scope", "$routeParams", "$location", "Feature" ], f.$inject = [ "$scope", "$routeParams", "$location", "Status", "Shared", "UserInfo" ];
}(), function() {
    "use strict";
    function a(a, b, c, d, e, f, g) {
        if (g.set(), void 0 != c.token) {
            var h = jwt_decode(c.token.access_token).sub;
            d.get({
                id: h
            }, function(a) {
                f.setAvailableVotePoints(a.AvailableVotePoints), f.setTempAvailableVotePoints(a.AvailableVotePoints), 
                f.setUserId(a.UserId), f.setUserName(a.Name), f.setIsAdmin(a.IsAdmin);
            }), e.query(function(a) {
                f.setStatusOptions(a);
            }), a.global = f, b.path("/features");
        }
    }
    angular.module("appVision").controller("MainController", a), a.$inject = [ "$scope", "$location", "$sessionStorage", "UserInfo", "Status", "Shared", "AccessToken" ];
}(), function() {
    function a() {
        var a, b, c, d, e, f, g, h = !1;
        return {
            statusOptions: function() {
                return f;
            },
            setStatusOptions: function(a) {
                f = a;
            },
            selectedStatus: function() {
                return g;
            },
            setSelectedStatus: function(a) {
                g = a;
            },
            loading: function() {
                return h;
            },
            setLoading: function(a) {
                h = a;
            },
            isAdmin: function() {
                return e;
            },
            setIsAdmin: function(a) {
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
    angular.module("featuresService", [ "ngResource", "appVision.config" ]).factory("Feature", [ "$resource", "appConfig", function(a, b) {
        var c = a("http://:domain/api/features/:id", {
            domain: b.backendDomain,
            id: "@id",
            page: 1,
            pageSize: 10,
            status: null
        }, {
            query: {
                isArray: !1
            },
            update: {
                method: "PUT"
            }
        });
        return c;
    } ]);
}(), function() {
    "use strict";
    angular.module("statusService", [ "ngResource", "appVision.config" ]).factory("Status", [ "$resource", "appConfig", function(a, b) {
        var c = a("http://:domain/api/features/:featureId/status/:id", {
            domain: b.backendDomain,
            id: "@id",
            featureId: "@featureId"
        }, {
            query: {
                isArray: !0,
                url: "http://:domain/api/status"
            },
            update: {
                method: "PUT"
            }
        });
        return c;
    } ]);
}(), function() {
    "use strict";
    angular.module("userInfoService", [ "ngResource", "appVision.config" ]).factory("UserInfo", [ "$resource", "appConfig", function(a, b) {
        var c = a("http://:domain/api/users/:id", {
            domain: b.backendDomain,
            id: "@id"
        });
        return c;
    } ]);
}(), function() {
    "use strict";
    angular.module("votesService", [ "ngResource", "appVision.config" ]).factory("Vote", [ "$resource", "appConfig", function(a, b) {
        var c = a("http://:domain/api/features/:featureId/votes/:id", {
            domain: b.backendDomain,
            id: "@id",
            featureId: "@featureId"
        }, {});
        return c;
    } ]);
}();