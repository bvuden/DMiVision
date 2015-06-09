(function () {
    'use strict';

    angular
        .module('appVision')
        .factory('Shared', Shared);

    function Shared() {
        var availableVotePoints;
        var userId;
        var userName;
        return {
            userId: function () {
                return userId;
            },
            setUserId: function (newValue) {
                userId = newValue;
            },
            userName: function () {
                return userName;
            },
            setUserName: function (newValue) {
                userName = newValue;                
            },
            availableVotePoints: function () {
                return availableVotePoints;
            },
            setAvailableVotePoints: function (newValue) {
                availableVotePoints = newValue;
            }
        };
    }
})();