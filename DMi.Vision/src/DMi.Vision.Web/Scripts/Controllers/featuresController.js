(function () {
    'use strict';

    angular
        .module('appVision')
        .controller('FeaturesListController', FeaturesListController)
        .controller('FeaturesDetailController', FeaturesDetailController)
        .controller('FeaturesAddController', FeaturesAddController)
        .controller('FeaturesEditController', FeaturesEditController)
        .controller('FeaturesDeleteController', FeaturesDeleteController);


    /* List Controller*/
    FeaturesListController.$inject = ['$scope', '$sessionStorage', 'Feature', 'Shared'];

    function FeaturesListController($scope, $sessionStorage, Feature, Shared) {

        Shared.loading = true;

        //clean url after login
        if (window.location.href.indexOf('#') > 0) {
            window.location.replace('/');
        }
        
        //reset temp points
        Shared.setTempAvailableVotePoints(Shared.availableVotePoints());
               
        Feature.query(function (response) {
            $scope.features = response.Features;
            $scope.userInfo = Shared;
            $scope.descriptionMaxSize = 500;

            Shared.loading = false;
        });
    }

    /* Details Controller */
    FeaturesDetailController.$inject = ['$scope', '$sessionStorage', '$routeParams', '$location', 'Feature', 'Vote', 'Shared'];

    function FeaturesDetailController($scope, $sessionStorage, $routeParams, $location, Feature, Vote, Shared) {
        Shared.loading = true;
        //get feature data
        Feature.get({ id: $routeParams.id }, function (response) {
            $scope.feature = response;
            //$scope.userInfo = response.UserInfo;            
            //$scope.maxPoints = response.UserInfo.AvailableVotePoints + response.UserGivenVote.Points;
            $scope.maxPoints = Shared.availableVotePoints() + response.UserGivenVote.Points;
            $scope.isAuthor = Shared.userId() === response.AuthorId;

            Shared.loading = false;
        });
        //update available vote points
        $scope.vote = function () {
            Shared.setTempAvailableVotePoints($scope.maxPoints - $scope.feature.UserGivenVote.Points)
        };
        //save vote
        $scope.saveVote = function () {

            Shared.loading = true;

            Vote.save({ featureId: $routeParams.id }, $scope.feature.UserGivenVote,
                    //succes
                    function () {
                        Shared.setAvailableVotePoints(Shared.tempAvailableVotePoints());
                        $location.path('/features');
                    },
                    //error
                    function (error) {
                        _showValidationErrors($scope, error)
                    }
                );
        };
        //revoke vote
        $scope.deleteVote = function () {
            
            Shared.loading = true;

            Vote.delete({ featureId: $routeParams.id, id: $scope.feature.UserGivenVote.Id },
                    //succes
                    function (response) {
                        Shared.setAvailableVotePoints(response.AvailableVotePoints)
                        $location.path('/features');
                    },
                    //error
                    function (error) {
                        Shared.loading = false;
                        _showValidationErrors($scope, error)
                    }
                );
        };
    }

    /* Create Controller */
    FeaturesAddController.$inject = ['$scope', '$sessionStorage', '$location', 'Feature', 'Shared'];

    function FeaturesAddController($scope, $sessionStorage, $location, Feature, Shared) {
        $scope.feature = new Feature();
        $scope.maxPoints  = Shared.availableVotePoints();

        //update available vote points
        $scope.vote = function () {
            Shared.setTempAvailableVotePoints($scope.maxPoints - $scope.feature.UserGivenVote.Points);
        };
        $scope.add = function () {
            $scope.feature.$save(
                //succes
                function () {
                    Shared.setAvailableVotePoints(Shared.tempAvailableVotePoints());
                    $location.path('/features');
                },
                //error
                function (error) {
                    Shared.loading = false;
                    _showValidationErrors($scope, error)
                }
            );
        };
    }


    /* Edit controller */
    FeaturesEditController.$inject = ['$scope', '$routeParams', '$location', 'Feature', 'Shared'];

    function FeaturesEditController($scope, $routeParams, $location, Feature, Shared) {
        Shared.loading = true;
        Feature.get({ id: $routeParams.id }, function (response) {
            $scope.feature = response;
            //$scope.userInfo = response.UserInfo;
            $scope.maxPoints = Shared.availableVotePoints() + response.UserGivenVote.Points;

            Shared.loading = false;
        });

        //update available vote points
        $scope.vote = function () {
            Shared.setTempAvailableVotePoints($scope.maxPoints - $scope.feature.UserGivenVote.Points);
        };

        $scope.edit = function () {
            $scope.feature.$update({ id: $routeParams.id },
                //succes
                function () {
                    Shared.setAvailableVotePoints(Shared.tempAvailableVotePoints());
                    $location.path('/features');
                },
                //error
                function (error) {
                    Shared.loading = false;
                    _showValidationErrors($scope, error)
                }
            );
        }
    }


    /* Delete controller*/
    FeaturesDeleteController.$inject = ['$scope', '$routeParams', '$location', 'Feature'];

    function FeaturesDeleteController($scope, $routeParams, $location, Feature) {
        $scope.feature = Feature.get({ id: $routeParams.id });
        $scope.remove = function () {
            $scope.feature.$remove({ id: $routeParams.id }, function () {
                $location.path('/features');
            });
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
