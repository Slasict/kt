(function() {
	angular.module('app.directives')
		.directive('youtube', function($sce) {
			return {
				restrict: 'EA',
				scope: {
					code: '='
				},
				replace: true,
				template: '<iframe src="{{url}}" frameborder="0" allowfullscreen></iframe>',
				link: function(scope) {
					scope.$watch('code', function(newVal) {
						if (newVal) {
							scope.url = $sce.trustAsResourceUrl("http://www.youtube.com/embed/" + newVal);
						}
					});
				}
			}
		});	
})();