(function() {
	var app = angular.module('app', [
		'ngRoute',
		'ngSanitize',
		'app.controllers',
		'app.directives',
		'app.factories',
		'infinite-scroll',
		'ui.bootstrap',
		'dialogs'
	]);

	app.config(function($routeProvider) {
		$routeProvider
			.when('/animes', {
				templateUrl: 'app/templates/animes.html'
			})
			.when('/', {
				redirectTo: function() {
					return '/animes';
				}
			})
			.when('/home', {
				templateUrl: 'app/templates/home.html'
			});
	});
})();