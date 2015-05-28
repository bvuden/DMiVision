(function () {
    'use strict';

    angular
        .module('appVision')
        .controller('FeaturesListController', FeaturesListController)
        .controller('FeaturesDetailController', FeaturesDetailController)
        .controller('FeaturesAddController', FeaturesAddController);


    /* List Controller*/
    FeaturesListController.$inject = ['$scope', 'Feature'];

    function FeaturesListController($scope, Feature) {
        $scope.features = Feature.query();
        console.log("wzz");
        $scope.$on('oauth:login', function (event, token) {
            console.log('yo');
            console.log(token);
            sessionStorage.setItem("accessToken", token.access_token);
            //$scope.accessToken = token.access_token;
            //console.log($scope.accessToken);
            console.log(sessionStorage.getItem("accessToken"));
        });


        $scope.$on('oauth:logout', function (event) {
            console.log("logging out");
            $scope.accessToken = null;
        });
    }

    /* Details Controller */
    FeaturesDetailController.$inject = ['$scope', '$routeParams', '$location', 'Feature'];

    function FeaturesDetailController($scope, $routeParams, $location, Feature) {
        $scope.feature = Feature.get({ id: $routeParams.id });        
    }


    /* Create Controller */
    FeaturesAddController.$inject = ['$scope', '$location', 'Feature'];

    function FeaturesAddController($scope, $location, Feature) {
        $scope.feature = new Feature();
        $scope.add = function () {
            $scope.feature.$save(
                //succes
                function () {
                $location.path('/');
                },
                //error
                function (error) {
                    _showValidationErrors($scope,error)
                }
            );
        };
    }

    /* Utility Functions */
    function _showValidationErrors($scope, error) {
        $scope.validationErrors = [];
        if (error.data && angular.isObject(error.data)) {
            for (var key in error.data) {
                $scope.validationErrors.push(error.data[key][0]);
            }
        } else {
            $scope.validationErrors.push('Could not add feature.');
        };
    }
})();
