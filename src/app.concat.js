(function() {
	angular.module('app.controllers', []);
})();
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
(function() {
	angular.module('app.controllers')
		.controller('HomeController', ['$scope', 'Animes', function($scope, Animes) {
			$scope.animes = Animes;
		}]);
})();
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
(function() {
	angular.module('app.directives', []);
})();
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
(function() {
	angular.module('app.factories', []);
})();
(function() {
	var xml2js = require('xml2js').Parser({attrkey: "$$"});
	angular.module('app.factories')
		.factory('ANNTransformer', function($filter) {
			function generateCleanName(name) {
				var cleanName = "";
				var split = /(.*)\s\([^)]*\)/.exec(name);
		        if (split && split.length === 2) {
		            cleanName = split[1].trim();
		        }
		        return cleanName;
			}

			return {
				bulk: function(data) {
					var jsData = [];
					xml2js.parseString(data, function(err, result) {
						result.report.item.forEach(function(item) {
							jsData.push({
								id: item.$$.id,
								name: item.anime[0]._,
								cleanName: generateCleanName(item.anime[0]._),
								rating: parseFloat(item.bayesian_average[0]).toFixed(1),
								detail: false
							});
						});
					});
					return jsData;
				},
				single: function(data) {
					var jsData = {};
					xml2js.parseString(data, function(err, result) {
						if (!result.ann.anime[0]) return;
						result = result.ann.anime[0];
						jsData.id = result.$$.id;
						jsData.type = result.$$.type;
						jsData.runtime = $filter('filter')(result.info, {$$: {type: 'Running time'}})[0]._;
						jsData.summary = $filter('filter')(result.info, {$$: {type: 'Plot Summary'}})[0]._;
						jsData.picture = $filter('filter')(result.info, {$$: {type: 'Picture'}});
						jsData.picture = jsData.picture[jsData.picture.length - 1].img;
						jsData.picture = jsData.picture[jsData.picture.length - 1].$$.src;
						jsData.vintage = {};
						jsData.genres = [];
						jsData.episodes = [];
						jsData.bgPicture = ''; // TODO: set defaut bg picture
						jsData.torrent = '';

						// air start end dates
						var vintages = $filter('filter')(result.info, {$$: {type: 'Vintage'}});
						// if has more than 1 vintage date try to parse according to type
						if (vintages.length > 1) {
							// if not TV or OAV
							if (["TV", "OAV"].indexOf(jsData.type) == -1) {
								jsData.vintage = { "start": vintages[0]._, "end": vintages[0]._ };
							} else {
								for (var i in vintages) {
									var reg = /(.*)\sto\s(.*)/.exec(vintages[i]._);
									if (reg) {
										jsData.vintage = { "start": reg[1], "end": reg[2] };
										break;
									}
								}
							}
						} else {
							var reg = /(.*)\sto\s(.*)/.exec(vintages[0]._);
							if (reg) {
								jsData.vintage = { "start": reg[1], "end": reg[2] };
							} else {
								jsData.vintage = { "start": vintages[0]._, "end": vintages[0]._ };
							}
						}

						var genres = $filter('filter')(result.info, {$$: {type: 'Genres'}});
						if (genres.length > 0) {
							for (var i in genres) {
								jsData.genres.push(genres[i]._)
							}
						}

						var episodes = result.episode;
						if (typeof episodes != 'undefined' && episodes.length > 0) {
							var episodesArray = [];
							for (var i in episodes) {
								if (episodes[i].$$.num != "") {
									jsData.episodes.push({
										episodeNumber : episodes[i].$$.num,
										episodeTitle  : episodes[i].title[0]._
									});
								}
							}
						}

					});
					return jsData;
				}
			};
		});
})();
(function() {
	var cheerio = require('cheerio');
	angular.module('app.factories')
		.factory('AnimesFactory', ['$http', 'ANNTransformer', '$filter', function($http, ANNTransformer, $filter) {

			var service   = {};
			var bulkUrl   = "http://cdn.animenewsnetwork.com/encyclopedia/reports.xml?id=172&nlist=6&nskip=";
			var singleUrl = "http://cdn.animenewsnetwork.com/encyclopedia/api.xml?anime=";
			var bgSearchUrl = "https://ajax.googleapis.com/ajax/services/search/images?v=1.0&imgsz=xxlarge&imgtype=photo&safe=active&rsz=1&q=";
			var nyaaSearchUrl = "http://www.nyaa.se/?page=search&cats=1_37&sort=2&term=";
			var ytSearchUrl = "https://gdata.youtube.com/feeds/api/videos?orderby=relevance&max-results=1&v=2&alt=json&fields=entry(media:group(yt:videoid))&q=";
			var items     = [];
			var busy      = false;
			var _skip     = 0;

			function getItemById(id) {
				return $filter('filter')(items, {id: id})[0];
			};

			function toMB(sizeText) {
				// e.g 11 MB, 320 MB, 11 KB
				sizeText = sizeText.split(' ');
				var size = sizeText[0],
					unit = sizeText[1];
				
				if (unit === "KiB") size = size / 1024;
                if (unit === "GiB") size = size * 1024;
                if (unit === "MiB") size = size;
				return size;
			};

			service.nextPage = function() {
				console.log('nextpage');
				if (busy) return;
				busy = true;

				bulkUrl = bulkUrl + _skip;
				console.log('Request to ' + bulkUrl);
				$http.get(bulkUrl, {
					cache: true,
					transformResponse: ANNTransformer.bulk
				}).success(function(data, status, headers, config) {
					console.log('success');
					for (var i in data) {
						(function(i) {
							$http.get(singleUrl + data[i].id, {
								cache: true,
								transformResponse: ANNTransformer.single
							}).success(function(detailData) {
								data[i].detail = detailData;
								console.log('done');
								console.log(detailData);
							});
							items.push(data[i]);
						})(i);
					}
					_skip = items.length;
					busy = false;
					//$scope.animes = data;
					//$scope.$emit('EntryLoading');
				});
			}

			service.getItems = function() {
				return items;
			}

			service.isDetailForAnimePopulated = function(anId) {
				return getItemById(anId).detail;
			}

			service.setBackgroundImage = function(anId) {
				var animeItem = getItemById(anId);
				var anName = animeItem.name;
				$http.get(bgSearchUrl + anName)
					.success(function(imageSearchResult) {
						animeItem.detail.bgPicture = imageSearchResult.responseData.results[0].url;
					});
			}

			service.setTorrentUrl = function(anId) {
				console.log('setting torrent url');
				var animeItem = getItemById(anId);
				var anNameClean = animeItem.cleanName;
				var type = animeItem.detail.type;
				$http.get(nyaaSearchUrl + anNameClean)
					.success(function(nyaaSearchResult) {
						cheegii = cheerio.load(nyaaSearchResult);
						// iterate over each search result
						var list = cheegii('.tlist .tlistrow');
						for (var i = 0; i < list.length; i++) {
							var size = toMB(cheegii('.tlistsize', list[i]).text());
							if (type === 'TV' || type === 'OAV') {
								 if (size >= config.get('TorrentConf.tvEpisodeSizeMin')) {
								 	animeItem.detail.torrent = cheegii('.tlistdownload > a', list[i]).attr('href') + '&magnet=1';
								 	return false;
								 }
							} else {
								if (size >= config.get('TorrentConf.movieSizeMin')) {
								 	animeItem.detail.torrent = cheegii('.tlistdownload > a', list[i]).attr('href') + '&magnet=1';
									return false;
								}
							}
						}
					});
			}

			service.setYoutubeUrl = function(anId) {
				// Only set youtube video for movies or entry with no episode
				var animeItem = getItemById(anId);
				var anTrailerName = animeItem.cleanName + ' trailer';
				if (animeItem.detail.type === "movie" || animeItem.detail.episodes.length === 0) {
					$http.get(ytSearchUrl + anTrailerName)
						.success(function(ytSearchResult) {
							animeItem.detail.youtube = ytSearchResult.feed.entry[0].media$group.yt$videoid.$t;
						});
				}
			}

			return service;
		}]);
})();
(function() {
	angular.module('infinite-scroll', []).
		directive('whenScrolled', function() {
			return function(scope, elm, attr) {
		        var raw = elm[0];
		        elm.bind('scroll', function() {
		            if (raw.scrollTop + raw.offsetHeight >= raw.scrollHeight) {
		                scope.$apply(attr.whenScrolled);
		            }
		        });
		    };
		});
})();
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