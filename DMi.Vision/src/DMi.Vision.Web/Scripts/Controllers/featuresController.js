(function () {
    'use strict';

    angular
        .module('app')
        .controller('featuresController', featuresController);

    featuresController.$inject = ['$scope', 'Features']; 

    function featuresController($scope, Features) {
        $scope.features = Features.query();

        /* jshint validthis:true */
        //var vm = this;
        //vm.title = 'featuresController';

        //activate();

        //function activate() { }
    }
})();
