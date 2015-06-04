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
    FeaturesListController.$inject = ['$scope', '$sessionStorage', 'Feature'];

    function FeaturesListController($scope, $sessionStorage, Feature) {
        Feature.query(function (response) {
            $scope.features = response.Features;
            $scope.userInfo = response.UserInfo;
        });
        //$scope.authorId = jwt_decode($sessionStorage.token.access_token).sub;
    }

    /* Details Controller */
    FeaturesDetailController.$inject = ['$scope', '$sessionStorage', '$routeParams', '$location', 'Feature', 'Vote'];

    function FeaturesDetailController($scope, $sessionStorage, $routeParams, $location, Feature, Vote) {
        //get feature data
        Feature.get({ id: $routeParams.id }, function (response) {
            $scope.feature = response;
            $scope.userInfo = response.UserInfo;
            $scope.maxPoints = response.UserInfo.AvailableVotePoints + response.UserGivenVote.Points;
            $scope.isAuthor = response.UserInfo.UserId === response.AuthorId;
        });
        //update available vote points
        $scope.vote = function () {
            $scope.userInfo.AvailableVotePoints = $scope.maxPoints - $scope.feature.UserGivenVote.Points;
        };
        //save vote
        $scope.saveVote = function () {
            Vote.save({ featureId: $routeParams.id }, $scope.feature.UserGivenVote,
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
        //revoke vote
        $scope.deleteVote = function () {
            Vote.delete({ featureId: $routeParams.id, id: $scope.feature.UserGivenVote.Id },
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

    /* Create Controller */
    FeaturesAddController.$inject = ['$scope', '$location', 'Feature'];

    function FeaturesAddController($scope, $location, Feature) {
        $scope.feature = new Feature();
              
        $scope.maxPoints = 100;
        //update available vote points
        $scope.vote = function () {
            console.log($scope.feature.UserGivenVote.Points);
            $scope.userInfo.AvailableVotePoints = $scope.maxPoints - $scope.feature.UserGivenVote.Points;
        };
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
        Feature.get({ id: $routeParams.id }, function (response) {
            $scope.feature = response;
            $scope.userInfo = response.UserInfo;
            $scope.maxPoints = response.UserInfo.AvailableVotePoints + response.UserGivenVote.Points;
        });

        //update available vote points
        $scope.vote = function () {
            $scope.userInfo.AvailableVotePoints = $scope.maxPoints - $scope.feature.UserGivenVote.Points;
        };

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


    /* Delete controller*/
    FeaturesDeleteController.$inject = ['$scope', '$routeParams', '$location', 'Feature'];

    function FeaturesDeleteController($scope, $routeParams, $location, Feature) {
        $scope.feature = Feature.get({ id: $routeParams.id });
        $scope.remove = function () {
            $scope.feature.$remove({ id: $routeParams.id }, function () {
                $location.path('/');
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
