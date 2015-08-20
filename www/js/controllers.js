angular.module('starter.controllers', [])

.controller('menuCtrl', function($scope, $ionicModal, $timeout) {


})

.controller('gameCtrl', ['$scope', '$http', '$state', 'ngAudio', '$ionicLoading', '$ionicModal',
    function($scope, $http, $state, ngAudio, $ionicLoading, $ionicModal) {
        $scope.point = 0;
        $scope.showImg = false;
        $scope.player = {};
        $scope.choices = [];

        var bingoSound = ngAudio.load("https://raw.githubusercontent.com/HoangPHPetProjects/LadyboyChallengeMobile/master/www/sound/right.wav");
        var failSound = ngAudio.load("https://raw.githubusercontent.com/HoangPHPetProjects/LadyboyChallengeMobile/master/www/sound/wrong.wav");
        failSound.volume = 0.3;

        var girls = [];
        var ladyboys = [];

        $scope.$on('$ionicView.enter', function(e) {
            startGame();
        });

        $scope.choiceClick = function(item) {
            $scope.showImg = false;

            if (item.isGirl) {
                bingoSound.play();

                $ionicLoading.show({
                    template: 'Right choice. Good job!!',
                    duration: 1000,
                    noBackdrop: true
                });

                $scope.point++;
                $scope.showImg = true;
                loadImage($scope.point);
            } else {
                failSound.play();

                $ionicModal.fromTemplateUrl('templates/popup.html', {
                    scope: $scope,
                    animation: 'slide-in-up'
                }).then(function(modal) {
                    $scope.modal = modal;
                    $scope.modal.show();
                });
            }
        };

        function loadImage(point) {
            var items = [];
            items.push(getRandomItem(girls));

            if (point < 10) {
                items.push(getRandomItem(ladyboys));
            } else {
                items.push(getRandomItem(ladyboys));
                items.push(getRandomItem(ladyboys));
                items.push(getRandomItem(ladyboys));
            };

            if (point == 10) $scope.warning = 'Things are getting harder. Be careful!!';
            $scope.choices = shuffleArray(items);
        };

        function startGame() {
            $scope.point = 0;
            $scope.showImg = false;
            $scope.player = {};

            var girlUrl = 'https://api.mongolab.com/api/1/databases/ladyboy_challenge/collections/girls?apiKey=Rds2DpkLY7_VqsMfmgfSo_EdzafbQvOs';
            var ldbUrl = 'https://api.mongolab.com/api/1/databases/ladyboy_challenge/collections/ladyboys?apiKey=Rds2DpkLY7_VqsMfmgfSo_EdzafbQvOs';

            $ionicLoading.show({
                template: 'Game initializing',
                noBackdrop: false
            });

            $http.get(girlUrl).then(function(rs) {
                girls = rs.data;
                return ldbUrl;
            }).then($http.get).then(function(rs) {
                ladyboys = rs.data;
                return $scope.point;
            }).then(function() {
                loadImage($scope.point);
                $scope.showImg = true;
                $ionicLoading.hide();
            });
        };

        $scope.sendScore = function() {

            var scoreUrl = 'https://api.mongolab.com/api/1/databases/ladyboy_challenge/collections/leaderBoard?apiKey=Rds2DpkLY7_VqsMfmgfSo_EdzafbQvOs';
            var entry = {
                name: $scope.player.name,
                score: $scope.point
            };

            $ionicLoading.show({
                template: 'Summiting your score, ' + entry.name,
                noBackdrop: false
            });

            $http.post(scoreUrl, entry).then(function() {
                $scope.modal.hide();
                $ionicLoading.hide();
            });
            $state.go('menu');
        }

        $scope.replay = function() {
            $scope.modal.hide();
            startGame();
        }

        $scope.backToMenu = function() {
            $scope.modal.hide();
            $state.go('menu');
        }
    }
])

.controller('leaderboardCtrl', ['$scope', '$http', '$ionicLoading', function($scope, $http, $ionicLoading) {
    $scope.leaderboard = [];

    loadLeaderboard();

    function loadLeaderboard() {
        //Sort by score, only get top ten
        var scoreUrl = 'https://api.mongolab.com/api/1/databases/ladyboy_challenge/collections/' +
            'leaderBoard?s={"score":-1}&l=10&apiKey=Rds2DpkLY7_VqsMfmgfSo_EdzafbQvOs';
        $ionicLoading.show({
            template: 'Loading score',
            noBackdrop: false
        });
        $http.get(scoreUrl).then(function(rs) {
            $scope.leaderboard = rs.data;
            $ionicLoading.hide();
        });
    };
}])
