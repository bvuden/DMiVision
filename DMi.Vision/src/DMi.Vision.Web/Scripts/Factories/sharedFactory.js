(function () {
    'use strict';

    angular
        .module('appVision')
        .factory('Shared', Shared);

    function Shared() {
        var availableVotePoints;
        var tempAvailableVotePoints;
        var userId;
        var userName;
        var loading=false;
        return {
            loading: function () {
                return loading;
            },
            setLoading: function (newValue) {
                loading = newValue;
            },

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
            },
            tempAvailableVotePoints: function () {
                return tempAvailableVotePoints;
            },
            setTempAvailableVotePoints: function (newValue) {
                tempAvailableVotePoints = newValue;
            }
        };
    }
})();