(function() {
	angular.module('app.directives')
		.directive('starRating', function() {
			return {
				restrict: 'A',
				template: '<i ng-repeat="star in stars" class="fa fa-star"></i>' +
						  '<i ng-show="hasHalf" class="fa fa-star-half"></i>',
				scope: {
					starValue: '='
				},
				link: function(scope, elem, attrs) {
					// 5 star rating
					var stars = Number(scope.starValue).toFixed(0) / 2;
					var decimalPart = Math.floor(stars);
					var isFloat = stars % 1 != 0;
					scope.stars = [];
					for (var i = 0; i < decimalPart; i++) {
						scope.stars.push(i);
					}
					if (isFloat) {
						scope.hasHalf = true;
					}
				}
			};
		});
})();