(function () {
    'use strict';

    angular
        .module('appVision')
        .controller('MainController', MainController);

    MainController.$inject = ['$scope', '$location', '$sessionStorage', 'UserInfo', 'Shared', 'AccessToken'];

    function MainController($scope, $location, $sessionStorage, UserInfo, Shared, AccessToken) {

        //controller gets hit before the oauth directive can set the token in the sessionstorage
        //do this upfront
         AccessToken.set();

        if ($sessionStorage.token != undefined) {
            //get user info
            var userId = jwt_decode($sessionStorage.token.access_token).sub;
            UserInfo.get({ id: userId }, function (response) {
                Shared.setAvailableVotePoints(response.AvailableVotePoints);
                Shared.setUserId(response.UserId);                
                $scope.userInfo = Shared;
            });
            $location.path('/features');
        }



    }


})();
