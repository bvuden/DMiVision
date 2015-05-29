(function () {
    'use strict';

    angular
        .module('appVision')
        .controller('FeaturesListController', FeaturesListController)
        .controller('FeaturesDetailController', FeaturesDetailController)
        .controller('FeaturesAddController', FeaturesAddController)
        .controller('FeaturesEditController', FeaturesEditController);



    /* List Controller*/
    FeaturesListController.$inject = ['$scope', '$sessionStorage', 'Feature'];

    function FeaturesListController($scope, $sessionStorage, Feature) {
        $scope.features = Feature.query();
        $scope.authorId = jwt_decode($sessionStorage.token.access_token).sub;
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
                    _showValidationErrors($scope, error)
                }
            );
        };
    }


    /* Edit controller */
    FeaturesEditController.$inject = ['$scope', '$routeParams', '$location', 'Feature'];

    function FeaturesEditController($scope, $routeParams, $location, Feature) {
        $scope.feature = Feature.get({ id: $routeParams.id });
        $scope.edit = function () {            
            $scope.feature.$update({ id: $routeParams.id },
                //succes
                function () {
                    $location.path('/');
                },
                //error
                function (error) {
                    _showValidationErrors($scope, error)
                }
            );
        }
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
