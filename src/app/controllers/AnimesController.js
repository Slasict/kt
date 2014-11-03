(function() {
	angular.module('app.controllers')
		.controller('AnimesController', ['$scope', 'AnimesFactory', '$dialogs', function($scope, AnimesFactory, $dialogs) {
			console.log('Animes Controller');
			$scope.animes = AnimesFactory.getItems();
			$scope.nextPage = AnimesFactory.nextPage;
			AnimesFactory.nextPage();
			
			$scope.$watch('animes', function() {
				console.log('animeschange');
			});
			$scope.moreInfo = function(anime) {
				$dialogs.create('app/templates/animeMore.html', 'AnimeMoreController', anime, {
					key: true,
					back: false,
					windowTemplateUrl: 'app/templates/animeMoreModalTemplate.html'
				});
			};

			// $scope.$emit('EntryLoading');
			// $http.get('http://cdn.animenewsnetwork.com/encyclopedia/reports.xml?id=172&nlist=3', {
			// 	cache: true,
			// 	transformResponse: function(data) {
			// 		jsData = [];
			// 		xml2js.parseString(data, function(err, result) {
			// 			result.report.item.forEach(function(item) {
			// 				jsData.push({
			// 					id: item.$.id,
			// 					name: item.anime[0]._,
			// 					rating: parseInt(item.bayesian_average[0]).toFixed(1)
			// 				});
			// 			});
			// 		});
			// 		return jsData;
			// 	}
			// }).success(function(data, status, headers, config) {
			// 	console.log(data);
			// 	$scope.animes = data;
			// 	$scope.$emit('EntryLoading');
			// });			
		}]);
})();