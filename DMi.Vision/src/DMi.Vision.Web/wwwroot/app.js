!function() {
    "use strict";
    angular.module("app", [ "featuresService" ]);
}(), function() {
    "use strict";
    function a(a, b) {
        a.features = b.query();
    }
    angular.module("app").controller("featuresController", a), a.$inject = [ "$scope", "Features" ];
}(), function() {
    "use strict";
    var a = angular.module("featuresService", [ "ngResource" ]);
    a.factory("Features", [ "$resource", function(a) {
        return a("http://localhost:1482/api/features", {}, {
            query: {
                method: "GET",
                params: {},
                isArray: !0
            }
        });
    } ]);
}();