angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    // Form data for the login modal
    $scope.loginData = {};

    // Create the login modal that we will use later
    $scope.modal = {};

    // Triggered in the login modal to close it
    $scope.closeLogin = function() {
        $scope.modal.hide();
    };

    // Open the login modal
    $scope.login = function() {
        $scope.modal.show();
    };

    // Perform the login action when the user submits the login form
    $scope.doLogin = function() {
        console.log('Doing login', $scope.loginData);

        // Simulate a login delay. Remove this and replace with your login
        // code if using a login system
        $timeout(function() {
            $scope.closeLogin();
        }, 1000);
    };
})

.controller('LeaderboardCtrl', ['$scope', '$http', function($scope, $http) {
    $scope.leaderboard = [];

    loadLeaderboard();

    function loadLeaderboard() {
        //Sort by score, only get top ten
        var scoreUrl = 'https://api.mongolab.com/api/1/databases/ladyboy_challenge/collections/' +
            'leaderBoard?s={"score":-1}&l=10&apiKey=Rds2DpkLY7_VqsMfmgfSo_EdzafbQvOs';

        $http.get(scoreUrl).then(function(rs) {
            $scope.leaderboard = rs.data;
        });
    };
}])
