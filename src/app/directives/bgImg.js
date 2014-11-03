(function() {
	angular.module('app.directives')
		.directive('bgImg', function() {
			return function(scope, element, attrs) {
				attrs.$observe('bgImg', function(value) {
					if (value !== '') {
						element.css({
							'background-image': 'url(' + value + ')'
						});
					}
				});
			};
		});
})();