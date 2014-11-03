(function() {
	angular.module('app.controllers')
		.controller('MainController', ['$scope', function($scope) {
			$scope.$on('EntryLoading', function() {
				$scope.entryLoading = !$scope.entryLoading;
			});
			$scope.minimize = function() {
				win.minimize();
			};
			$scope.maximize = function() {
				if (win.isMaximized) {
					win.unmaximize();
	                win.isMaximized = false;
	            } else {
	            	win.maximize();
	                win.isMaximized = true;
	            }
			};
			$scope.exit = function() {
				win.close();
			};
		}]);
})();