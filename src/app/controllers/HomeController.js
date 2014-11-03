(function() {
	angular.module('app.controllers')
		.controller('HomeController', ['$scope', 'Animes', function($scope, Animes) {
			$scope.animes = Animes;
		}]);
})();