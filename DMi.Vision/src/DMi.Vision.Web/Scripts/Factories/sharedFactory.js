(function () {
    'use strict';

    angular
        .module('appVision')
        .factory('Shared', Shared);

    function Shared() {
        var availableVotePoints;
        var userId;
        return {
            userId: function () {
                return userId;
            },
            setUserId: function (newValue) {
                userId = newValue;
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