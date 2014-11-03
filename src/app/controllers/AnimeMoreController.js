(function() {
	angular.module('app.controllers')
		.controller('AnimeMoreController', function($scope, $modalInstance, $timeout, data, AnimesFactory) {
			console.log('AnimeMoreController');

			$scope.anime = data;

			AnimesFactory.setBackgroundImage(data.id);
			AnimesFactory.setTorrentUrl(data.id);
			AnimesFactory.setYoutubeUrl(data.id);

			$scope.$watch(
				function() {
					return AnimesFactory.isDetailForAnimePopulated(data.id);
				},
				function(newValue) {
					$scope.anime.detail = newValue;
				}
			);
			
			$scope.watchEpisode = function(episode) {

				//AnimesFactory.setTorrentUrl(data.id);
			};

			$scope.close = function() {
				$modalInstance.close();
			};
		});
})();