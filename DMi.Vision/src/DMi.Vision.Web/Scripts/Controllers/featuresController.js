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
            $scope.feature.$save(function () {
                $location.path('/');
            });
        };
    }
})();
