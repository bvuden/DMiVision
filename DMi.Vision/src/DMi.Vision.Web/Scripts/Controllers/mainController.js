(function () {
    'use strict';

    angular
        .module('appVision')
        .controller('MainController', MainController);

    MainController.$inject = ['$scope', '$location', '$sessionStorage', 'UserInfo', 'Status', 'Shared', 'AccessToken'];

    function MainController($scope, $location, $sessionStorage, UserInfo, Status, Shared, AccessToken) {

        //controller gets hit before the oauth directive can set the token in the sessionstorage
        //do this upfront
        AccessToken.set();

        console.log($sessionStorage.token);
        if ($sessionStorage.token != undefined) {
            //get user info
            var userId = jwt_decode($sessionStorage.token.access_token).sub;
            UserInfo.get({ id: userId }, function (response) {
                Shared.setAvailableVotePoints(response.AvailableVotePoints);
                Shared.setTempAvailableVotePoints(response.AvailableVotePoints);
                Shared.setUserId(response.UserId);
                Shared.setUserName(response.Name);
                Shared.setIsAdmin(response.IsAdmin);                
            });
            Status.query(function (response) {
                Shared.setStatusOptions(response);                               
            });

            $scope.global = Shared;
            $location.path('/features');
        }



    }


})();
