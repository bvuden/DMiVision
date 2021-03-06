﻿(function () {
//    'use strict';

    angular
        .module('appVision')
        .factory('Shared', Shared)

    function Shared() {
        var availableVotePoints;
        var tempAvailableVotePoints;
        var userId;
        var userName;
        var isAdmin;
        var loading = false;
        var statusOptions;
        var selectedStatus;
        return {
            statusOptions: function () {
                return statusOptions;
            },
            setStatusOptions: function (newValue) {
                statusOptions = newValue;
            },
            selectedStatus: function () {
                return selectedStatus;
            },
            setSelectedStatus: function (newValue) {
                selectedStatus = newValue;
            },
            loading: function () {
                return loading;
            },
            setLoading: function (newValue) {
                loading = newValue;
            },
            isAdmin: function () {
                return isAdmin;
            },
            setIsAdmin: function (newValue) {
                isAdmin = newValue;
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