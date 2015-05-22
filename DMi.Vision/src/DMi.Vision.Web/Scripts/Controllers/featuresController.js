(function () {
    'use strict';

    angular
        .module('app')
        .controller('FeaturesListController', FeaturesListController)
        .controller('FeaturesAddController', FeaturesAddController);


    /* List Controller*/
    FeaturesListController.$inject = ['$scope', 'Feature'];

    function FeaturesListController($scope, Feature) {
        $scope.features = Feature.query();
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
